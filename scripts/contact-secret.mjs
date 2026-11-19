import { webcrypto } from "node:crypto";

const bytes = webcrypto.getRandomValues(new Uint8Array(32));
const secret = Buffer.from(bytes).toString("base64url");

const digest = await webcrypto.subtle.digest(
  "SHA-256",
  new TextEncoder().encode(secret)
);
const hash = Buffer.from(digest).toString("hex");

console.log("Put this in .env.local:");
console.log(`CONTACT_SUBMIT_SECRET=${secret}`);
console.log("");
console.log("Put this hash in the database (it is NOT the secret):");
console.log(hash);