#!/usr/bin/env python3
"""Package the buildless browser game into cacheable content-addressed assets."""
import hashlib,json,re,gzip
from pathlib import Path
root=Path(__file__).resolve().parents[1];dist=root/'dist';manifest=root/'client-manifest.json';html=(dist/'index.html').read_text()
if not manifest.exists():
 scripts=re.findall(r'<script src="([^"?]+)(?:\?[^\"]*)?"></script>',html)
 styles=re.findall(r'<link rel="stylesheet" href="([^"?]+)(?:\?[^\"]*)?">',html)
 manifest.write_text(json.dumps({'scripts':scripts,'styles':styles},indent=2)+'\n')
config=json.loads(manifest.read_text());out=dist/'assets/client';out.mkdir(parents=True,exist_ok=True)
def emit(paths,prefix,ext):
 payload=('\n'.join('/* '+path+' */\n'+(dist/path).read_text() for path in paths)+'\n').encode()
 name=prefix+'.'+hashlib.sha256(payload).hexdigest()[:12]+'.'+ext
 (out/name).write_bytes(payload)
 return 'assets/client/'+name,len(payload),len(gzip.compress(payload))
script,sbytes,sgzip=emit(config['scripts'],'app','js');style,cbytes,cgzip=emit(config['styles'],'game','css')
html=re.sub(r'<script\b[^>]*\bsrc="[^"]+"[^>]*>\s*</script>','',html)
html=html.replace('</body>','<script defer src="'+script+'"></script></body>')
html=re.sub(r'<link rel="stylesheet" href="(?!https:)[^\"]+">','',html)
html=html.replace('</head>','<link rel="stylesheet" href="'+style+'"></head>')
(dist/'index.html').write_text(html)
print(json.dumps({'script':script,'stylesheet':style,'scriptBytes':sbytes,'scriptGzipBytes':sgzip,'styleBytes':cbytes,'styleGzipBytes':cgzip,'firstPartyCodeRequests':2}))
