import assert from 'node:assert/strict';
import { changeCatalogFilter, changeCatalogQuery } from '../src/lib/catalogFilters.ts';
const products = [
  { department_id:'porte-interne', partner_ids:['aip'] },
  { department_id:'porte-interne', partner_ids:['pail'] },
  { department_id:'porte-blindate', partner_ids:['dierre'] },
  { department_id:'infissi', partner_ids:['sallustio'] },
  { department_id:'pitture-e-decorazioni', partner_ids:['muratti'] },
  { department_id:'adesivi-e-sigillanti', partner_ids:['opera'] },
];
const original = new URLSearchParams('reparto=porte-interne&partner=aip&collezione=moderne&serie=grafix&q=porta&settore=serramenti');
let next = changeCatalogFilter(original, 'partner', 'dierre', products);
assert.equal(next.get('reparto'), null);
assert.equal(next.get('partner'), 'dierre');
assert.equal(next.get('collezione'), null);
assert.equal(next.get('serie'), null);
assert.equal(next.get('q'), 'porta');
assert.equal(original.get('partner'), 'aip');
next = changeCatalogFilter(original, 'partner', 'pail', products);
assert.equal(next.get('reparto'), 'porte-interne');
assert.equal(next.get('partner'), 'pail');
next = changeCatalogFilter(original, 'reparto', 'infissi', products);
assert.equal(next.get('partner'), null);
assert.equal(next.get('reparto'), 'infissi');
next = changeCatalogFilter(original, 'reparto', 'porte', products);
assert.equal(next.get('partner'), 'aip');
next = changeCatalogFilter(original, 'partner', '', products);
assert.equal(next.get('reparto'), 'porte-interne');
assert.equal(next.get('partner'), null);
const query = 'pittura bianca & silicone';
next = changeCatalogQuery(original, query, 'serramenti');
assert.equal(new URLSearchParams(next.toString()).get('q'), query);
assert.equal(next.get('partner'), 'aip');
next = changeCatalogQuery(new URLSearchParams('q=silicone'), '', 'edilizia');
assert.equal(next.get('q'), null);
assert.equal(next.get('settore'), 'edilizia');
console.log('Filtri: cambio marca/reparto coerente, selezioni compatibili conservate, ricerca condivisibile e cancellabile senza perdere il catalogo.');
