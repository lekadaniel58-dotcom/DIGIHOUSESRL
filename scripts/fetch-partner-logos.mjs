import fs from 'node:fs/promises';

// Original image addresses used by the reference site's partner strip.
const logos = [
  { name: 'Muratti', url: 'https://www.colorificionembrini.com/wp-content/uploads/2024/02/MURATTI-300x122.png', file: 'muratti-logo.png', signature: '89504e470d0a1a0a' },
  { name: 'HEX', url: 'https://didonatospa.it/wp-content/uploads/2018/12/logo_HEX-1.jpg', file: 'hex-logo.jpg', signature: 'ffd8ff' },
];
for (const logo of logos) {
  try {
    const response = await fetch(logo.url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'Mozilla/5.0 DigiHouse asset build', Accept: 'image/*' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.toString('hex').startsWith(logo.signature) || bytes.length < 200 || bytes.length > 2_000_000) throw new Error('Formato immagine non valido');
    await fs.writeFile(new URL(`../public/assets/fornitori/${logo.file}`, import.meta.url), bytes);
    console.log(`Logo originale ${logo.name}: ${bytes.length} byte, verificato e salvato.`);
  } catch (error) {
    console.error(`::error::Impossibile recuperare il logo originale ${logo.name}: ${error.message}`);
    process.exitCode = 1;
  }
}
