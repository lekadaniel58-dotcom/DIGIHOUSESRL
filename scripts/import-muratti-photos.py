"""Import original dealer photographs; preserve packaging and never upscale."""
import hashlib
import io
import json
import sys
from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
products = json.loads((ROOT / 'src/data/partnerProducts.json').read_text())
if any('-uploaded-' in product.get('image', '') for product in products):
    print('Le fotografie caricate dall’utente sono attive; importazione dai rivenditori ignorata.')
    sys.exit(0)
SOURCES = [
    ('naxos', 'https://www.rotacommerciale.it/wp-content/uploads/2024/11/naxos-pittura-interni-economica.jpg', 'https://www.rotacommerciale.it/prodotto/pittura-economica-per-interni-naxos/'),
    ('panarea', 'https://storage.fareke.com/media/images/product/large/9439/muratti-panarea-idropittura-lavabile-profumata-per-interni.jpg', 'https://www.fareke.com/lavabili/35-delp-italia-genova/6882-482698-muratti-panarea-idropittura-lavabile-profumata-per-interni-8999900482698.html'),
    ('quarzo-liscio', 'https://cdn.shopify.com/s/files/1/0604/6990/3542/products/MURATTI-QUARZOLISCIOBIANCOLT-751832.jpg?v=1673456861', 'https://grossipro.it/products/vernici-e-chimica-muratti-quarzo-liscio-bianco-esterno-lt14-751832-751832'),
]
manifest = []
for name, source, page in SOURCES:
    with urlopen(Request(source, headers={'User-Agent': 'Mozilla/5.0'}), timeout=40) as response:
        data = response.read(15_000_001)
    assert len(data) <= 15_000_000, 'Image too large'
    with Image.open(io.BytesIO(data)) as original:
        original.load()
        image = ImageOps.exif_transpose(original).convert('RGBA' if 'A' in original.getbands() else 'RGB')
    assert min(image.size) >= 300, f'{name}: original photograph too small: {image.size}'
    record = {'product': name, 'source_url': source, 'reference_page': page, 'original_dimensions': list(image.size), 'source_sha256': hashlib.sha256(data).hexdigest()}
    for variant, maximum, quality in [('thumb', 600, 90), ('hd', 1600, 95)]:
        resized = image.copy()
        resized.thumbnail((maximum, maximum), Image.Resampling.LANCZOS)
        filename = f'muratti-{name}-{variant}.webp'
        destination = ROOT / 'public/assets' / filename
        resized.save(destination, 'WEBP', quality=quality, method=6)
        record[variant] = {'file': filename, 'dimensions': list(resized.size), 'bytes': destination.stat().st_size}
    manifest.append(record)
    print(f'::notice::Muratti photograph {json.dumps(record)}', flush=True)
(ROOT / 'docs/muratti-photo-sources.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
