const urls = [
  'https://www.colorificionembrini.com/isolanti-fissativi-consolidanti-e-fondi-riempitivi-per-le-preparazione-delle-pareti/muratti/',
  'https://www.google.com/search?q=Muratti+Naxos+Panarea+pittura',
  'https://www.bing.com/search?q=Muratti+Naxos+Panarea+pittura',
];
for (const url of urls) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await response.text();
    console.log(`::notice::Muratti page ${JSON.stringify({url,status:response.status,title:html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]})}`);
    const links = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map(m=>m[1]);
    console.log(`::notice::Muratti links ${JSON.stringify({url,links:[...new Set(links.filter(link=>/muratti|naxos|panarea|quarzo/i.test(link)))].slice(0,50)})}`);
    const text = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
    console.log(`::notice::Muratti content ${JSON.stringify({url,text:text.slice(0,6500)})}`);
  } catch (error) { console.log(`::warning::Muratti ${url}: ${error.message}`); }
}
