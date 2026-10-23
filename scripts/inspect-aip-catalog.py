"""Read public AIP catalogue sources for review; never modify live product data."""
import datetime
import json
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

DEST = Path('docs/aip-source')
DEST.mkdir(parents=True, exist_ok=True)
report = {'retrieved_at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'errors': [], 'sitemaps': [], 'urls': [], 'links': []}

def allowed(url):
    return urlparse(url).scheme in ('http', 'https') and urlparse(url).hostname in ('aipporte.com', 'www.aipporte.com')

def fetch(url):
    if not allowed(url):
        raise ValueError('Unexpected source host')
    with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; DigiHouse catalogue review)', 'Accept': 'text/html,application/xml,text/xml,*/*'}), timeout=30) as response:
        if not allowed(response.url):
            raise ValueError('Unexpected redirect host')
        data = response.read(10_000_001)
        if len(data) > 10_000_000:
            raise ValueError('Source too large')
        return data, response.url

class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.links = []; self.href = None; self.label = []
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            self.href = dict(attrs).get('href'); self.label = []
    def handle_data(self, data):
        if self.href:
            self.label.append(data.strip())
    def handle_endtag(self, tag):
        if tag == 'a' and self.href:
            url = urljoin('https://aipporte.com/', self.href)
            if allowed(url):
                self.links.append({'url': url, 'text': ' '.join(filter(None, self.label))})
            self.href = None

try:
    data, url = fetch('https://aipporte.com/')
    (DEST / 'home.html').write_bytes(data)
    parser = Links(); parser.feed(data.decode('utf-8', errors='replace'))
    report['links'] = parser.links
    report['home_url'] = url
except Exception as error:
    report['errors'].append({'url': 'https://aipporte.com/', 'error': str(error)})

pending = ['https://aipporte.com/sitemap_index.xml', 'https://aipporte.com/wp-sitemap.xml', 'https://aipporte.com/sitemap.xml']
seen = set(); urls = set()
while pending and len(seen) < 30:
    url = pending.pop(0)
    if url in seen or not allowed(url):
        continue
    seen.add(url)
    try:
        data, resolved = fetch(url)
        root = ET.fromstring(data)
        kind = root.tag.rsplit('}', 1)[-1]
        report['sitemaps'].append({'url': resolved, 'kind': kind})
        if kind == 'sitemapindex':
            pending += [e.text for e in root.findall('.//{*}sitemap/{*}loc') if e.text and allowed(e.text)]
        elif kind == 'urlset':
            for item in root.findall('{*}url'):
                location = item.find('{*}loc')
                if location is not None and location.text and allowed(location.text):
                    urls.add(location.text)
        (DEST / f'sitemap-{len(report["sitemaps"]):02}.xml').write_bytes(data)
    except Exception as error:
        report['errors'].append({'url': url, 'error': str(error)})
report['urls'] = sorted(urls)
(DEST / 'index.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(f'Public AIP source review: {len(urls)} sitemap URLs, {len(report["links"])} home links, {len(report["errors"])} retrieval errors.')
