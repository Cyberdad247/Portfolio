import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { INTERNAL_ROLES } from "@/lib/auth/roles";
import { getSupabaseEnvSafe } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const isProtected =
		pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
	const isAdminPath = pathname.startsWith("/admin");

	if (!isProtected) {
		return NextResponse.next({
			request,
		});
	}

	const redirectToLogin = () => {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("next", pathname);
		return NextResponse.redirect(url);
	};

	try {
		const response = NextResponse.next({
			request,
		});
		const env = getSupabaseEnvSafe();
		if (!env) {
			// Supabase not configured — allow through without auth
			return response;
		}
		const { url, anonKey } = env;

		const supabase = createServerClient(url, anonKey, {
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(
					cookiesToSet: Array<{
						name: string;
						value: string;
						options?: Parameters<typeof response.cookies.set>[2];
					}>,
				) {
					for (const { name, value, options } of cookiesToSet) {
						request.cookies.set(name, value);
						response.cookies.set(name, value, options);
					}
				},
			},
		});

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return redirectToLogin();
		}

		if (isAdminPath) {
			const { data: profile, error } = await supabase
				.from("profiles")
				.select("system_role")
				.eq("id", user.id)
				.maybeSingle();

			if (error || !profile || !INTERNAL_ROLES.includes(profile.system_role)) {
				const url = request.nextUrl.clone();
				url.pathname = "/dashboard";
				url.searchParams.delete("next");
				return NextResponse.redirect(url);
			}
		}

		return response;
	} catch (error) {
		console.error("Auth middleware failure:", error);
		return redirectToLogin();
	}
}

export const config = {
	matcher: ["/dashboard/:path*", "/admin/:path*"],
};
