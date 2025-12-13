// Batch-crop bottom area of AI images in assets/ai-images
// Requires: npm i sharp --save-dev (or regular dep)
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd());
const AI_DIR = path.join(ROOT, 'src', 'assets', 'ai-images');
const OUTPUT_DIR = path.join(AI_DIR, '_cropped');

// Fraction of image height to crop from bottom
const CROP_FRACTION = Number(process.env.CROP_FRACTION || 0.12); // 12% default

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function isImage(file) {
  const ext = path.extname(file).toLowerCase();
  return ['.webp', '.jpg', '.jpeg', '.png'].includes(ext);
}

async function main() {
  console.log(`[crop-ai] Source: ${AI_DIR}`);
  await ensureDir(OUTPUT_DIR);
  const entries = await fs.readdir(AI_DIR);
  const files = entries.filter((f) => !f.startsWith('_') && !f.startsWith('.'));
  let processed = 0;
  for (const name of files) {
    const inPath = path.join(AI_DIR, name);
    const stat = await fs.stat(inPath);
    if (!stat.isFile() || !(await isImage(name))) continue;

    const img = sharp(inPath, { failOn: 'none' });
    const meta = await img.metadata();
    const { width, height } = meta;
    if (!width || !height) {
      console.warn(`[crop-ai] Skip ${name}: missing dimensions`);
      continue;
    }
    const cropH = Math.round(height * CROP_FRACTION);
    const outPath = path.join(OUTPUT_DIR, name);

    // Extract top region (remove bottom cropH)
    const topHeight = height - cropH;
    await img.extract({ left: 0, top: 0, width, height: topHeight }).toFile(outPath);
    processed++;
    console.log(`[crop-ai] ${name} -> _cropped/${name} (removed ${cropH}px ~ ${Math.round(CROP_FRACTION*100)}%)`);
  }
  console.log(`[crop-ai] Done. Cropped ${processed} files. Output: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error('[crop-ai] Error:', err);
  process.exit(1);
});
