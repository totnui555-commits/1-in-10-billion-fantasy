#!/usr/bin/env python3
"""Build the complete v35 illustrated world and matching interaction/navigation geometry.
No old coordinate layout is reused. Dependencies: shapely, scipy (build-time only).
"""
from pathlib import Path
import json,math,random,heapq,html
from shapely.geometry import Polygon,Point,LineString
from shapely.ops import unary_union
from scipy.spatial import Voronoi
R=Path(__file__).resolve().parents[1];random.seed(35052);W,H=3000,2100
# Authored coast skeletons: bays, fjords, peninsulas, enclosed seas and straits.
anchors=[[(150,490),(230,380),(350,350),(290,240),(460,200),(490,110),(660,130),(730,230),(900,160),(1040,220),(1190,130),(1360,160),(1380,270),(1560,240),(1700,310),(1860,300),(1990,420),(1910,540),(2010,650),(1900,750),(1770,700),(1650,770),(1670,890),(1810,940),(1720,1040),(1560,1020),(1460,920),(1320,970),(1190,890),(1150,1030),(1010,1110),(880,1060),(820,930),(690,1010),(590,940),(600,820),(470,850),(400,750),(260,780),(180,680),(270,620),(140,570)],[(250,1430),(400,1320),(540,1350),(650,1240),(800,1290),(830,1410),(1010,1370),(1090,1260),(1250,1300),(1370,1420),(1520,1400),(1550,1520),(1420,1610),(1450,1730),(1300,1790),(1260,1920),(1090,1990),(950,1910),(840,1940),(720,1810),(620,1820),(570,1700),(410,1760),(330,1640),(350,1530),(220,1530)],[(2280,180),(2450,230),(2560,340),(2510,490),(2670,540),(2780,470),(2840,600),(2750,740),(2790,890),(2690,1030),(2730,1190),(2590,1280),(2500,1180),(2430,1310),(2330,1280),(2290,1120),(2140,1080),(2090,960),(2170,840),(2100,710),(2150,590),(2250,640),(2340,550),(2220,470),(2150,340)]]
# Each realm remains its canonical ID. No kingdom is encoded by display order.
groups=[[0,1,2,3,4,5,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,24,25,27,28,29,30,31],[32,33,34,35,36,37,39,40,41,42,44,45,49,50],[23,26,38,43,46,47],[6],[15],[48],[51]]
# Capitals deliberately vary in spacing and orientation instead of rows/tiles.
seeds=[[(690,570),(1070,440),(1620,490),(1050,700),(380,580),(1420,760),(650,850),(440,275),(780,320),(1280,290),(870,760),(1320,570),(1690,930),(1000,950),(530,500),(610,215),(1810,420),(1570,660),(1250,430),(840,550),(1120,850),(1840,610),(850,910),(1480,350),(1560,860),(1170,620),(1380,900),(1090,240)],[(1120,1590),(1080,1840),(760,1580),(870,1780),(1240,1440),(540,1480),(1320,1650),(620,1660),(1010,1430),(380,1460),(980,1700),(710,1390),(1200,1900),(440,1630)],[(2480,720),(2390,390),(2630,980),(2280,940),(2460,1140),(2730,620)],[(1830,1210)],[(2070,1460)],[(1710,1780)],[(2570,1750)]]
# Small, very differently shaped maritime realms, not six repeated island circles.
anchors.extend([[(1720,1190),(1800,1110),(1880,1150),(1910,1240),(1840,1280),(1770,1260)],[(1920,1480),(1980,1360),(2070,1350),(2120,1440),(2220,1480),(2200,1550),(2080,1520),(2010,1570)],[(1550,1740),(1630,1690),(1730,1680),(1840,1730),(1810,1820),(1750,1800),(1650,1870),(1590,1820)],[(2410,1660),(2540,1620),(2610,1690),(2730,1680),(2760,1770),(2680,1850),(2540,1820),(2490,1750),(2380,1740)]])
def smooth(a,step=8):
 out=[];n=len(a)
 for i in range(n):
  p0,p1,p2,p3=[a[(i+j)%n] for j in [-1,0,1,2]];count=max(3,int(math.dist(p1,p2)/step))
  for j in range(count):
   t=j/count;out.append(tuple(.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t*t+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t*t*t) for k in [0,1]))
 return out
def shore(a):
 base=smooth(a,6);out=[]
 for i,p in enumerate(base):
  q=base[(i+1)%len(base)];dx,dy=q[0]-p[0],q[1]-p[1];length=math.hypot(dx,dy)or 1;n=3*math.sin(i*1.17)+2*math.sin(i*.37)+random.uniform(-2,2)
  out.append((p[0]-dy/length*n,p[1]+dx/length*n))
 return Polygon(out).buffer(0)
coasts=[shore(a) for a in anchors]
# Three sheltered lakes cut out of the land: interaction regions respect them too.
lakes=[Polygon(smooth([(940,450),(970,420),(1005,450),(990,510),(950,525)])),Polygon(smooth([(790,1440),(825,1430),(850,1490),(810,1530),(780,1490)])),Polygon(smooth([(2470,820),(2520,805),(2540,855),(2490,890),(2460,860)]))]
for i,l in enumerate(lakes):coasts[i]=coasts[i].difference(l)
# Non-linear warping bends shared inland boundaries consistently. It removes the
# straight Voronoi appearance without gaps or overlapping political regions.
def warp(p):
 x,y=p;return [round(x+20*math.sin(y/120)+10*math.sin(x/100+y/80),2),round(y+18*math.sin(x/135)+9*math.sin(y/90+x/65),2)]
def warpPoly(poly):
 if poly.geom_type!='Polygon':return unary_union([warpPoly(p) for p in poly.geoms if p.geom_type=='Polygon'])
 def ring(coords):
  out=[]
  for a,b in zip(coords,coords[1:]):
   n=max(1,int(math.dist(a,b)/12))
   for j in range(n):out.append(warp((a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n)))
  return out
 return Polygon(ring(list(poly.exterior.coords)),[ring(list(x.coords)) for x in poly.interiors]).buffer(0)
def path(poly):
 if poly.is_empty:return ''
 if poly.geom_type!='Polygon':return ''.join(path(g) for g in poly.geoms)
 def ring(c):return 'M'+'L'.join(f'{x:.2f},{y:.2f}' for x,y in c)+'Z'
 return ring(poly.exterior.coords)+''.join(ring(r.coords) for r in poly.interiors)
def clip(poly,a,b):
 nx,ny=b[0]-a[0],b[1]-a[1];limit=(b[0]**2+b[1]**2-a[0]**2-a[1]**2)/2;out=[]
 for p,q in zip(poly,poly[1:]+poly[:1]):
  u=nx*p[0]+ny*p[1]-limit;v=nx*q[0]+ny*q[1]-limit
  if u<=0:out.append(p)
  if (u<=0)!=(v<=0):t=u/(u-v);out.append((p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])))
 return out
points=[None]*52;regions=[None]*52;continents=[None]*52;raw=[None]*52
for group,(ids,ps,coast) in enumerate(zip(groups,seeds,coasts)):
 for idx,a in zip(ids,ps):
  assert coast.contains(Point(a)),(idx,a)
  cell=[(0,0),(W,0),(W,H),(0,H)]
  for b in ps:
   if a!=b:cell=clip(cell,a,b)
  shape=Polygon(cell).intersection(coast);raw[idx]=shape;regions[idx]=warpPoly(shape);points[idx]=warp(a);continents[idx]=group
land=unary_union(regions);coastline=path(land);ink='#4d3b26';paper='#e4c995'
s=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"><defs><radialGradient id="vellum"><stop stop-color="#f3e3ba"/><stop offset=".78" stop-color="#e4c995"/><stop offset="1" stop-color="#b08b58"/></radialGradient><pattern id="grain" width="260" height="260" patternUnits="userSpaceOnUse"><filter id="fibers"><feTurbulence type="fractalNoise" baseFrequency=".34" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="260" height="260" filter="url(#fibers)" opacity=".12"/></pattern><clipPath id="land"><path d="{coastline}" fill-rule="evenodd"/></clipPath><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 7l7 -7" stroke="#73583b" stroke-width=".6"/></pattern></defs><rect width="3000" height="2100" fill="url(#vellum)"/><rect width="3000" height="2100" fill="url(#grain)"/>']
# Antique seafloor wave engraving and nested coastal contour lines.
for distance,opacity in [(24,.22),(15,.3),(7,.42)]:s.append(f'<path d="{path(land.buffer(distance))}" fill="none" stroke="#7b7151" stroke-width=".8" opacity="{opacity}"/>')
for _ in range(1500):
 x=random.uniform(70,W-70);y=random.uniform(80,H-80)
 if land.buffer(35).contains(Point(x,y)):continue
 s.append(f'<path d="M{x:.1f} {y:.1f}q5 -2 10 0t10 0m-14 4h10" fill="none" stroke="#897653" stroke-width=".65" opacity=".32"/>')
s.append(f'<path d="{coastline}" fill="#e9d5a9" fill-rule="evenodd" stroke="{ink}" stroke-width="2.3"/>')
# Faint earth washes form terrain, not colored polygon tiles.
s.append('<g clip-path="url(#land)">')
for x,y,rx,ry,fill in [(1080,400,660,190,'#afae7a'),(680,1470,380,240,'#ada773'),(1560,480,400,160,'#b5a486'),(880,1800,330,230,'#d0b181'),(2450,730,280,480,'#bab88b')]:s.append(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" opacity=".18"/>')
# Inland boundaries are secondary to terrain. Their warped shared curves match hit areas.
for r in regions:s.append(f'<path d="{path(r)}" fill="none" stroke="#8e704d" stroke-width="1" stroke-dasharray="3 6" opacity=".53"/>')
# Authored continuous mountain ranges. Peaks have individual contour strokes and hatching.
ranges=[[(450,230),(620,350),(800,430),(990,640),(1150,690),(1350,750)],[(1100,200),(1320,320),(1470,510),(1600,660),(1760,800)],[(420,1460),(620,1500),(800,1650),(1050,1760),(1200,1880)],[(2390,260),(2370,520),(2490,700),(2580,900),(2550,1130)]]
mountain_points=[]
for chain in ranges:
 line=LineString(chain)
 for t in range(0,int(line.length),16):
  p=line.interpolate(t);x,y=warp((p.x,p.y));x+=random.uniform(-15,15);y+=random.uniform(-26,26)
  if any(math.dist((x,y),c)<40 for c in points):continue
  h=random.uniform(20,43);w=h*.65;mountain_points.append((x,y));s.append(f'<g stroke="{ink}" stroke-width="1.1" stroke-linejoin="round"><path d="M{x-w:.1f} {y+8:.1f}l{w:.1f} {-h:.1f} {w:.1f} {h:.1f}" fill="#e2c99c"/><path d="M{x:.1f} {y-h+8:.1f}l{-w*.25:.1f} {h*.52:.1f} {w*.22:.1f} {-h*.08:.1f} {-w*.08:.1f} {h*.56:.1f}" fill="none"/><path d="M{x+1:.1f} {y-h+12:.1f}l{w*.65:.1f} {h*.86:.1f}h{-w*.65:.1f}Z" fill="url(#hatch)" stroke="none"/></g>')
# Dense woods arranged in ecological belts and clearings, with broadleaf and conifer forms.
forests=[(950,360,270,120),(1240,520,210,160),(450,710,220,100),(850,850,180,100),(560,1410,180,90),(800,1580,180,160),(1160,1450,180,100),(2420,600,160,100),(2620,1010,140,150)]
for fx,fy,rx,ry in forests:
 for _ in range(int(rx*ry/180)):
  x=fx+random.uniform(-rx,rx);y=fy+random.uniform(-ry,ry)
  if ((x-fx)/rx)**2+((y-fy)/ry)**2>random.uniform(.6,1.1):continue
  x,y=warp((x,y))
  if any(math.dist((x,y),c)<38 for c in points) or any(math.dist((x,y),c)<22 for c in mountain_points):continue
  h=random.uniform(10,19);s.append(f'<g stroke="#5c5638" stroke-width=".9" fill="#c3bd8c"><path d="M{x:.1f} {y+4:.1f}v-6m{-h*.38:.1f} 2q{-h*.4:.1f} {-h*.7:.1f} {h*.1:.1f} {-h*.8:.1f}q{h*.25:.1f} {-h:.1f} {h*.55:.1f} {-h*.2:.1f}q{h*.65:.1f} {-h*.1:.1f} {h*.5:.1f} {h*.6:.1f}q{h*.25:.1f} {h*.7:.1f} {-h*.6:.1f} {h*.4:.1f}Z"/></g>')
# Rivers start on the flanks of ranges, merge before reaching a coastal outlet.
rivers=[[(890,450),(840,530),(720,620),(570,640),(450,700),(390,760)],[(1130,420),(1190,500),(1130,550),(1060,650),(1070,790),(1000,910),(1010,1095)],[(1500,540),(1450,620),(1480,690),(1390,790),(1330,930)],[(650,1530),(720,1580),(790,1640),(740,1700),(720,1800)],[(1050,1730),(1120,1690),(1220,1730),(1300,1790)],[(2460,520),(2510,650),(2450,760),(2510,850),(2450,960),(2330,1060),(2180,1090)]]
for river in rivers:
 p=[warp(a) for a in river];d='M'+' '.join((('' if i==0 else 'L')+f'{x:.1f},{y:.1f}')for i,(x,y) in enumerate(p));s.append(f'<path d="{d}" fill="none" stroke="#e9d5a9" stroke-width="6"/><path d="{d}" fill="none" stroke="#657f79" stroke-width="2.1" stroke-linejoin="round"/>')
for lake in lakes:s.append(f'<path d="{path(warpPoly(lake))}" fill="#afb5a1" stroke="#657f79" stroke-width="1.3"/>')
s.append('</g>')
# Local cartographic details: dunes and grass, leaving capital names legible.
for fx,fy,rx,ry in [(1550,620,180,100),(1170,1880,170,80),(530,1710,100,70)]:
 for j in range(90):
  x=fx+random.uniform(-rx,rx);y=fy+random.uniform(-ry,ry)
  if not land.contains(Point(x,y)) or any(math.dist((x,y),c)<45 for c in points):continue
  s.append(f'<path d="M{x:.1f} {y:.1f}q10 -10 25 0m-12 -3 8 3" fill="none" stroke="#ad8954" stroke-width=".9"/>')
# Roads follow a land grid and prefer low ground. All countries get connected.
step=24;mask={};mount=unary_union([LineString([warp(p) for p in a]).buffer(27) for a in ranges])
def node(p):return (round(p[0]/step),round(p[1]/step))
def valid(n,sea=False):
 x,y=n[0]*step,n[1]*step
 if x<30 or x>W-30 or y<30 or y>H-30:return False
 if n not in mask:mask[n]=land.contains(Point(x,y))
 return (not mask[n]) if sea else mask[n]
def route(a,b):
 start,end=node(a),node(b)
 # Snap capitals to nearby land grid cells.
 def snap(n):
  if valid(n):return n
  return min((q for dx in range(-3,4) for dy in range(-3,4) if valid(q:=(n[0]+dx,n[1]+dy))),key=lambda q:math.dist(q,n))
 start,end=snap(start),snap(end);queue=[(0,start)];cost={start:0};prev={}
 while queue:
  _,cur=heapq.heappop(queue)
  if cur==end:break
  for dx,dy in [(1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)]:
   q=(cur[0]+dx,cur[1]+dy)
   if not valid(q):continue
   v=cost[cur]+math.hypot(dx,dy)*(2.4 if mount.contains(Point(q[0]*step,q[1]*step)) else 1)
   if v<cost.get(q,1e9):cost[q]=v;prev[q]=cur;heapq.heappush(queue,(v+math.dist(q,end),q))
 if end not in cost:return [a,b]
 out=[end];cur=end
 while cur!=start:cur=prev[cur];out.append(cur)
 poly=LineString([a]+[[x*step,y*step] for x,y in reversed(out)]+[b]).simplify(9)
 return [[round(x,2),round(y,2)] for x,y in poly.coords]
edges=[]
for i in range(52):
 for j in range(i+1,52):
  if continents[i]==continents[j] and raw[i].distance(raw[j])<0.01:
   p=route(points[i],points[j]);edges.append({'from':i,'to':j,'kind':'road','path':p})
# Explicit sea corridors connect the seven landmasses. Their bends stay in open water.
for a,b,via in [(4,42,[(210,1000),(170,1230)]),(5,23,[(2020,860),(2070,940)]),(5,6,[(1760,1050)]),(6,15,[(1900,1340)]),(15,48,[(1930,1620)]),(48,51,[(1950,1930),(2260,1920)]),(38,51,[(2820,1250),(2850,1550)])]:edges.append({'from':a,'to':b,'kind':'ferry','path':[points[a]]+via+[points[b]]})
# Capital icons: fortresses, walled ports and abbey towns, varied by ID.
for i,(x,y) in enumerate(points):
 s.append(f'<g transform="translate({x-15:.1f},{y-25:.1f})" stroke="{ink}" stroke-width="1.35" stroke-linejoin="round" fill="#e9d5a9">')
 if i%3==0:s.append('<path d="M0 28V7h7v7h6V0h8v14h6V7h7v28H0Z"/><path d="M-3 7 3 -2 10 7M10 0l7 -12L25 0M24 7l6 -9 7 9" fill="#8a6344"/><path d="M13 35V24q4 -6 8 0v11" fill="#775b3c"/><path d="M4 18v4m26 -4v4M17 6v5"/>')
 elif i%3==1:s.append('<path d="M0 33V18h28v15Z"/><path d="M-3 18 13 4 31 18M5 15V2h7v7m8 5V0h7v17" fill="#a68155"/><path d="M9 33v-9h7v9M2 23h3m16 0h3"/>')
 else:s.append('<path d="M0 35V18h10V4h8v14h14v17Z"/><path d="M-3 18 6 9 12 18M7 4l7 -9 7 9M18 18l7 -7 10 7" fill="#99734d"/><path d="M11 35v-9q3 -5 6 0v9M14 9v5"/>')
 s.append('</g>')
# Smaller settlements cluster along actual roads, not randomly scattered across ridges.
for e in edges:
 if e['kind']!='road':continue
 line=LineString(e['path']);p=line.interpolate(line.length*.5)
 if any(math.dist((p.x,p.y),c)<48 for c in points):continue
 s.append(f'<g transform="translate({p.x:.1f},{p.y:.1f})" fill="#ac8c5f" stroke="#634b30" stroke-width=".9"><path d="M-7 3v-9h11v9m-14 -9 9 -7 8 7M8 5v-8h8v8m-10 -8 6 -6 6 6"/></g>')
# Sea labels sit in the water; no huge title filling half an empty map.
for x,y,txt,size,rot in [(630,1170,'THE WESTERN PASSAGE',27,-5),(1900,270,'SEA OF VEILS',28,15),(1880,1600,'THE WANDERING SEA',26,-15),(1550,1990,'SOUTHERN REACHES',25,0),(2800,1410,'THE SILENT DEEP',25,80)]:s.append(f'<text x="{x}" y="{y}" transform="rotate({rot} {x} {y})" fill="#7a6344" font-family="Georgia,serif" font-size="{size}" font-style="italic" text-anchor="middle" letter-spacing="4">{txt}</text>')
# Small engraved compass and decorative title plaque, as in a period atlas.
s.append('<g transform="translate(180 1120)" stroke="#6d5334"><circle r="67" fill="none"/><circle r="61" fill="none"/>')
for a in range(0,360,45):s.append(f'<path transform="rotate({a})" d="M0 -84L10 0 0 84 -10 0Z" fill="{ "#745536" if a%90==0 else "#d6b47e"}" stroke-width="1"/>')
s.append('<circle r="8" fill="#ead1a0"/><text y="-98" text-anchor="middle" fill="#62482c" stroke="none" font-family="Georgia,serif" font-size="22">N</text></g>')
s.append('<g transform="translate(2220 150)" fill="#533d26" text-anchor="middle" font-family="Georgia,serif"><path d="M-240 -100h480v95h-480Z" fill="#e5cd9e" stroke="#82623d" stroke-width="2"/><path d="M-232 -92h464v79h-464Z" fill="none" stroke="#82623d"/><text y="-57" font-size="29" letter-spacing="4">THE KNOWN REALMS</text><text y="-28" font-size="13" letter-spacing="3">A CHRONICLE OF FIFTY-TWO KINGDOMS</text></g>')
# Interwoven frame, restrained edge wear, and corner rosettes.
s.append('<rect x="25" y="25" width="2950" height="2050" fill="none" stroke="#735030" stroke-width="3"/><rect x="34" y="34" width="2932" height="2032" fill="none" stroke="#735030" stroke-width="1.2"/><rect x="44" y="44" width="2912" height="2012" fill="none" stroke="#735030" stroke-width="1"/>')
for x,y in [(34,34),(2966,34),(34,2066),(2966,2066)]:s.append(f'<g transform="translate({x} {y})" fill="#87633e"><path d="M0 -16 5 -5 16 0 5 5 0 16 -5 5 -16 0 -5 -5Z"/><circle r="4" fill="#e8cfa0"/></g>')
s.append('</svg>');(R/'dist/assets/world-atlas-v35.svg').write_text(''.join(s))
data={'width':W,'height':H,'points':points,'shapes':[path(r) for r in regions],'roads':edges,'continents':continents}
(R/'content/world-atlas-v35.json').write_text(json.dumps(data,separators=(',',':'))+'\n');(R/'dist/atlas-geography.js').write_text("'use strict';\nconst WORLD_ATLAS_GEOMETRY="+json.dumps(data,separators=(',',':'))+';\n')
print(json.dumps({'realms':len(regions),'landmasses':len(coasts),'routes':len(edges),'svgBytes':(R/'dist/assets/world-atlas-v35.svg').stat().st_size}))
