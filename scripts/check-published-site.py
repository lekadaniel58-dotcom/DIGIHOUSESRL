"""Read-only smoke check of the public Pages deployment. Never submits any form."""
import csv, io, json, pathlib, sys, time, urllib.parse, urllib.request
from html.parser import HTMLParser
BASE = sys.argv[1] if len(sys.argv) > 1 else 'https://lekadaniel58-dotcom.github.io/DIGIHOUSESRL/'
if not BASE.endswith('/'): BASE += '/'
class Assets(HTMLParser):
    def __init__(self): super().__init__(); self.urls = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'script' and attrs.get('src'): self.urls.append((attrs['src'], 'script'))
        if tag == 'link' and attrs.get('rel') in {'stylesheet','icon'}: self.urls.append((attrs['href'], attrs['rel']))
def fetch(path):
    url = urllib.parse.urljoin(BASE, path)
    if urllib.parse.urlparse(url).netloc != urllib.parse.urlparse(BASE).netloc: raise ValueError('Unexpected external asset')
    req = urllib.request.Request(url, headers={'Cache-Control':'no-cache', 'User-Agent':'DigiHouse deployment health check'})
    with urllib.request.urlopen(req, timeout=20) as response:
        if response.status != 200: raise ValueError(f'{path}: HTTP {response.status}')
        return response.read(), response.headers.get_content_type()
def check():
    html, mime = fetch('')
    assert mime == 'text/html' and b'id="root"' in html, 'Homepage unavailable'
    parser = Assets(); parser.feed(html.decode('utf-8'))
    parser.urls = [(url, kind) for url, kind in parser.urls if urllib.parse.urlparse(urllib.parse.urljoin(BASE, url)).netloc == urllib.parse.urlparse(BASE).netloc]
    assert any(kind == 'script' for _, kind in parser.urls), 'Missing application script'
    assert any(kind == 'stylesheet' for _, kind in parser.urls), 'Missing styles'
    assert any(kind == 'icon' for _, kind in parser.urls), 'Missing favicon'
    for url, kind in parser.urls:
        body, mime = fetch(url)
        assert body and mime != 'text/html', f'{kind} resolved to an HTML fallback'
    body, _ = fetch('data/catalogo.csv')
    products = list(csv.DictReader(io.StringIO(body.decode('utf-8-sig'))))
    assert products and all(row.get('name') for row in products), 'Catalog unavailable'
    body, _ = fetch('data/comuni.json')
    cities = json.loads(body); assert len(cities) > 7000, 'Municipality suggestions unavailable'
    partners = json.loads((pathlib.Path(__file__).resolve().parent.parent / 'src/data/partners.json').read_text())
    logos = [p['logo'] for p in partners if p.get('logo')]
    for logo in logos:
        body, mime = fetch(logo.lstrip('/'))
        assert body and mime.startswith('image/'), f'Partner logo unavailable: {logo}'
    body, _ = fetch('candidatura-inviata.html')
    assert b'digi-careers-receipt' in body, 'Application receipt unavailable'
    print(f'Published site OK: homepage, JS, CSS, favicon, {len(products)} CSV records, {len(cities)} municipalities, {len(logos)} partner logos and application receipt. No forms submitted.')
for attempt in range(4):
    try:
        check(); break
    except Exception as error:
        if attempt == 3: raise
        print(f'Waiting for deployment: {error}', flush=True)
        time.sleep(5)
