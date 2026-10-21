import fs from 'node:fs/promises';

// Original image addresses used by the reference site's partner strip.
const logos = [
  { name: 'Muratti', url: 'https://www.colorificionembrini.com/wp-content/uploads/2024/02/MURATTI-300x122.png', file: 'muratti-logo.png' },
  { name: 'HEX', url: 'https://didonatospa.it/wp-content/uploads/2018/12/logo_HEX-1.jpg', file: 'hex-logo.jpg' },
];
function imageFormat(bytes) {
  if (bytes.length < 200 || bytes.length > 2_000_000) return null;
  if (bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') return 'PNG';
  if (bytes.subarray(0, 3).toString('hex') === 'ffd8ff') return 'JPEG';
  if (bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP') return 'WebP';
  return null;
}
for (const logo of logos) {
  const destination = new URL(`../public/assets/fornitori/${logo.file}`, import.meta.url);
  try {
    const cached = await fs.readFile(destination).catch(() => null);
    if (cached && imageFormat(cached)) {
      console.log(`Logo originale ${logo.name}: copia verificata in cache (${imageFormat(cached)}).`);
      continue;
    }
    const response = await fetch(logo.url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'Mozilla/5.0 DigiHouse asset build', Accept: 'image/*' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    // Image CDNs may negotiate WebP even when the original URL ends in .jpg or .png.
    const format = imageFormat(bytes);
    if (!format) throw new Error(`Formato immagine non valido (${response.headers.get('content-type') ?? 'sconosciuto'}, firma ${bytes.subarray(0, 12).toString('hex')})`);
    await fs.writeFile(destination, bytes);
    console.log(`Logo originale ${logo.name}: ${bytes.length} byte, ${format}, verificato e salvato.`);
  } catch (error) {
    console.error(`::error::Impossibile recuperare il logo originale ${logo.name}: ${error.message}`);
    process.exitCode = 1;
  }
}
