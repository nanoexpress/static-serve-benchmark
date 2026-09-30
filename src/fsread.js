import uWS from "uWebSockets.js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const port = 4100;

console.log("PID", process.pid);

const _app = uWS
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

			res.cork(() => {
				res.end(content);
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
