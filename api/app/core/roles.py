INTERNAL_ROLES = {"super_admin", "operator"}
CLIENT_ADMIN_ROLES = {"client_admin", *INTERNAL_ROLES}
CLIENT_MEMBER_ROLES = {"client_member", "client_admin", *INTERNAL_ROLES}
