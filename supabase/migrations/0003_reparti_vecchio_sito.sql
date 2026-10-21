-- Reparti presenti nel sito precedente
insert into public.departments (slug, name, sort_order) values
 ('pennelli-accessori','Pennelli e accessori',13),
 ('protezione-preparazione','Protezione e preparazione',14)
on conflict (slug) do nothing;
