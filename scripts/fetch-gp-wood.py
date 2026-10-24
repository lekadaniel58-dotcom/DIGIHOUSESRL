"""Retrieve reviewed official window images and catalogue text, without changing live data."""
import hashlib,io,json,pathlib,urllib.parse,urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image,ImageOps
import fitz
ROOT=pathlib.Path('docs/gp-classic-source');OUT=pathlib.Path('data/immagini');OUT.mkdir(parents=True,exist_ok=True)
def fetch(url):
    if urllib.parse.urlparse(url).hostname not in {'www.gp-porte.it','gp-porte.it'}:raise ValueError('Unexpected asset host')
    with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=90) as response:
        if urllib.parse.urlparse(response.url).hostname not in {'www.gp-porte.it','gp-porte.it'}:raise ValueError('Unexpected redirect')
        raw=response.read(80*1024*1024+1)
    if len(raw)>80*1024*1024:raise ValueError('Asset exceeds review limit')
    return raw
def convert(raw):
    im=ImageOps.exif_transpose(Image.open(io.BytesIO(raw)));w,h=im.size
    if im.mode in ('RGBA','LA') or 'transparency' in im.info:
        rgba=im.convert('RGBA');im=Image.new('RGB',rgba.size,'white');im.paste(rgba,mask=rgba.getchannel('A'))
    else:im=im.convert('RGB')
    sha=hashlib.sha256(raw).hexdigest();files={}
    for variant,size,quality in [('full',1800,94),('thumbnail',600,88)]:
        image=im.copy();image.thumbnail((size,size),Image.Resampling.LANCZOS)
        filename=f'gp-wood-{sha[:16]}-{variant}.webp';image.save(OUT/filename,'WEBP',quality=quality,method=6);files[variant]=filename
    return dict(sha256=sha,width=w,height=h,**files)
previous_file=ROOT/'asset-results.json'
previous={r['key']:r for r in json.loads(previous_file.read_text()) if 'error' not in r} if previous_file.exists() else {}
def asset(item):
    cached=previous.get(item['key'])
    if cached and all(cached.get(k)==v for k,v in item.items()) and item.get('kind')!='pdf' and all((OUT/cached[k]).exists() for k in ['full','thumbnail']):return cached
    try:
        raw=fetch(item['url'])
        if item.get('kind')=='pdf':
            doc=fitz.open(stream=raw,filetype='pdf')
            text={'source':item['url'],'sha256':hashlib.sha256(raw).hexdigest(),'pages':[{'page':i+1,'text':page.get_text()} for i,page in enumerate(doc)]}
            (ROOT/('catalog-'+item['key']+'.json')).write_text(json.dumps(text,ensure_ascii=False,indent=2))
            extracts=[]
            for request in item.get('extracts',[]):
                page=doc[request['page']-1]
                if request.get('xref'):
                    xref=request['xref'];info=next((r for r in page.get_images(full=True) if r[0]==xref),None)
                    if info and info[1]:
                        image=fitz.Pixmap(fitz.Pixmap(doc,xref),fitz.Pixmap(doc,info[1])).tobytes('png')
                    else:image=doc.extract_image(xref)['image']
                else:
                    scale=request.get('scale',1.7)
                    clip=fitz.Rect(request['clip']) if request.get('clip') else None
                    image=page.get_pixmap(matrix=fitz.Matrix(scale,scale),clip=clip,alpha=False).tobytes('png')
                extracts.append(dict(request,**convert(image)))
            if item.get('inspect_pages'):
                inspection=[]
                for number in item['inspect_pages']:
                    page=doc[number-1];images=[]
                    for image in page.get_images(full=True):
                        images.append({'xref':image[0],'width':image[2],'height':image[3],'rects':[list(r) for r in page.get_image_rects(image[0])]})
                    inspection.append({'page':number,'size':list(page.rect),'words':page.get_text('words'),'images':images})
                (ROOT/('images-'+item['key']+'.json')).write_text(json.dumps(inspection,indent=2))
            return dict(item,sha256=text['sha256'],pages=len(doc),extracts=extracts)
        return dict(item,**convert(raw))
    except Exception as e:return dict(item,error=str(e))
with ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(asset,json.loads((ROOT/'asset-requests.json').read_text())))
(ROOT/'asset-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
errors=[r for r in results if 'error' in r]
print('Reviewed assets:',len(results),'Errors:',errors)
if errors:raise SystemExit(1)
