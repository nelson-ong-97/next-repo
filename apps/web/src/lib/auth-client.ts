import type { auth } from "@next-turbo/auth";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { polarClient } from "@polar-sh/better-auth";

export const authClient = createAuthClient({
  plugins: [polarClient(), inferAdditionalFields<typeof auth>()],
});
