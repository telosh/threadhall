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
        "rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-200"
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
  const router = useRouter();

  return (
    <button
      type="button"
      className={
        className ??
        "rounded-lg border border-zinc-600 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
      }
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.refresh();
            },
          },
        });
      }}
    >
      サインアウト
    </button>
  );
}
