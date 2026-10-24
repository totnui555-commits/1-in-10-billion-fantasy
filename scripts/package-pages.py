#!/usr/bin/env python3
"""Create a directly uploadable Cloudflare Pages ZIP from the current build."""
import argparse
import json
from pathlib import Path
import re
import zipfile

parser = argparse.ArgumentParser()
parser.add_argument('output', type=Path)
args = parser.parse_args()
dist = Path(__file__).resolve().parents[1] / 'dist'
for ref in re.findall(r'(?:src|href)="([^"#]+)"', (dist / 'index.html').read_text()):
    if not ref.startswith(('https:', 'http:')) and not (dist / ref).is_file():
        raise SystemExit('Missing build asset: ' + ref)
args.output.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(args.output, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(dist.rglob('*')):
        if path.is_file():
            archive.write(path, path.relative_to(dist))
with zipfile.ZipFile(args.output) as archive:
    assert archive.testzip() is None
    assert 'index.html' in archive.namelist()
    assert '_headers' in archive.namelist()
    print(json.dumps({'archive': str(args.output.resolve()), 'bytes': args.output.stat().st_size,
                      'files': len(archive.namelist()), 'index_at_root': True}))
