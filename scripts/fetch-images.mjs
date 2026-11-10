// Downloads every image the site uses from the Wix CDN into ./images
// Run once:  node scripts/fetch-images.mjs      (Node 18+ — no dependencies)
// After that the site is fully self-hosted and no longer depends on Wix.

import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "images");
const CDN = "https://static.wixstatic.com/media/";

// local file name  ->  Wix media id
const images = {
  // hero
  "hero-crowd.jpg":              "11062b_e3cd6d3154d04092a4657a8cf59d9e06~mv2.jpg",
  "logo-hero.png":               "8d50d4_a8532e07e9684163a4ac5f56e65a866b~mv2.png",
  // service illustrations
  "tentacle-blue.png":           "8d50d4_b71818ed0a5a4b668a4c2bb9b76107c1~mv2.png",
  "tentacle-tech.png":           "8d50d4_d6d91d1b98d14944a4ba08e2766514bd~mv2.png",
  "tentacle-dark.png":           "8d50d4_8ef374267fc94ec991bebc569d8f62b0~mv2.png",
  "tentacle-sky.png":            "8d50d4_d404fb1757184855a321618839c1f15e~mv2.png",
  // gallery
  "gallery-01.jpg":              "8d50d4_2ee6f3ddf6f84b2788fce34ce7d97f62~mv2.jpg",
  "gallery-02.jpg":              "8d50d4_f4f045a4d8fc4551afde5995dba418e8~mv2.jpg",
  "gallery-03.jpg":              "8d50d4_45b9b67904244b06a125a8351062349a~mv2.jpg",
  "gallery-04.jpg":              "8d50d4_085e23b621144d23839cf1bf4b56ab9f~mv2.jpg",
  "gallery-05.jpg":              "8d50d4_a7bd8a701ffb47c6a84b966f69509356~mv2.jpg",
  "gallery-06.jpg":              "8d50d4_447ad2553ad8416fb829cdd9975906e0~mv2.jpg",
  "gallery-07.jpg":              "8d50d4_ecf8c2ef2a4c4e39ae7bfbfc26a10202~mv2.jpg",
  "gallery-08.jpg":              "8d50d4_e01ace77753141a1bfeffb9a31a18a12~mv2.jpg",
  "gallery-09.jpg":              "8d50d4_dba0baed6fb840018765b2646ea1af42~mv2.jpg",
  "gallery-10.jpg":              "8d50d4_465f0ebead994fa9bc33c8c5d1ae981d~mv2.jpg",
  // partner logos
  "partner-weezevent.png":       "8d50d4_36bc0fbea15847f3940efdb180e42460~mv2.png",
  "partner-rugby-world-cup.png": "8d50d4_2c1f1dad0fdf428d889cc85107ea3834~mv2.png",
  "partner-ironman.png":         "8d50d4_0f2bc115059647798ad3f4c8c47aa383~mv2.png",
  "partner-luminiscence.png":    "8d50d4_ca593e20d2bf4fb1a6ddb8e6041abd28~mv2.png",
  "partner-nice-matin.png":      "8d50d4_18ee2e0c603d4d269d3d7014750adebb~mv2.png",
  "partner-we-acteam.png":       "8d50d4_99416c0c4ba84628b7519991e9895fdd~mv2.png",
  // footer
  "logo-footer.png":             "8d50d4_44d1133cca6e4aa59913d6a00d0581dd~mv2.png",
};

// Photos are resized on Wix's side (max 1600px) so you don't ship 5 MB phone shots.
// PNGs (logos/illustrations) are downloaded at original quality.
function urlFor(id) {
  if (id.endsWith(".jpg")) return `${CDN}${id}/v1/fit/w_1600,h_1600,q_85/${id}`;
  return `${CDN}${id}`;
}

await mkdir(OUT, { recursive: true });
let ok = 0, failed = 0;

for (const [name, id] of Object.entries(images)) {
  const dest = join(OUT, name);
  try { await access(dest); console.log(`skip  ${name} (exists)`); ok++; continue; } catch {}
  for (const url of [urlFor(id), `${CDN}${id}`]) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
      console.log(`saved ${name}`);
      ok++;
      break;
    } catch (err) {
      if (url === `${CDN}${id}`) { console.error(`FAIL  ${name}: ${err.message}`); failed++; }
    }
  }
}

console.log(`\n${ok} images ready in ./images${failed ? `, ${failed} failed` : ""}`);
process.exitCode = failed ? 1 : 0;
