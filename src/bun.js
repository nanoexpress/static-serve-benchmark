import { file } from "bun";

export default {
  development: process.env.NODE_ENV !== "production",
  port: 4400,
  fetch(req) {
    const url = new URL(req.url);
    const { pathname } = url;
    const _file = pathname === "/" ? "index.html" : pathname.substring(1);
    const filePath = `./static/${_file}`;

    return new Response(file(filePath));
  },
  error(err) {
    console.log(err);
    return new Response("Oh, err");
  },
  /**
   * File path to a TLS key
   *
   * To enable TLS, this option is required.
   */
  keyFile: "./misc/key.pem",
  /**
   * File path to a TLS certificate
   *
   * To enable TLS, this option is required.
   */
  certFile: "./misc/cert.pem",

  /**
   * Optional SSL options
   */
  passphrase: "1234",
  // caFile?: string;
  // dhParamsFile?: string;
  // lowMemoryMode?: boolean;
};
