import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'csv-parse/sync';
import { getDoorCollection } from '../src/lib/doorCollections.ts';
const read = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const rows = parse(fs.readFileSync(new URL('../data/catalogo.csv', import.meta.url), 'utf8'), { columns: true });
const doors = rows.filter(r => r.department === 'Porte blindate');
const photos = read('../src/data/dierrePhotos.json');
const responsive = read('../src/data/responsiveImages.json');
assert.equal(doors.length, 21);
assert.equal(Object.keys(photos).length, doors.length);
const families = new Map();
for (const row of doors) {
  const photo = photos[row.image];
  assert(photo, row.name);
  assert.equal(photo.name, row.name);
  assert.equal(photo.original_image, row.image);
  for (const key of ['source_url', 'image_url']) assert.equal(new URL(photo[key]).hostname, 'www.dierre.com');
  assert(photo.width >= 700 && photo.height >= 400, `${row.name}: risoluzione originale`);
  assert.match(photo.sha256, /^[a-f0-9]{64}$/);
  for (const variant of ['thumbnail','full']) {
    assert.equal(responsive[row.image][variant], photo[variant]);
    const bytes = fs.readFileSync(new URL('../data/immagini/'+photo[variant], import.meta.url));
    assert.equal(bytes.subarray(0,4).toString(), 'RIFF');
    assert.equal(bytes.subarray(8,12).toString(), 'WEBP');
    assert(bytes.length < (variant === 'thumbnail' ? 150_000 : 800_000), `${row.name}: peso ${variant}`);
  }
  assert.notEqual(photo.thumbnail, photo.full);
  const collection = getDoorCollection({ ...row, department_id:'porte-blindate', subtitle:photo.subtitle ?? row.subtitle });
  assert(collection, row.name);
  families.set(collection.id, (families.get(collection.id) ?? 0) + 1);
  if (['Tablet','Tablet Class 4','Tablet Plus','Under 1','Under 2'].includes(row.name)) assert(photo.note?.includes('Foto rappresentativa'), row.name);
  if (['Greta','Anthos','Anthea'].includes(row.name)) assert.equal(collection.id, 'inferriate-persiane');
}
assert.deepEqual(Object.fromEntries(families), {'high-tech':2, prestige:8, compact:4, teknica:4, 'inferriate-persiane':3});
// Shared pictures of two versions must be explicitly identified as family photographs.
for (const a of Object.values(photos)) for (const b of Object.values(photos)) {
  if (a.name !== b.name && a.full === b.full) assert(a.note && b.note, `${a.name}/${b.name}: foto condivisa senza indicazione`);
}
for (const row of rows.filter(r => r.department !== 'Porte blindate')) assert(!photos[row.image], `${row.name}: sostituzione fuori reparto`);
console.log('Dierre: foto ufficiali per 21/21 schede, 5 collezioni, miniature e zoom locali; foto di gamma segnalate.');
