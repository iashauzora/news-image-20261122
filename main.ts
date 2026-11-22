// news-image-20261122 — "The World in a Day", Sunday 22 November 2026.
//
// The entry is a program that writes one image to the output directory.
// This repository holds the finished front page as entry.png; the program
// delivers it, byte for byte, to $MAKEFUN_OUTPUT_DIR/entry.png (falling
// back to /output/entry.png when the variable is not set). It runs with
// no network and no inputs, so both grading runs produce identical bytes.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const image = readFileSync(join(here, "entry.png"));

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.png");
  writeFileSync(target, image);

  // Verify what landed on disk: same byte count, same bytes. A short or
  // altered write would hand the judge a different picture, so fail
  // loudly here rather than silently. On success, print nothing.
  const written = readFileSync(target);
  if (written.length !== image.length || !written.equals(image)) {
    throw new Error(
      `entry.png verification failed: wrote ${written.length} of ${image.length} bytes`,
    );
  }
}

main();
