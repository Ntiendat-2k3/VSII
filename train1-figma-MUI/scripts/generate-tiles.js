import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const inputImagePath = path.join(process.cwd(), 'public', 'map-background.png');
const outputDir = path.join(process.cwd(), 'public', 'tiles');

async function generateTiles() {
  console.log('Reading image dimensions...');
  const metadata = await sharp(inputImagePath).metadata();
  console.log(`Original image size: ${metadata.width}x${metadata.height}`);
  
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  console.log('Generating tiles...');
  await sharp(inputImagePath)
    .png()
    .tile({
      size: 256,
      layout: 'google', // generates z/x/y.png structure
    })
    .toFile(outputDir);
    
  console.log('Tile generation complete!');
}

generateTiles().catch(console.error);
