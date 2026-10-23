"""Review only Rapido Pail and Super Rapido public source pages."""
import json,pathlib,urllib.request,urllib.parse,xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
ROOT=pathlib.Path('docs/pail-source');ROOT.mkdir(parents=True,exist_ok=True)
def fetch(url):
    if urllib.parse.urlparse(url).hostname not in {'www.pailporte.com','pailporte.com'}:raise ValueError('Unexpected host')
    with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=60) as res:
        if urllib.parse.urlparse(res.url).hostname not in {'www.pailporte.com','pailporte.com'}:raise ValueError('Unexpected redirect: '+res.url)
        return res.read()
urls=set();maps=set();errors=[]
for path in ['','robots.txt','sitemap_index.xml','wp-sitemap.xml','sitemap.xml']:
    url='https://www.pailporte.com/'+path
    try:
        raw=fetch(url);(ROOT/('home.html' if not path else path)).write_bytes(raw)
        if path.endswith('.xml'):
            tree=ET.fromstring(raw);locs=[el.text for el in tree.iter() if el.tag.endswith('}loc') or el.tag=='loc'];(maps if 'sitemapindex' in tree.tag else urls).update(locs)
    except Exception as e:errors.append({'url':url,'error':str(e)})
for url in sorted(maps)[:35]:
    try:
        tree=ET.fromstring(fetch(url));urls.update(el.text for el in tree.iter() if el.tag.endswith('}loc') or el.tag=='loc')
    except Exception as e:errors.append({'url':url,'error':str(e)})
(ROOT/'index.json').write_text(json.dumps({'urls':sorted(urls),'errors':errors},indent=2))
requests=[{'url':u,'filename':'page-'+urllib.parse.urlparse(u).path.strip('/').replace('/','-')+'.html'} for u in sorted(urls) if 'rapido' in u.lower() and not any(u.lower().endswith(x) for x in ['.jpg','.png','.pdf','.webp'])][:30]
manifest=ROOT/'page-requests.json'
if manifest.exists():requests.extend(json.loads(manifest.read_text()))
def page(item):
    try:(ROOT/item['filename']).write_bytes(fetch(item['url']));return item
    except Exception as e:return dict(item,error=str(e))
with ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(page,requests))
(ROOT/'page-results.json').write_text(json.dumps(results,indent=2))
print('URLs:',len(urls),'Target pages:',len(results),'Errors:',errors)
