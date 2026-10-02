import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public', 'icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  // 1. Standard 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public', 'pwa-192x192.png'));

  // 2. Standard 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public', 'pwa-512x512.png'));

  // 3. Apple Touch Icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public', 'apple-touch-icon.png'));

  // 4. Maskable 512x512 (with safe zone 15% padding)
  const innerIcon = await sharp(svgBuffer)
    .resize(410, 410)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 30, g: 27, b: 75, alpha: 1 } // Brand #1e1b4b
    }
  })
    .composite([{ input: innerIcon, top: 51, left: 51 }])
    .png()
    .toFile(path.resolve('public', 'pwa-maskable-512x512.png'));

  // 5. Favicon 48x48
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.resolve('public', 'favicon.png'));

  console.log('All PWA icons generated successfully!');
}

generate().catch(console.error);
