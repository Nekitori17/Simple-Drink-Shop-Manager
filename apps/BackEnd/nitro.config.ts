import { defineNitroConfig } from "nitropack/config";
import { fileURLToPath } from "node:url";

// https://nitro.build/config
export default defineNitroConfig({
  compatibilityDate: "latest",
  srcDir: "server",
  imports: false,
  alias: {
    "@db": fileURLToPath(new URL("./server/db", import.meta.url)),
    "@utils": fileURLToPath(new URL("./server/utils", import.meta.url)),
    "~": fileURLToPath(new URL("./server", import.meta.url)),
  },
  publicAssets: [
    {
      dir: fileURLToPath(new URL("../FrontEnd/dist", import.meta.url)),
      maxAge: 60 * 60 * 24 * 365,
    },
  ],
});
