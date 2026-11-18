import { webcrypto } from "node:crypto";

const key = await webcrypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  true,
  ["encrypt", "decrypt"]
);
const raw = await webcrypto.subtle.exportKey("raw", key);
console.log(Buffer.from(raw).toString("base64"));