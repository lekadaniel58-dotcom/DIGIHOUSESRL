import type { Product } from './types';

export const windowFamilies = [
  { id: 'finestre', name: 'Finestre e portefinestre', text: 'Scegli il materiale e il sistema di apertura.', cover: 'Infisso Evo Vision' },
  { id: 'persiane', name: 'Persiane e scuri', text: 'Oscuranti in alluminio per protezione, luce e privacy.', cover: 'Persiana Adriatica' },
  { id: 'complementi', name: 'Soluzioni complementari', text: 'Sistemi per completare l’involucro e la protezione degli ambienti.', cover: 'SKIN' },
] as const;
export const windowCollections = [
  { id: 'alluminio-battente', family: 'finestre', name: 'Alluminio · a battente', match: 'Infissi in alluminio · battente', text: 'Le finestre in alluminio con apertura a battente.' },
  { id: 'alluminio-scorrevole', family: 'finestre', name: 'Alluminio · scorrevoli', match: 'Infissi in alluminio · scorrevoli', text: 'Sistemi scorrevoli in alluminio per aperture luminose.' },
  { id: 'alluminio-legno', family: 'finestre', name: 'Alluminio / legno', match: 'Infissi alluminio/legno', text: 'Sistemi compositi che abbinano alluminio e legno.' },
  { id: 'legno-alluminio', family: 'finestre', name: 'Legno / alluminio', match: 'Infissi legno/alluminio', text: 'Serramenti in legno con protezione esterna in alluminio.' },
  { id: 'pvc', family: 'finestre', name: 'PVC', match: 'Infissi in PVC', text: 'I modelli di finestre e serramenti in PVC.' },
  { id: 'persiane-alluminio', family: 'persiane', name: 'Persiane in alluminio', match: 'Persiane in alluminio', text: 'Modelli e configurazioni di persiane in alluminio.' },
  { id: 'scuri-alluminio', family: 'persiane', name: 'Scuri in alluminio', match: 'Scuri in alluminio', text: 'Soluzioni con telaio oppure a murare.' },
  { id: 'complementi', family: 'complementi', name: 'Sistemi complementari', match: 'Soluzioni complementari', text: 'Scopri i sistemi disponibili.' },
] as const;
export function getWindowCollection(product: Pick<Product, 'department_id' | 'subtitle'>) {
  if (product.department_id !== 'infissi') return undefined;
  const subtitle = product.subtitle?.split('·').map(s => s.trim()).slice(1).join(' · ');
  return windowCollections.find(c => c.match === subtitle);
}
