#!/usr/bin/env python3
"""Build the append-only realm catalogue and pixel atlas (requires shapely)."""
from pathlib import Path
import json,random,math
from shapely.geometry import Polygon,Point
r=Path(__file__).resolve().parents[1];defs=json.loads((r/'content/realms-expansion.json').read_text());random.seed(33052)
coasts=[Polygon([(55,160),(160,65),(370,110),(470,50),(720,140),(850,100),(900,250),(800,420),(900,610),(810,800),(880,980),(770,1160),(820,1410),(700,1630),(520,1690),(340,1580),(150,1650),(60,1460),(110,1240),(35,1050),(80,850),(25,650),(110,440),(40,310)]),Polygon([(1010,150),(1180,70),(1360,90),(1470,40),(1690,110),(1760,300),(1690,470),(1760,650),(1620,850),(1690,1010),(1430,1060),(1250,980),(1110,1040),(1000,850),(1060,650),(950,470),(1020,310)])]
points=[];groups=[]
for i in range(36):
 if i<18:row,col=divmod(i,3);x=180+col*250;y=190+row*260;group=0
 elif i<30:row,col=divmod(i-18,3);x=1100+col*260;y=190+row*230;group=1
 else:row,col=divmod(i-30,3);x=1100+col*260;y=1230+row*290;group=2+i-30
 x+=random.randint(-38,38);y+=random.randint(-34,34)
 if group<2:
  center=coasts[group].representative_point()
  while not coasts[group].contains(Point(x,y)):x=(x+center.x)/2;y=(y+center.y)/2
 else:
  coast=[(x+math.cos(j*math.pi/6)*(100+random.randint(-15,12)),y+math.sin(j*math.pi/6)*(100+random.randint(-15,12))) for j in range(12)];coasts.append(Polygon(coast))
 points.append([round(x),round(y)]);groups.append(group)
def clip(poly,a,b):
 # Convex Voronoi half-plane: closer to a than to b.
 nx,ny=b[0]-a[0],b[1]-a[1];limit=(b[0]*b[0]+b[1]*b[1]-a[0]*a[0]-a[1]*a[1])/2;out=[]
 for p,q in zip(poly,poly[1:]+poly[:1]):
  u=nx*p[0]+ny*p[1]-limit;v=nx*q[0]+ny*q[1]-limit
  if u<=0:out.append(p)
  if (u<=0)!=(v<=0):t=u/(u-v);out.append((p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])))
 return out
def path(poly,offset=0):
 out=[];parts=[poly] if poly.geom_type=='Polygon' else list(poly.geoms)
 for part in parts:
  coords=[(round(x/6)*6+offset,round(y/6)*6) for x,y in part.exterior.coords];out.append('M'+'L'.join(f'{int(x)},{int(y)}' for x,y in coords)+'Z')
 return ''.join(out)
colors={'town':'#c4cca5','frost':'#d0d8d0','ember':'#b29e8d','dune':'#d7c39c','tree':'#9db895','marsh':'#9fb8a7','reef':'#8dbab5','ocean':'#8db6bd','cave':'#9da99c','spirit':'#b6b2bd','web':'#aeb6a2','root':'#a4b18c','steppe':'#c2c7a2','cliff':'#b6beb3','stone':'#acb6b1','glade':'#b6c7a1'}
s=['<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1800" viewBox="0 0 1800 1800"><rect width="1800" height="1800" fill="#b8cdd0"/>'];shapes=[]
for i,d in enumerate(defs):
 cell=[(0,0),(1800,0),(1800,1800),(0,1800)]
 for j,p in enumerate(points):
  if i!=j and groups[i]==groups[j]:cell=clip(cell,points[i],p)
 land=Polygon(cell).intersection(coasts[groups[i]]);shapes.append(path(land,1800));terrain=d['habitats'].split(',')[0];p=path(land);s.append(f'<path d="{p}" fill="{colors[terrain]}" stroke="#9ba995" stroke-width="2"/>');cx,cy=points[i];random.seed(500+i)
 for j in range(24):
  xx=cx+random.randint(-125,125);yy=cy+random.randint(-120,120)
  if not land.contains(Point(xx,yy)):continue
  xx=round(xx/6)*6;yy=round(yy/6)*6
  if terrain in ['cliff','cave','stone','frost','ember']:
   c='#71877d' if terrain!='ember' else '#796f6e';s.append(f'<path d="M{xx-12} {yy+14}l12 -27 15 27z" fill="{c}"/><path d="M{xx-5} {yy-2}l5 -11 6 11z" fill="#e3e3d0"/>')
  elif terrain in ['tree','root','glade','web','town']:s.append(f'<rect x="{xx}" y="{yy+6}" width="4" height="12" fill="#7d8064"/><path d="M{xx-8} {yy+8}v-9h5v-7h10v7h6v9z" fill="#719378"/>')
  elif terrain in ['reef','ocean','marsh']:s.append(f'<path d="M{xx-8} {yy}h18m-12 5h18" stroke="#6d9e9f" stroke-width="3" fill="none"/>')
  elif terrain=='dune':s.append(f'<path d="M{xx-14} {yy+8}q12 -21 30 0" stroke="#c0a783" stroke-width="4" fill="none"/>')
  else:s.append(f'<path d="M{xx-4} {yy}l3 -7 2 8 4 -5" stroke="#91a276" stroke-width="2" fill="none"/>')
 s.append(f'<rect x="{cx-9}" y="{cy-9}" width="18" height="18" fill="#f0e4c5" stroke="#6e7969" stroke-width="2"/><path d="M{cx-12} {cy-9}l12 -11 12 11z" fill="#7e7b68"/>')
# Rivers descend through each continental basin to a coastal outlet.
for p in ['M460 120L420 270 480 420 400 620 440 850 370 1100 340 1350 300 1610','M1400 100L1370 280 1440 450 1320 650 1380 850 1430 1040']:
 s.append(f'<path d="{p}" stroke="#7da7a8" stroke-width="7" fill="none"/>')
for coast in coasts:s.append(f'<path d="{path(coast)}" stroke="#809f96" stroke-width="4" fill="none"/>')
s.append('</svg>');(r/'dist/assets/world-realms-v33.svg').write_text(''.join(s));edges=set()
for i in range(36):
 peers=sorted([j for j in range(36) if j!=i and groups[j]==groups[i]],key=lambda j:math.dist(points[i],points[j]))[:3]
 for j in peers:edges.add((min(i,j)+16,max(i,j)+16,'road'))
edges.update([(4,16,'ferry'),(15,34,'ferry'),(28,35,'ferry'),(33,46,'ferry')])
for i in range(30,35):edges.add((i+16,i+17,'ferry'))
geometry={'points':[[x+1800,y] for x,y in points],'shapes':shapes,'edges':sorted(edges)};(r/'content/realm-map-geometry.json').write_text(json.dumps(geometry,separators=(',',':'))+'\n');(r/'dist/realm-data.js').write_text("'use strict';\nconst REALM_EXPANSION="+json.dumps(defs,ensure_ascii=False,separators=(',',':'))+';\nconst REALM_MAP_GEOMETRY='+json.dumps(geometry,separators=(',',':'))+';\n')
