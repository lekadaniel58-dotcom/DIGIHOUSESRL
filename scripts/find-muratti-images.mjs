const urls = [
  'https://www.muratti.it/',
  'https://www.muratticolor.it/',
  'https://www.muratticolori.it/',
  'https://html.duckduckgo.com/html/?q=%22Muratti%22+%22Naxos%22+pittura',
  'https://www.google.com/search?gbv=1&q=%22Muratti%22+%22Naxos%22',
  'https://www.bing.com/search?format=rss&q=%22Muratti%22+%22Naxos%22',
];
await Promise.all(urls.map(async url => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await response.text();
    console.log(`::notice::Muratti page ${JSON.stringify({url,status:response.status,title:html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]})}`);
    const links = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map(m=>m[1]);
    console.log(`::notice::Muratti links ${JSON.stringify({url,links:[...new Set(links.filter(link=>/muratti|naxos|panarea|quarzo/i.test(link)))].slice(0,50)})}`);
    const text = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
    console.log(`::notice::Muratti content ${JSON.stringify({url,text:text.slice(0,9000)})}`);
  } catch (error) { console.log(`::warning::Muratti ${url}: ${error.message}`); }
}));
