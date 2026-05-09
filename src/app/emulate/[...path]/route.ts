import { createEmulateHandler } from "@emulators/adapter-next";
import google from "@emulators/google";
import { emulateGoogleSeed } from "@/config/emulate-google-seed";
import { isGoogleEmulatorRuntimeAllowed } from "@/lib/google-emulator-local";

const delegated = createEmulateHandler({
  services: {
    google: {
      emulator: { default: google },
      seed: emulateGoogleSeed,
    },
  },
});

const allow = isGoogleEmulatorRuntimeAllowed();

function notFound() {
  return new Response(null, { status: 404 });
}

export const GET = allow ? delegated.GET : async () => notFound();
export const POST = allow ? delegated.POST : async () => notFound();
export const PUT = allow ? delegated.PUT : async () => notFound();
export const PATCH = allow ? delegated.PATCH : async () => notFound();
export const DELETE = allow ? delegated.DELETE : async () => notFound();
