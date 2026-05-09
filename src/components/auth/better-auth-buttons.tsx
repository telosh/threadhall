"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function BetterAuthGoogleSignIn({
  mode,
  className,
}: {
  mode: "emulate" | "google";
  className?: string;
}) {
  return (
    <button
      type="button"
      className={
        className ??
        "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-on-primary hover:opacity-90"
      }
      onClick={async () => {
        if (mode === "emulate") {
          await authClient.signIn.oauth2({
            providerId: "google-emulate",
            callbackURL: "/",
          });
        } else {
          await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
          });
        }
      }}
    >
      Google で続行
    </button>
  );
}

export function BetterAuthSignOut({
  className,
}: {
  className?: string;
}) {
  const { refresh } = useRouter();

  return (
    <button
      type="button"
      className={
        className ??
        "rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-muted"
      }
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              refresh();
            },
          },
        });
      }}
    >
      サインアウト
    </button>
  );
}
