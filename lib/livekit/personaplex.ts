/**
 * PersonaPlex Client Manager
 *
 * Full-duplex WebRTC voice integration for the Tasha voice receptionist.
 * Manages LiveKit room connections, microphone publishing, remote audio
 * subscription, barge-in detection, and audio level monitoring.
 */

type RoomLike = {
	connect: (url: string, token: string) => Promise<void>;
	disconnect: () => Promise<void>;
	state: string;
	localParticipant: LocalParticipantLike;
	on: (event: string, handler: (...args: unknown[]) => void) => void;
	off: (event: string, handler: (...args: unknown[]) => void) => void;
	remoteParticipants: Map<string, RemoteParticipantLike>;
};

type LocalParticipantLike = {
	setMicrophoneEnabled: (enabled: boolean) => Promise<unknown>;
	getTrackPublications: () => Map<string, TrackPublicationLike>;
	audioTrackPublications: Map<string, TrackPublicationLike>;
};

type RemoteParticipantLike = {
	audioTrackPublications: Map<string, TrackPublicationLike>;
	identity: string;
};

type TrackPublicationLike = {
	track: TrackLike | null;
	setSubscribed: (subscribed: boolean) => void;
};

type TrackLike = {
	attach: (element?: HTMLMediaElement) => HTMLMediaElement;
	detach: () => HTMLMediaElement[];
	sid: string;
	kind: string;
	source: number;
};

type PersonaPlexOptions = {
	/** Callback when a remote audio track is subscribed */
	onRemoteAudioSubscribed?: () => void;
	/** Callback when a remote audio track is unsubscribed */
	onRemoteAudioUnsubscribed?: () => void;
	/** Callback with current audio level (0-1) for visualization */
	onAudioLevelChange?: (level: number) => void;
	/** Callback when barge-in is detected (user speaks over AI) */
	onBargeIn?: () => void;
	/** Callback when connection state changes */
	onConnectionStateChange?: (connected: boolean) => void;
	/** Callback on errors */
	onError?: (error: Error) => void;
	/** Audio level threshold for barge-in detection (0-1, default 0.05) */
	bargeInThreshold?: number;
};

type LiveKitModule = {
	Room: new () => RoomLike;
	RoomEvent: Record<string, string>;
	Track: { Source: Record<string, number> };
};

export class PersonaPlexClient {
	private room: RoomLike | null = null;
	private livekitModule: LiveKitModule | null = null;
	private audioElement: HTMLAudioElement | null = null;
	private audioLevelInterval: ReturnType<typeof setInterval> | null = null;
	private analyserNode: AnalyserNode | null = null;
	private audioContext: AudioContext | null = null;
	private options: PersonaPlexOptions;
	private _isConnected = false;
	private _isListening = false;
	private _isSpeaking = false;
	private _audioLevel = 0;
	private disposed = false;

	constructor(options: PersonaPlexOptions = {}) {
		this.options = {
			bargeInThreshold: 0.05,
			...options,
		};
	}

	get isConnected() {
		return this._isConnected;
	}
	get isListening() {
		return this._isListening;
	}
	get isSpeaking() {
		return this._isSpeaking;
	}
	get audioLevel() {
		return this._audioLevel;
	}

	/**
	 * Dynamically load the livekit-client module.
	 * Returns null if the module is not available.
	 */
	private async loadLiveKit(): Promise<LiveKitModule | null> {
		if (this.livekitModule) return this.livekitModule;

		try {
			const mod = await import("livekit-client");
			this.livekitModule = mod as unknown as LiveKitModule;
			return this.livekitModule;
		} catch {
			return null;
		}
	}

	/**
	 * Check if livekit-client is available in this environment.
	 */
	static async isSupported(): Promise<boolean> {
		try {
			await import("livekit-client");
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Connect to a LiveKit room with audio-only configuration.
	 */
	async connect(url: string, token: string): Promise<void> {
		if (this.disposed) {
			throw new Error("PersonaPlexClient has been disposed");
		}

		const lk = await this.loadLiveKit();
		if (!lk) {
			throw new Error(
				"livekit-client is not available. Install it to use PersonaPlex.",
			);
		}

		try {
			this.room = new lk.Room();
			this.setupRoomEventHandlers(lk);
			await this.room.connect(url, token);
			this._isConnected = true;
			this.options.onConnectionStateChange?.(true);
		} catch (err) {
			this._isConnected = false;
			const error =
				err instanceof Error ? err : new Error("Failed to connect to room");
			this.options.onError?.(error);
			throw error;
		}
	}

	/**
	 * Set up event handlers on the LiveKit room.
	 */
	private setupRoomEventHandlers(lk: LiveKitModule): void {
		const room = this.room;
		if (!room) return;

		room.on(lk.RoomEvent.TrackSubscribed, (...args: unknown[]) => {
			const track = args[0] as TrackLike;
			if (track.kind === "audio") {
				this.handleRemoteAudioSubscribed(track);
			}
		});

		room.on(lk.RoomEvent.TrackUnsubscribed, (...args: unknown[]) => {
			const track = args[0] as TrackLike;
			if (track.kind === "audio") {
				this.handleRemoteAudioUnsubscribed(track);
			}
		});

		room.on(lk.RoomEvent.Disconnected, () => {
			this._isConnected = false;
			this._isListening = false;
			this._isSpeaking = false;
			this.options.onConnectionStateChange?.(false);
		});

		room.on(lk.RoomEvent.ActiveSpeakersChanged, (...args: unknown[]) => {
			const speakers = args[0] as Array<{ identity: string }>;
			this.handleActiveSpeakersChanged(speakers);
		});
	}

	/**
	 * Handle a remote audio track being subscribed (AI voice response).
	 */
	private handleRemoteAudioSubscribed(track: TrackLike): void {
		this._isSpeaking = true;

		if (!this.audioElement) {
			this.audioElement = document.createElement("audio");
			this.audioElement.autoplay = true;
		}

		track.attach(this.audioElement);
		this.startAudioLevelMonitoring();
		this.options.onRemoteAudioSubscribed?.();
	}

	/**
	 * Handle a remote audio track being unsubscribed.
	 */
	private handleRemoteAudioUnsubscribed(track: TrackLike): void {
		this._isSpeaking = false;
		track.detach();
		this.stopAudioLevelMonitoring();
		this.options.onRemoteAudioUnsubscribed?.();
	}

	/**
	 * Handle active speaker changes for barge-in detection.
	 * If the local participant starts speaking while AI is speaking, trigger barge-in.
	 */
	private handleActiveSpeakersChanged(
		speakers: Array<{ identity: string }>,
	): void {
		if (!this.room || !this._isSpeaking) return;

		const localIdentity = this.room.localParticipant as unknown as {
			identity: string;
		};
		const localIsSpeaking = speakers.some(
			(s) => s.identity === localIdentity.identity,
		);

		if (localIsSpeaking && this._isSpeaking) {
			this.options.onBargeIn?.();
		}
	}

	/**
	 * Start monitoring audio levels from the remote audio for waveform visualization.
	 */
	private startAudioLevelMonitoring(): void {
		this.stopAudioLevelMonitoring();

		if (!this.audioElement) return;

		try {
			this.audioContext = new AudioContext();
			const source = this.audioContext.createMediaElementSource(
				this.audioElement,
			);
			this.analyserNode = this.audioContext.createAnalyser();
			this.analyserNode.fftSize = 256;

			source.connect(this.analyserNode);
			this.analyserNode.connect(this.audioContext.destination);

			const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);

			this.audioLevelInterval = setInterval(() => {
				if (!this.analyserNode) return;

				this.analyserNode.getByteFrequencyData(dataArray);

				let sum = 0;
				for (let i = 0; i < dataArray.length; i++) {
					sum += dataArray[i];
				}
				const average = sum / dataArray.length / 255;
				this._audioLevel = average;
				this.options.onAudioLevelChange?.(average);
			}, 50);
		} catch {
			// Audio level monitoring is optional; fail silently
		}
	}

	/**
	 * Stop audio level monitoring.
	 */
	private stopAudioLevelMonitoring(): void {
		if (this.audioLevelInterval) {
			clearInterval(this.audioLevelInterval);
			this.audioLevelInterval = null;
		}

		if (this.audioContext) {
			this.audioContext.close().catch(() => {});
			this.audioContext = null;
		}

		this.analyserNode = null;
		this._audioLevel = 0;
	}

	/**
	 * Enable the local microphone and publish the audio track.
	 */
	async startListening(): Promise<void> {
		if (!this.room || !this._isConnected) {
			throw new Error("Not connected to a room");
		}

		try {
			await this.room.localParticipant.setMicrophoneEnabled(true);
			this._isListening = true;
		} catch (err) {
			const error =
				err instanceof Error ? err : new Error("Failed to enable microphone");
			this.options.onError?.(error);
			throw error;
		}
	}

	/**
	 * Disable the local microphone track.
	 */
	async stopListening(): Promise<void> {
		if (!this.room || !this._isConnected) return;

		try {
			await this.room.localParticipant.setMicrophoneEnabled(false);
			this._isListening = false;
		} catch (err) {
			const error =
				err instanceof Error ? err : new Error("Failed to disable microphone");
			this.options.onError?.(error);
		}
	}

	/**
	 * Gracefully disconnect from the room and clean up all resources.
	 */
	async disconnect(): Promise<void> {
		this.stopAudioLevelMonitoring();

		if (this.audioElement) {
			this.audioElement.srcObject = null;
			this.audioElement.remove();
			this.audioElement = null;
		}

		if (this.room) {
			try {
				await this.room.disconnect();
			} catch {
				// Ignore disconnect errors during cleanup
			}
			this.room = null;
		}

		this._isConnected = false;
		this._isListening = false;
		this._isSpeaking = false;
		this._audioLevel = 0;
		this.options.onConnectionStateChange?.(false);
	}

	/**
	 * Fully dispose of the client. Cannot be reused after this.
	 */
	async dispose(): Promise<void> {
		this.disposed = true;
		await this.disconnect();
	}
}
