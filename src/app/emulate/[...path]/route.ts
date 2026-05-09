import { createEmulateHandler } from "@emulators/adapter-next";
import google from "@emulators/google";
import { emulateGoogleSeed } from "@/config/emulate-google-seed";

export const { GET, POST, PUT, PATCH, DELETE } = createEmulateHandler({
  services: {
    google: {
      emulator: { default: google },
      seed: emulateGoogleSeed,
    },
  },
});
