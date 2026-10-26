"""Compile the editable world and family chronologies; never translate at runtime."""
from pathlib import Path
import json
r=Path(__file__).resolve().parents[1]
a=json.loads((r/'content/world-history.json').read_text());b=json.loads((r/'content/house-history.json').read_text())
assert len(b)==200 and len({x['id'] for x in b})==200
assert all(500<=x['founded']<=x['recognized']<=1000 for x in b)
(r/'dist/history-data.js').write_text("'use strict';\nconst HISTORY_CHRONICLE="+json.dumps(a,ensure_ascii=False,separators=(',',':'))+';\nconst HISTORY_HOUSES='+json.dumps(b,ensure_ascii=False,separators=(',',':'))+';\nconst BIRTH_ERAS='+json.dumps(json.loads((r/'content/birth-eras.json').read_text()),ensure_ascii=False,separators=(',',':'))+';\n')
