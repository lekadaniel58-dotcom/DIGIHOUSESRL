const urls = [
  'https://www.fareke.com/lavabili/35-delp-italia-genova/6882-482698-muratti-panarea-idropittura-lavabile-profumata-per-interni-8999900482698.html',
  'https://emad-store.com/collections/pittura/products.json?limit=250',
  'https://didonatospa.it/marchi-2/',
  'https://www.muratti.it/wp-json/wp/v2/media?search=quarzo&per_page=20',
];
await Promise.all(urls.map(async url => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await response.text();
    if (html.trim().startsWith('{')) {
      const data = JSON.parse(html);
      for (const product of data.products ?? []) if (/naxos|panarea|quarzo/i.test(product.title)) console.log(`::notice::Muratti product ${JSON.stringify({title:product.title,handle:product.handle,images:product.images,variants:product.variants?.map(v=>({title:v.title,featured_image:v.featured_image}))})}`);
      return;
    }
    console.log(`::notice::Muratti page ${JSON.stringify({url,status:response.status,title:html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]})}`);
    const links = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map(m=>m[1]);
    console.log(`::notice::Muratti links ${JSON.stringify({url,links:[...new Set(links.filter(link=>/muratti|naxos|panarea|quarzo|\.(?:jpg|png|webp)/i.test(link)))].slice(0,50)})}`);
    const text = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
    console.log(`::notice::Muratti content ${JSON.stringify({url,text:text.slice(0,9000)})}`);
  } catch (error) { console.log(`::warning::Muratti ${url}: ${error.message}`); }
}));
