import type { Metadata } from "next";
import AgencyWebEditor from "@/components/editor/agency-web-editor";

export const metadata: Metadata = {
	title: "Sovereign Web Editor | Invisioned Marketing",
	description:
		"Executive Client Operations & Storefront Editor for Invisioned Marketing. Configure announcements, hero messaging, brand chromatic tokens, and conversational AI updates.",
};

export default function EditorPage() {
	return <AgencyWebEditor />;
}
