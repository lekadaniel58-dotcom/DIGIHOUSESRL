"""Read-only smoke check of the public Pages deployment. Never submits any form."""
import csv, io, json, pathlib, re, sys, time, urllib.parse, urllib.request
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
    checked_gp_module = False
    for url, kind in parser.urls:
        body, mime = fetch(url)
        assert body and mime != 'text/html', f'{kind} resolved to an HTML fallback'
        if kind == 'script':
            for chunk in set(re.findall(r'gpWoodProducts-[A-Za-z0-9_-]+\.js', body.decode('utf-8'))):
                module, module_mime = fetch(urllib.parse.urljoin(url, chunk))
                assert module and module_mime != 'text/html', 'GP catalogue module unavailable'
                checked_gp_module = True
    assert checked_gp_module, 'Published application does not include the GP catalogue'
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
    gp = json.loads((pathlib.Path(__file__).resolve().parent.parent / 'src/data/gpWoodProducts.json').read_text())
    samples = {p['door_series']:p for p in gp}
    for product in samples.values():
        for asset in [product['images'][0], product['thumbnail']]:
            body, mime = fetch('data/immagini/'+asset)
            assert body[8:12] == b'WEBP' and mime.startswith('image/'), 'GP image unavailable: '+product['name']
    body, _ = fetch('candidatura-inviata.html')
    assert b'digi-careers-receipt' in body, 'Application receipt unavailable'
    print(f'Published site OK: homepage, JS, CSS, favicon, {len(products)} CSV records, {len(cities)} municipalities, {len(logos)} partner logos, GP catalogue module and images across 12 series, and application receipt. No forms submitted.')
for attempt in range(4):
    try:
        check(); break
    except Exception as error:
        if attempt == 3: raise
        print(f'Waiting for deployment: {error}', flush=True)
        time.sleep(5)
