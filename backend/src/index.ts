import "dotenv/config";
import { createServer } from "node:http";
import { envZod } from "./common/envSanitization.js";
import { expressApplication } from "./app/app.js";

(async function main() {
  try {
    const nodeServer = createServer(await expressApplication());
    const PORT = envZod.PORT ? +envZod.PORT : 8080;

    nodeServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server start at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
})();
