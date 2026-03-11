import LoginForm from "@/components/login-form";

type LoginPageProps = {
	searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const resolvedSearchParams = (await searchParams) ?? {};
	const nextParam = resolvedSearchParams.next;
	const next =
		typeof nextParam === "string" && nextParam.startsWith("/")
			? nextParam
			: "/dashboard";

	return <LoginForm next={next} />;
}
