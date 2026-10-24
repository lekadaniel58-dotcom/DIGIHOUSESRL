import type { Product } from './types';

export const windowFamilies = [
  { id: 'finestre', name: 'Finestre e portefinestre', text: 'Scegli il materiale e il sistema di apertura.', cover: 'Icon Centenario' },
  { id: 'persiane', name: 'Persiane e scuri', text: 'Persiane a battente, scorrevoli e antoni dogati in alluminio.', cover: 'Raffaello' },
  { id: 'complementi', name: 'Soluzioni complementari', text: 'Sistemi per completare l’involucro e la protezione degli ambienti.', cover: 'SKIN' },
] as const;
export const windowCollections = [
  { id: 'pvc', family: 'finestre', name: 'PVC · a battente', match: 'Infissi in PVC', text: 'Sistemi in PVC, comprese le versioni con rivestimento ALU.' },
  { id: 'pvc-scorrevole', family: 'finestre', name: 'PVC · scorrevoli', match: 'Scorrevoli in PVC', text: 'Alzanti Meridiana, complanari in PVC ed Ecoslide.' },
  { id: 'alluminio-battente', family: 'finestre', name: 'Alluminio · a battente', match: 'Infissi in alluminio · battente', text: 'Metropolis, Forma e i nuovi sistemi iShape, iLine e iFrame.' },
  { id: 'alluminio-scorrevole', family: 'finestre', name: 'Alluminio · scorrevoli', match: 'Infissi in alluminio · scorrevoli', text: 'Alzanti, complanari e scorrevoli leggeri in alluminio.' },
  { id: 'legno', family: 'finestre', name: 'Legno · a battente', match: 'Finestre in legno', text: 'I sistemi Nova e Nova Plus in legno lamellare.' },
  { id: 'legno-scorrevole', family: 'finestre', name: 'Legno · scorrevoli', match: 'Scorrevoli in legno', text: 'La proposta Nova per gli alzanti scorrevoli in legno.' },
  { id: 'legno-alluminio', family: 'finestre', name: 'Legno / alluminio · a battente', match: 'Infissi legno/alluminio', text: 'Legno interno e protezione esterna in alluminio della linea ThermicX.' },
  { id: 'legno-alluminio-scorrevole', family: 'finestre', name: 'Legno / alluminio · scorrevoli', match: 'Scorrevoli in legno/alluminio', text: 'La gamma di alzanti ThermicX, Plus e Zero.' },
  { id: 'persiane-alluminio', family: 'persiane', name: 'Persiane a battente', match: 'Persiane in alluminio', text: 'Raffaello e Picasso: montaggio e stecche secondo il modello scelto.' },
  { id: 'persiane-scorrevoli', family: 'persiane', name: 'Persiane scorrevoli', match: 'Persiane scorrevoli', text: 'Leonardo, con anta scorrevole su binario superiore.' },
  { id: 'scuri-alluminio', family: 'persiane', name: 'Giotto', match: 'Scuri in alluminio', text: 'Giotto, con doghe continue sul lato esterno e montaggio a muro o su telaio.' },
  { id: 'complementi', family: 'complementi', name: 'Sistemi complementari', match: 'Soluzioni complementari', text: 'Scopri i sistemi disponibili.' },
] as const;

export function getWindowCollection(product: Pick<Product, 'department_id' | 'subtitle' | 'window_collection'>) {
  if (product.department_id !== 'infissi') return undefined;
  if (product.window_collection) return windowCollections.find(c => c.id === product.window_collection);
  const subtitle = product.subtitle?.split('·').map(s => s.trim()).slice(1).join(' · ');
  return windowCollections.find(c => c.match === subtitle);
}

export function getWindowFamily(params: URLSearchParams) {
  return params.get('famiglia') ?? '';
}
