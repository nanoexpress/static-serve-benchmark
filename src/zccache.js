import uWS from "uWebSockets.js";
import path from "path";
import BufferFromFile from "bufferfromfile";

const port = 4700;
const cache = {};

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

      cache[filePath] =
        cache[filePath] || BufferFromFile(filePath).Uint8Array();

      res.cork(() => {
        res.end(cache[filePath]);
      });
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
