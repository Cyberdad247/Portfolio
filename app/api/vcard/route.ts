import { NextResponse } from "next/server";

export async function GET() {
	const vcard = `BEGIN:VCARD
VERSION:3.0
N:Head;VaShawn;;;
FN:VaShawn "Vizion" Head
ORG:Invisioned Marketing
TITLE:Founder & Creative Technologist
TEL;TYPE=CELL,VOICE,PREF:+12165864607
EMAIL;TYPE=WORK,INTERNET,PREF:invisionedmarketing@gmail.com
URL:https://invisionedmarketing.agency
NOTE:Dreams don't come true, visions do. AI-powered strategy, autonomous agents, and digital brand worlds.
REV:${new Date().toISOString()}
END:VCARD`.trim();

	return new NextResponse(vcard, {
		status: 200,
		headers: {
			"Content-Type": "text/vcard; charset=utf-8",
			"Content-Disposition": 'attachment; filename="VaShawn_Vizion_Head.vcf"',
			"Cache-Control": "public, max-age=86400",
		},
	});
}
