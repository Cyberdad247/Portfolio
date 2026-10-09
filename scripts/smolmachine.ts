#!/usr/bin/env npx tsx
/**
 * smolmachine — Camelot-OS Pill Protocol v1.0
 *
 * Compresses a knight dispatch into a zero-dependency .smolmachine.json
 * handoff file for Same-Day client delivery.
 *
 * Usage:
 *   npx tsx scripts/smolmachine.ts --knight <slug> [--out <dir>]
 *
 * Output:
 *   <out>/<slug>.smolmachine.json
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://www.invisionedmarketing.agency";
const CAMELOT_VERSION = "v400.1.0";

interface SmolMachine {
	version: "1.0";
	camelot_os: string;
	generated_at: string;
	knight: {
		slug: string;
		dispatch_url: string;
		qr_src: string;
		source: "marketplace";
	};
	delivery: {
		mode: "same-day";
		isolation: "smolvm";
		iron_gate: "required";
	};
	checksum: string;
}

function buildQrSrc(dispatchUrl: string): string {
	return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(dispatchUrl)}&bgcolor=09090b&color=a855f7&format=svg&qzone=1`;
}

function simpleChecksum(data: string): string {
	let hash = 0;
	for (let i = 0; i < data.length; i++) {
		hash = (hash << 5) - hash + data.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash).toString(16).padStart(8, "0");
}

function buildSmolMachine(slug: string): SmolMachine {
	const dispatchUrl = `${BASE_URL}/tasha?k=${slug}&s=marketplace`;
	const qrSrc = buildQrSrc(dispatchUrl);
	const generatedAt = new Date().toISOString();

	const payload = `${slug}:${dispatchUrl}:${generatedAt}`;

	return {
		version: "1.0",
		camelot_os: CAMELOT_VERSION,
		generated_at: generatedAt,
		knight: {
			slug,
			dispatch_url: dispatchUrl,
			qr_src: qrSrc,
			source: "marketplace",
		},
		delivery: {
			mode: "same-day",
			isolation: "smolvm",
			iron_gate: "required",
		},
		checksum: simpleChecksum(payload),
	};
}

function main() {
	const args = process.argv.slice(2);
	const knightIdx = args.indexOf("--knight");
	const outIdx = args.indexOf("--out");

	if (knightIdx === -1 || !args[knightIdx + 1]) {
		console.error("Usage: npx tsx scripts/smolmachine.ts --knight <slug> [--out <dir>]");
		process.exit(1);
	}

	const slug = args[knightIdx + 1];
	const outDir = outIdx !== -1 && args[outIdx + 1]
		? args[outIdx + 1]
		: resolve(process.cwd(), ".smolmachine");

	mkdirSync(outDir, { recursive: true });

	const pill = buildSmolMachine(slug);
	const outPath = resolve(outDir, `${slug}.smolmachine.json`);

	writeFileSync(outPath, JSON.stringify(pill, null, 2), "utf-8");

	console.log(`[PILL] ✓ ${slug}.smolmachine.json`);
	console.log(`[PILL] dispatch_url: ${pill.knight.dispatch_url}`);
	console.log(`[PILL] checksum: ${pill.checksum}`);
	console.log(`[PILL] out: ${outPath}`);
}

main();
