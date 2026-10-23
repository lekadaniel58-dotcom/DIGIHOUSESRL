export interface Department { id: string; slug: string; name: string }
export interface Product {
  id: string; sku: string; slug: string; name: string; subtitle: string | null; description: string | null;
  department_id: string | null; price: number | null; images: string[]; thumbnail?: string; is_featured: boolean;
  partner_ids?: string[]; image_note?: string;
  door_collection?: string; door_series?: string | null; door_materials?: string[]; source_url?: string;
  smaller_formats?: string[]; search_terms?: string;
  product_variants?: { id: string }[];
}
export const eur = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
