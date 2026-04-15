import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const projectRoot = resolve(process.cwd());
const publicDir = join(projectRoot, 'public');
const outputDir = join(publicDir, 'optimized');
const originalsDir = join(projectRoot, 'assets-originals');

const ensureTool = (name) => {
  const res = spawnSync('which', [name], { encoding: 'utf8' });
  if (res.status !== 0) {
    console.error(`Missing required tool: ${name}`);
    process.exit(1);
  }
};

const run = (command, args) => {
  const res = spawnSync(command, args, { stdio: 'inherit' });
  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
};

const buildWebp = (inputPath, outputPath, quality, width) => {
  run('cwebp', ['-quiet', '-q', String(quality), '-resize', String(width), '0', inputPath, '-o', outputPath]);
};

const buildAvif = (inputPath, outputPath, crf, width) => {
  run('ffmpeg', [
    '-y',
    '-loglevel',
    'error',
    '-i',
    inputPath,
    '-vf',
    `scale=${width}:-1`,
    '-c:v',
    'libsvtav1',
    '-crf',
    String(crf),
    '-preset',
    '10',
    '-f',
    'avif',
    outputPath,
  ]);
};

const buildBothFormats = (inputPath, outputBaseName, variants) => {
  variants.forEach(({ width, webpQuality, avifCrf }) => {
    const webpPath = join(outputDir, `${outputBaseName}-${width}.webp`);
    const avifPath = join(outputDir, `${outputBaseName}-${width}.avif`);
    buildWebp(inputPath, webpPath, webpQuality, width);
    buildAvif(inputPath, avifPath, avifCrf, width);
    console.log(`Built: ${outputBaseName}-${width}.{webp,avif}`);
  });
};

const main = () => {
  ensureTool('cwebp');
  ensureTool('ffmpeg');

  if (!existsSync(publicDir)) {
    console.error(`Missing public directory: ${publicDir}`);
    process.exit(1);
  }
  if (!existsSync(originalsDir)) {
    console.error(`Missing source image directory: ${originalsDir}`);
    process.exit(1);
  }

  mkdirSync(outputDir, { recursive: true });

  buildBothFormats(join(originalsDir, 'cover.png'), 'cover', [
    // Keep hero quality a little higher than gallery images.
    { width: 900, webpQuality: 70, avifCrf: 42 },
    { width: 1400, webpQuality: 74, avifCrf: 39 },
  ]);

  const engagementFiles = readdirSync(originalsDir)
    .filter((file) => /^engagement_\d+\.jpg$/i.test(file))
    .sort((a, b) => {
      const aNum = Number(a.match(/\d+/)?.[0] ?? 0);
      const bNum = Number(b.match(/\d+/)?.[0] ?? 0);
      return aNum - bNum;
    });

  engagementFiles.forEach((file) => {
    const inputPath = join(originalsDir, file);
    const stem = basename(file, extname(file));
    buildBothFormats(inputPath, stem, [
      { width: 320, webpQuality: 62, avifCrf: 45 },
      { width: 640, webpQuality: 70, avifCrf: 41 },
    ]);
  });

  ['sean.jpg', 'desiree.jpg'].forEach((file) => {
    const inputPath = join(originalsDir, file);
    const stem = basename(file, extname(file));
    buildBothFormats(inputPath, stem, [
      { width: 120, webpQuality: 68, avifCrf: 45 },
      { width: 240, webpQuality: 74, avifCrf: 42 },
    ]);
  });

  console.log('Image optimization complete.');
};

main();
