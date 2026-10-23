"""Fetch only public assets explicitly listed in the reviewed source manifest."""
import hashlib
import io
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen
import fitz
from PIL import Image

root = Path('docs/aip-source')
requests = json.loads((root / 'asset-requests.json').read_text())
destination = Path('data/immagini'); destination.mkdir(exist_ok=True)
def fetch(url):
    if urlparse(url).hostname != 'aipporte.com' or not url.startswith('https://'):
        raise ValueError('Unreviewed asset host')
    with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0 DigiHouse catalogue review'}), timeout=60) as response:
        data = response.read(100_000_001)
        if len(data) > 100_000_000:
            raise ValueError('Asset too large')
        return data
def image(item):
    data = fetch(item['url'])
    photo = Image.open(io.BytesIO(data)); photo.load()
    photo = photo.convert('RGB')
    digest = hashlib.sha256(data).hexdigest()
    stem = 'aip-official-' + digest[:16]
    photo.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
    full = stem + '-full.webp'; thumbnail = stem + '-thumbnail.webp'
    photo.save(destination / full, 'WEBP', quality=94, method=6)
    width, height = photo.size
    photo.thumbnail((600, 600), Image.Resampling.LANCZOS)
    photo.save(destination / thumbnail, 'WEBP', quality=88, method=6)
    return {**item, 'sha256': digest, 'full': full, 'thumbnail': thumbnail, 'width': width, 'height': height}
def pdf(item):
    data = fetch(item['url'])
    document = fitz.open(stream=data, filetype='pdf')
    pages = [{'page': i + 1, 'text': page.get_text()} for i, page in enumerate(document)]
    (root / ('catalog-' + item['id'].lower().replace(' ', '-') + '.json')).write_text(json.dumps({'source': item['url'], 'sha256': hashlib.sha256(data).hexdigest(), 'pages': pages}, ensure_ascii=False, indent=2) + '\n')
    return {'id': item['id'], 'pages': len(pages)}
result = {'images': [], 'pdfs': [], 'errors': []}
with ThreadPoolExecutor(max_workers=4) as pool:
    jobs = {pool.submit(image if kind == 'images' else pdf, item): (kind, item) for kind in ('images', 'pdfs') for item in requests[kind]}
    for job in as_completed(jobs):
        kind, item = jobs[job]
        try:
            result[kind].append(job.result())
        except Exception as error:
            result['errors'].append({'id': item['id'], 'url': item['url'], 'error': str(error)})
result['images'].sort(key=lambda item: item['id'])
(root / 'asset-results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(f'Reviewed AIP assets: {len(result["images"])} images, {len(result["pdfs"])} catalogues; errors: {len(result["errors"])}')
