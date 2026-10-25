#!/usr/bin/env python3
"""Build the local English catalogue. No network calls or external dependencies."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1];d=json.loads((root/'locales/en-source.json').read_text());o=json.loads((root/'locales/en-overrides.json').read_text());names=json.loads((root/'locales/name-romanization.json').read_text());d.update(o)
pack=lambda x:json.dumps(x,ensure_ascii=False,separators=(',',':'))
(root/'dist/locale-en.js').write_text("'use strict';\n// Local English catalogue; no translation requests during play.\nconst ENGLISH_TEXT="+pack(d)+';\nconst ENGLISH_NAME_ROOTS='+pack(names['roots'])+';\nconst ENGLISH_NAME_LETTERS='+pack(names['letters'])+';\n')
print(json.dumps({'phrases':len(d),'editorialOverrides':len(o),'nameRoots':len(names['roots'])}))
