"""Hand-ink inspired atlas; uses the same 52 hit areas and coordinates as navigation."""
import json,re,random,math
from pathlib import Path
from shapely.geometry import Polygon,Point
from shapely.ops import unary_union
r=Path(__file__).resolve().parents[1];data=json.loads((r/'content/atlas34-geometry.json').read_text());random.seed(34052)
s=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3600 1800"><defs><pattern id="paper" width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="100" fill="#e7d8b2"/><path d="M0 17h100M0 71h100" stroke="#d6c49c" stroke-width=".4"/></pattern><pattern id="sea" width="64" height="42" patternUnits="userSpaceOnUse"><path d="M4 20q8 -4 16 0t16 0" stroke="#89866b" stroke-width=".6" fill="none" opacity=".35"/></pattern></defs><rect width="3600" height="1800" fill="url(#paper)"/><rect width="3600" height="1800" fill="url(#sea)"/>']
# Faint rhumb lines, visible only in the ocean beneath opaque terrain.
for x,y in [(490,1150),(1630,1350),(2810,1160)]:
 for a in range(0,360,15):
  dx=math.cos(math.radians(a))*4200;dy=math.sin(math.radians(a))*4200;s.append(f'<path d="M{x} {y}l{dx:.1f} {dy:.1f}" stroke="#978768" stroke-width=".65" opacity=".22"/>')
lands=[]
for i,(shape,(cx,cy)) in enumerate(zip(data['shapes'],data['points'])):
 polys=[]
 for segment in re.split('[zZ]',shape):
  nums=[float(n) for n in re.findall(r'-?\d+(?:\.\d+)?',segment)]
  if len(nums)>=6:
   p=Polygon(list(zip(nums[::2],nums[1::2]))).buffer(0)
   if not p.is_empty:polys.append(p)
 land=unary_union(polys);lands.append(land);s.append(f'<path d="{shape}" fill="{["#e1d1a8","#ded0ac","#e9dcb9","#e4d5b0"][i%4]}" stroke="#9b8662" stroke-width="1.3" stroke-dasharray="3 3"/>')
 # Natural clusters of mountains and woods follow the local basin. Never draw across coasts.
 random.seed(34000+i)
 radius=58 if i<16 else 135
 for j in range(150 if i>=16 else 65):
  x=cx+random.uniform(-radius,radius);y=cy+random.uniform(-radius,radius)
  if not land.contains(Point(x,y)) or math.hypot(x-cx,y-cy)<27:continue
  ridge=(math.sin((x+cy)/85)*30+cy-35)
  if abs(y-ridge)<22:
   h=random.randint(10,23);w=h*.65;s.append(f'<path d="M{x-w:.1f} {y+6:.1f}l{w:.1f} {-h} {w:.1f} {h}m{-w:.1f} {-h}l-2 {h*.55:.1f} 4 -2 -2 {h*.45:.1f}" fill="#cbb68a" stroke="#665539" stroke-width=".95"/>')
  elif math.sin(x/40)+math.cos(y/45)>.1:
   s.append(f'<path d="M{x:.1f} {y+6:.1f}v-6m-5 1 5 -11 5 11z" fill="#b0b08a" stroke="#6b6c47" stroke-width=".75"/>')
 # A short river basin curves around the capital; tributary joins upstream.
 outlet=land.boundary.interpolate(land.boundary.project(Point(cx-40,cy+radius)))
 s.append(f'<path d="M{cx+35} {cy-radius*.6:.1f}Q{cx-32} {cy-20} {cx+18} {cy+25}T{outlet.x:.1f} {outlet.y:.1f}" fill="none" stroke="#788e87" stroke-width="2"/><path d="M{cx-28} {cy-50}L{cx+1} {cy-20}" stroke="#788e87" stroke-width="1.1" fill="none"/>')
 # Medieval walled capitals, three towers and gate.
 s.append(f'<g transform="translate({cx-13} {cy-16})" stroke="#55462e" stroke-width="1.3" fill="#d1bb8f"><path d="M0 17V4h5v4h5V0h6v8h5V4h5v24H0Z"/><path d="M10 28v-8q3 -5 6 0v8" fill="#756446"/><path d="M-2 4l5 -6 5 6M8 0l5 -7 5 7M18 4l5 -6 5 6" fill="#8b6750"/></g>')
# Main watersheds connect the new continents to their coastal outlets.
for river in ['M2260 120Q2180 260 2260 420T2200 850T2140 1350L2100 1610','M3200 100Q3120 280 3240 450T3120 850L3230 1040']:
 s.append(f'<path d="{river}" stroke="#788e87" stroke-width="3" fill="none"/>')
# Coastlines, distinct from lightly dashed inland borders.
world=unary_union(lands)
parts=[world] if world.geom_type=='Polygon' else world.geoms
for p in parts:
 if p.geom_type!='Polygon':continue
 pts=' '.join(f'{x:.1f},{y:.1f}' for x,y in p.exterior.coords)
 s.append(f'<polyline points="{pts}" fill="none" stroke="#716344" stroke-width="2.2"/>')
# Large empty western sea becomes a cartographic title and compass, not unused canvas.
s.append('<g fill="#66543a" text-anchor="middle" font-family="Georgia,serif"><text x="820" y="830" font-size="42" letter-spacing="9">ATLAS OF THE KNOWN REALMS</text><text x="820" y="875" font-size="20" letter-spacing="5">FIFTY-TWO REALMS • ONE LIFETIME</text><path d="M390 910h860M450 918h740" stroke="#88714c"/><text x="1380" y="1110" font-size="25" font-style="italic" letter-spacing="7">The Meridian Sea</text><text x="2920" y="1740" font-size="23" font-style="italic" letter-spacing="6">The Far Reaches</text></g>')
x,y=800,1220
s.append(f'<g transform="translate({x} {y})" stroke="#75613d" fill="none"><circle r="114"/><circle r="104"/><circle r="75"/>')
for a in range(0,360,45):s.append(f'<path transform="rotate({a})" d="M0 -100L14 0 0 100 -14 0Z" fill="{ "#8a754e" if a%90==0 else "#c6b183"}"/>')
s.append('<circle r="12" fill="#e7d8b2"/><g font-family="Georgia,serif" font-size="25" fill="#66543a" stroke="none" text-anchor="middle"><text y="-130">N</text><text y="150">S</text><text x="140" y="8">E</text><text x="-140" y="8">W</text></g></g><rect x="9" y="9" width="3582" height="1782" fill="none" stroke="#8e7852" stroke-width="5"/><rect x="19" y="19" width="3562" height="1762" fill="none" stroke="#8e7852" stroke-width="1"/></svg>')
(r/'dist/assets/world-atlas-v34.svg').write_text(''.join(s))
