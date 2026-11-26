// news-image-20261125 — one-image summary of the world's news of Wednesday 25 November 2026.
// The program writes the front-page image to /output/entry.png.
// The image is stored in this repository as base64 text (image.b64) so the
// entry stays plain UTF-8; decoding it here is deterministic and uses no network.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const encoded = readFileSync(join(here, "image.b64"), "utf8").trim();
const image = Buffer.from(encoded, "base64");
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpegMagic = Buffer.from([0xff, 0xd8, 0xff]);
const isImage = image.subarray(0, 8).equals(pngMagic) || image.subarray(0, 3).equals(jpegMagic);
if (!isImage) throw new Error("image.b64 did not decode to a PNG or JPEG");
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.png", image);
chmodSync("/output/entry.png", 0o644);
console.log(`wrote /output/entry.png (${image.length} bytes)`);
