"""Fetch official Dierre source pages for review, without changing the live catalog."""
import json, pathlib, urllib.request, urllib.parse, xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
ROOT = pathlib.Path('docs/dierre-source'); ROOT.mkdir(parents=True, exist_ok=True)
def fetch(url):
    if urllib.parse.urlparse(url).hostname not in {'dierre.com','www.dierre.com'}: raise ValueError('Unexpected host')
    req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 DigiHouse catalog source review'})
    with urllib.request.urlopen(req,timeout=60) as res:
        if urllib.parse.urlparse(res.url).hostname not in {'dierre.com','www.dierre.com'}: raise ValueError('Unexpected redirect')
        return res.read()
errors=[];urls=set(); maps=set()
for path in ['','robots.txt','sitemap_index.xml','wp-sitemap.xml','sitemap.xml']:
    url='https://www.dierre.com/'+path
    try:
        raw=fetch(url); (ROOT/('home.html' if not path else path.replace('/','-'))).write_bytes(raw)
        if path.endswith('.xml'):
            tree=ET.fromstring(raw)
            locs=[el.text for el in tree.iter() if el.tag.endswith('}loc') or el.tag=='loc']
            (maps if 'sitemapindex' in tree.tag else urls).update(locs)
    except Exception as e: errors.append({'url':url,'error':str(e)})
for url in sorted(maps)[:35]:
    try:
        tree=ET.fromstring(fetch(url));urls.update(el.text for el in tree.iter() if el.tag.endswith('}loc') or el.tag=='loc')
    except Exception as e: errors.append({'url':url,'error':str(e)})
(ROOT/'index.json').write_text(json.dumps({'urls':sorted(urls),'sitemaps':sorted(maps),'errors':errors},indent=2))
manifest=ROOT/'page-requests.json'
if manifest.exists():
    def page(item):
        try:
            (ROOT/item['filename']).write_bytes(fetch(item['url']));return {'url':item['url'],'filename':item['filename']}
        except Exception as e:return {'url':item['url'],'error':str(e)}
    with ThreadPoolExecutor(max_workers=3) as pool: results=list(pool.map(page,json.loads(manifest.read_text())))
    (ROOT/'page-results.json').write_text(json.dumps(results,indent=2))
print('Official source URLs:',len(urls),'Initial fetch errors:',len(errors))
