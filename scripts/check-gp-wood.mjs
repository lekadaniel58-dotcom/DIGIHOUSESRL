import assert from 'node:assert/strict';
import fs from 'node:fs';
import {getDoorCollection,getDoorFamily} from '../src/lib/doorCollections.ts';
import {getDoorMaterials} from '../src/lib/doorMaterials.ts';
import {getCatalogSection} from '../src/lib/catalogSections.ts';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const products=read('../src/data/gpWoodProducts.json'), audit=read('../docs/gp-wood-inventory.json');
const seq=(a,b)=>Array.from({length:b-a+1},(_,i)=>String(a+i).padStart(2,'0'));
const both=ns=>ns.flatMap(n=>[n,n+'V']);
const expected={
 Classic:['01','02','FM-01','FM-02','FM-03','FM-04','NODATA'],
 Glassy:[...seq(1,11),...seq(13,22),'3V','3V-OB','4V','5V','6V','15V'],
 Fashion:['01',...seq(3,8)],
 Meeting:[...both(['05','07','10','12','13','14','17','23','27','33','35','41','43','49']),'31'],
 Massellata:[...both(seq(1,12)).map(n=>'FLAT '+n),...seq(13,24).map(n=>'FLAT '+n),...[5,8,11,12,15,29,30,32,33,34,35,36,37,38,40,41,42,43,44,45,47,48,52,53,55,56,58,60].map(n=>'FANTASY '+String(n).padStart(2,'0')),'FANTASY 05V'],
 Style:both([...seq(2,21),...seq(24,26)]), Elegant:both([...seq(2,14),...seq(23,31)]),
 Prestige:[...both([...seq(1,14),'17','18','29','32','33']),'31'], Slim:both(seq(1,3)),
 'Innovative Bend':['FRANCY','FRANCY-V'], Precomposto:['01','02','07','08','09','10','PARETE 360°'], Continuum:['GROOVE','DUNE'],
};
const normalize=s=>s.toUpperCase().replace(/ FERMAVETRO BAROCCO/g,'');
assert.equal(products.length,281);assert.equal(audit.models.length,281);
assert.equal(audit.catalogue.pages,124);assert.match(audit.catalogue.sha256,/^[a-f0-9]{64}$/);
assert.equal(new Set(products.map(p=>p.id)).size,281);
for(const [series,models] of Object.entries(expected)){
 const actual=audit.models.filter(m=>products.find(p=>p.id===m.id)?.door_series===series).map(m=>normalize(m.model));
 assert.deepEqual(new Set(actual),new Set(models),series+': complete model inventory');
}
for(const p of products){
 const source=audit.models.find(m=>m.id===p.id);assert(source,p.name);
 assert.equal(p.department_id,'porte-interne');assert.deepEqual(p.partner_ids,['gp']);assert.equal(p.price,null);assert.equal(p.sku,'');
 assert.equal(getDoorCollection(p)?.id,'gp-legno');assert(getDoorMaterials(p).some(m=>m.id==='legno'));
 assert(source.catalog_pages.length && source.catalog_pages.every(n=>n>=10&&n<=99));
 assert.equal(p.images[0],source.image.full);assert.equal(p.thumbnail,source.image.thumbnail);
 assert.equal(new URL(p.source_url).hostname,'gp-porte.it');
 for(const file of [...p.images,p.thumbnail]){
  const b=fs.readFileSync(new URL('../data/immagini/'+file,import.meta.url));assert.equal(b.subarray(8,12).toString(),'WEBP');assert(b.length<1_000_000);
 }
 assert(p.description.length>120);
 if(source.image_scope==='catalogue-drawing')assert.match(p.image_note,/Disegno tecnico/);
}
assert.equal(getDoorFamily('','gp'),'porte-interne');assert.equal(getCatalogSection('','gp',''),'serramenti');
assert(!products.some(p=>/Roxy|Supreme|Laminato|Laccato/.test(p.name)));
for(const path of ['../src/data/aipProducts.json','../src/data/pailProducts.json']){
 const previous=read(path);assert(!products.some(p=>previous.some(old=>old.id===p.id)),'No existing model replaced');
}
console.log('GP Porte: 281 modelli, 12 linee del catalogo legno di 124 pagine; copertura completa, foto/disegni locali, materiali e filtri verificati.');
