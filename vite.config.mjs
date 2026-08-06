import { resolve } from "node:path";
import { cp } from "node:fs/promises";
import { defineConfig } from "vite";

const root = process.cwd();
const generatedRoot = resolve(root, ".generated");

export default defineConfig({
  root: generatedRoot,
  server: {
    host: "0.0.0.0",
    allowedHosts: ["4606-119-196-249-47.ngrok-free.app", "172.30.1.25", "leeu-MacBook-Pro-14.local"],
  },
  plugins: [
    {
      name: "copy-classic-static-assets",
      apply: "build",
      async closeBundle() {
        await cp(resolve(root, "src/files"), resolve(root, "dist/src/files"), { recursive: true });
      },
    },
  ],
  build: {
    outDir: resolve(root, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(generatedRoot, "index.html"),
        aboutSummary: resolve(generatedRoot, "about/summary.html"),
        aboutHistory: resolve(generatedRoot, "about/history.html"),
        aboutCertification: resolve(generatedRoot, "about/certification.html"),
        businessAnomix: resolve(generatedRoot, "business/anomix.html"),
        businessBotfender: resolve(generatedRoot, "business/botfender.html"),
        businessGaepan: resolve(generatedRoot, "business/gaepan.html"),
        businessVvms: resolve(generatedRoot, "business/v-vms.html"),
        businessPentraflow: resolve(generatedRoot, "business/pentraflow.html"),
        recruitment: resolve(generatedRoot, "recruitment/recruitment.html"),
        privacy: resolve(generatedRoot, "privacy/privacy.html"),
        contact: resolve(generatedRoot, "contact/contact.html"),
        contactLocation: resolve(generatedRoot, "contact/location.html"),
        contactPartner: resolve(generatedRoot, "contact/partner.html"),
      },
    },
  },
});
