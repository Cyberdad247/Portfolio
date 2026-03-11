"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LoginFormProps = {
	next: string;
};

export default function LoginForm({ next }: LoginFormProps) {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setMessage("");

		const supabase = createClient();
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
			},
		});

		setMessage(error ? error.message : "Check your email for the sign-in link.");
		setLoading(false);
	};

	return (
		<main className="container py-16">
			<div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8">
				<h1 className="text-3xl font-semibold">Sign in</h1>
				<p className="mt-3 text-white/70">
					Use a magic link to access your workspace.
				</p>

				<form onSubmit={handleMagicLink} className="mt-8 space-y-4">
					<input
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder="you@example.com"
						className="w-full rounded-2xl border border-white/10 bg-white/5 p-3"
						required
					/>
					<button
						type="submit"
						disabled={loading}
						className="rounded-2xl bg-cyan-400 px-5 py-3 font-medium text-black disabled:opacity-60"
					>
						{loading ? "Sending..." : "Send magic link"}
					</button>
				</form>

				{message ? (
					<p className="mt-4 text-sm text-white/70">{message}</p>
				) : null}
			</div>
		</main>
	);
}
