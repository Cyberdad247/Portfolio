export const INTERNAL_ROLES = ["super_admin", "operator"] as const;
export const CLIENT_ADMIN_ROLES = ["client_admin", ...INTERNAL_ROLES] as const;
export const CLIENT_MEMBER_ROLES = [
	"client_member",
	"client_admin",
	...INTERNAL_ROLES,
] as const;

export type AppRole = (typeof CLIENT_MEMBER_ROLES)[number];
