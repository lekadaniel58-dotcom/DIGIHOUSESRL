const base = 'https://www.colorificionembrini.com';
for (const name of ['naxos', 'panarea', 'quarzo']) {
  for (const kind of ['media', 'search']) {
    const url = `${base}/wp-json/wp/v2/${kind}?search=${name}&per_page=20`;
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const items = await response.json();
      for (const item of items) {
        const details = { query: name, kind, id: item.id, title: item.title, url: item.source_url ?? item.url,
          sizes: item.media_details?.sizes, width: item.media_details?.width, height: item.media_details?.height };
        console.log(`::notice::Muratti source ${JSON.stringify(details)}`);
      }
      if (!items.length) console.log(`::notice::Muratti ${name} ${kind}: nessun risultato`);
    } catch (error) { console.log(`::warning::Muratti ${name} ${kind}: ${error.message}`); }
  }
}
