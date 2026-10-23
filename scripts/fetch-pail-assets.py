"""Download reviewed, model-specific official Pail photos and optimize for the catalog."""
import hashlib, io, json, pathlib, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps
ROOT=pathlib.Path('docs/pail-source');OUT=pathlib.Path('data/immagini');OUT.mkdir(parents=True,exist_ok=True)
def image(item):
    try:
        url=item['image_url']
        if urllib.parse.urlparse(url).hostname not in {'pailporte.com','www.pailporte.com'} or not url.startswith('https://'):raise ValueError('Unexpected asset host')
        with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=90) as response:
            if urllib.parse.urlparse(response.url).hostname not in {'pailporte.com','www.pailporte.com'}:raise ValueError('Unexpected redirect')
            raw=response.read(24*1024*1024+1)
        if len(raw)>24*1024*1024:raise ValueError('Asset too large')
        sha=hashlib.sha256(raw).hexdigest();original=ImageOps.exif_transpose(Image.open(io.BytesIO(raw)));w,h=original.size
        if original.mode in ('RGBA','LA') or 'transparency' in original.info:
            rgba=original.convert('RGBA');im=Image.new('RGB',rgba.size,'white');im.paste(rgba,mask=rgba.getchannel('A'))
        else:im=original.convert('RGB')
        files={}
        for variant,size,quality in [('full',1800,94),('thumbnail',600,88)]:
            converted=im.copy();converted.thumbnail((size,size),Image.Resampling.LANCZOS)
            name=f'pail-official-{sha[:16]}-{variant}.webp';converted.save(OUT/name,'WEBP',quality=quality,method=6);files[variant]=name
        return dict(item,sha256=sha,width=w,height=h,**files)
    except Exception as e:return dict(item,error=str(e))
with ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(image,json.loads((ROOT/'asset-requests.json').read_text())))
(ROOT/'asset-results.json').write_text(json.dumps(results,indent=2,ensure_ascii=False))
errors=[r for r in results if 'error' in r]
print('Photos:',len(results)-len(errors),'Errors:',errors)
if errors:raise SystemExit(1)
