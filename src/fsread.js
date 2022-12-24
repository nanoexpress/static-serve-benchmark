import uWS from "uWebSockets.js";
import path from "path";
import { createReadStream } from "fs";
import { readFile, stat } from "fs/promises";
import { sendFile } from "./helpers/send-file.js";

const port = 4100;

console.log("PID", process.pid);

const app = uWS
  .SSLApp({
    key_file_name: path.resolve("misc/key.pem"),
    cert_file_name: path.resolve("misc/cert.pem"),
    passphrase: "1234",
  })
  .get("/*", async (res, req) => {
    res.onAborted(() => {});

    try {
      const url = req.getUrl();
      const file = url === "/" ? "/index.html" : url;
      const filePath = path.join("./static", file);

      const content = await readFile(filePath);

      return res.end(content);
    } catch {
      return "Not found";
    }
  })
  .listen(port, (token) => {
    if (token) {
      console.log(`Listening to port ${port}`);
    } else {
      console.log(`Failed to listen to port ${port}`);
    }
  });
