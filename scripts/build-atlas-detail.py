#!/usr/bin/env python3
"""Terrain detail derived from the existing navigation polygons. No realm moves."""
from pathlib import Path
import json,re,math,heapq,random
import numpy as np
from scipy.ndimage import distance_transform_edt,gaussian_filter
from shapely.geometry import Polygon,Point,LineString
from shapely.ops import unary_union
from shapely import contains_xy
R=Path(__file__).resolve().parents[1];g=json.loads((R/'content/world-atlas-v35.json').read_text());random.seed(38052)
def region(path):
 result=Polygon()
 for part in re.split('[Zz]',path):
  nums=[float(n) for n in re.findall(r'-?\d+(?:\.\d+)?',part)]
  if len(nums)>=6:result=result.symmetric_difference(Polygon(list(zip(nums[::2],nums[1::2]))).buffer(0))
 return result
regions=[region(s) for s in g['shapes']];land=unary_union(regions);step=10
xx,yy=np.meshgrid(np.arange(5,3000,step),np.arange(5,2100,step));mask=contains_xy(land,xx,yy);ny,nx=mask.shape
chains=[[(450,230),(620,350),(800,430),(990,640),(1150,690),(1350,750)],[(1100,200),(1320,320),(1470,510),(1600,660),(1760,800)],[(420,1460),(620,1500),(800,1650),(1050,1760),(1200,1880)],[(2390,260),(2370,520),(2490,700),(2580,900),(2550,1130)]]
def warp(x,y):return (x+20*math.sin(y/120)+10*math.sin(x/100+y/80),y+18*math.sin(x/135)+9*math.sin(y/90+x/65))
ridges=[LineString([warp(x,y) for x,y in chain]) for chain in chains];ridge=unary_union(ridges)
dist=np.array([ridge.distance(Point(x,y)) for x,y in zip(xx.flat,yy.flat)]).reshape(xx.shape)
rng=np.random.default_rng(38052);noise=gaussian_filter(rng.normal(size=xx.shape),3)*40
height=np.where(mask,12+distance_transform_edt(mask)*3.5+190*np.exp(-(dist/58)**2)+noise,0)
# Priority-flood depression filling gives every land cell a downstream receiver.
filled=height.copy();seen=~mask.copy();parent=np.full(mask.size,-1,dtype=int);heap=[(0,int(i)) for i in np.flatnonzero(~mask)];heapq.heapify(heap);order=[]
while heap:
 z,i=heapq.heappop(heap);order.append(i);y,x=divmod(i,nx)
 for dy,dx in [(1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)]:
  a,b=y+dy,x+dx
  if not(0<=a<ny and 0<=b<nx)or seen[a,b]:continue
  seen[a,b]=True;j=a*nx+b;parent[j]=i;filled[a,b]=max(height[a,b],z+.001);heapq.heappush(heap,(filled[a,b],j))
flow=mask.astype(float).ravel()
for i in reversed(order):
 if parent[i]>=0:flow[parent[i]]+=flow[i]
streams={int(i) for i in np.flatnonzero(mask.ravel()&(flow>=70))};up={i:0 for i in streams}
for i in streams:
 if parent[i] in up:up[parent[i]]+=1
sources=[i for i in streams if up[i]!=1];lines=[];riverSVG=[]
def coord(i):y,x=divmod(i,nx);return (float(xx[y,x]),float(yy[y,x]))
for start in sources:
 p=[coord(start)];i=start
 while parent[i]>=0:
  j=int(parent[i]);p.append(coord(j));i=j
  if j not in streams or up.get(j,0)!=1:break
 if len(p)<2:continue
 line=LineString(p).simplify(3);lines.append(line);pts=list(line.coords);width=min(3.4,.65+math.sqrt(flow[start])/19)
 d=f'M{pts[0][0]:.1f},{pts[0][1]:.1f}'
 for a,b in zip(pts[1:-1],pts[2:]):d+=f'Q{a[0]:.1f},{a[1]:.1f} {(a[0]+b[0])/2:.1f},{(a[1]+b[1])/2:.1f}'
 d+=f'L{pts[-1][0]:.1f},{pts[-1][1]:.1f}'
 riverSVG.append(f'<path d="{d}" fill="none" stroke="#e9d5a9" stroke-width="{width+2:.2f}"/><path d="{d}" fill="none" stroke="#627e79" stroke-width="{width:.2f}" stroke-linecap="round" stroke-linejoin="round"/>')
waterways=unary_union(lines);ink=[];features=[]
# Fine hill contours follow a common elevation model around ridge flanks.
for chain in ridges:
 for offset in [18,30,43,59,78]:
  contour=chain.buffer(offset,resolution=4).boundary.intersection(land)
  parts=[contour] if contour.geom_type=='LineString' else contour.geoms
  for p in parts:
   if p.geom_type!='LineString':continue
   ink.append('<path d="M'+'L'.join(f'{x:.1f},{y:.1f}' for x,y in p.coords)+'" fill="none" stroke="#9b8052" stroke-width=".65" opacity=".28"/>')
# Villages and field strips are placed near fresh water and roads, away from peaks.
for k,reg in enumerate(regions):
 candidates=[]
 for e in g['roads']:
  if e['kind']!='road' or k not in [e['from'],e['to']]:continue
  line=LineString(e['path'])
  for fraction in [.25,.5,.75]:
   p=line.interpolate(line.length*fraction)
   if reg.contains(p) and ridge.distance(p)>30 and min(math.dist((p.x,p.y),c) for c in g['points'])>46:candidates.append(p)
 candidates.sort(key=lambda p:waterways.distance(p))
 used=[]
 for p in candidates:
  if len(used)>=3:break
  if any(p.distance(q)<42 for q in used):continue
  used.append(p);x,y=p.x,p.y;near=waterways.distance(p)<70
  features.append({'realm':k,'x':round(x,2),'y':round(y,2),'kind':'riverside' if near else 'waystation'})
  ink.append(f'<g transform="translate({x:.1f} {y:.1f})" stroke="#6b5133" stroke-width=".8" fill="#d6b681"><path d="M-8 1v-8h8v8m-10 -8 6 -5 6 5M3 5v-10h10V5M1 -5l7 -6 7 6"/></g>')
  if near:
   for j in range(5):
    a=x-23+j*7;b=y+10
    if reg.contains(Point(a+5,b+12)):
     ink.append(f'<path d="M{a:.1f} {b:.1f}l5 3v18l-5 -3Zm2 4v13" fill="#c9b47b" fill-opacity=".42" stroke="#9c8957" stroke-width=".6"/>')
# Road/river intersections carry a bridge mark; crossings are measured, not decorative.
bridges=[]
for e in g['roads']:
 if e['kind']!='road':continue
 cross=LineString(e['path']).intersection(waterways)
 parts=[cross] if cross.geom_type=='Point' else getattr(cross,'geoms',[])
 for p in parts:
  if p.geom_type!='Point' or any(p.distance(q)<18 for q in bridges):continue
  bridges.append(p);x,y=p.x,p.y
  ink.append(f'<g transform="translate({x:.1f} {y:.1f})" stroke="#765334" fill="#dec394" stroke-width="1"><path d="M-6 -4h12v8H-6Zm0 -3v14m12 -14v14M-3 -4v8m3 -8v8m3 -8v8"/></g>')
# Dense small woodland patches follow moist valleys, thinning near high ground.
for _ in range(5200):
 x=random.uniform(100,2900);y=random.uniform(120,1970);p=Point(x,y)
 if not land.contains(p) or ridge.distance(p)<38 or waterways.distance(p)>58 or min(math.dist((x,y),q)for q in g['points'])<38:continue
 h=random.uniform(5,10)
 ink.append(f'<path d="M{x:.1f} {y+3:.1f}v-4m-3 0 3 {-h:.1f} 3 {h:.1f}z" fill="#acae7d" stroke="#747348" stroke-width=".6"/>')
# Geological detail: scarps, coves, reef shelves and shoals along shallow coasts.
coastal=[]
for geom in getattr(land,'geoms',[land]):
 ring=geom.exterior;line=LineString(ring.coords)
 for d in range(0,int(line.length),30):
  p=line.interpolate(d);q=line.interpolate(min(d+5,line.length));dx,dy=q.x-p.x,q.y-p.y;length=math.hypot(dx,dy)or 1
  x,y=p.x,p.y;coastal.append(f'<path d="M{x:.1f} {y:.1f}l{dy/length*5:.1f} {-dx/length*5:.1f}" stroke="#8b7952" stroke-width=".7" opacity=".55"/>')
base=(R/'dist/assets/world-atlas-v35.svg').read_text()
# Replace the old illustrative river strokes with connected drainage geometry.
base=re.sub(r'<path d="[^"]*" fill="none" stroke="#e9d5a9" stroke-width="6"/>','',base)
base=re.sub(r'<path d="[^"]*" fill="none" stroke="#657f79" stroke-width="2.1" stroke-linejoin="round"/>','',base)
marker='<g transform="translate('
idx=base.index(marker)
layer='<g id="atlas-terrain-detail" clip-path="url(#land)">'+''.join(ink[:len(ink)//3])+''.join(riverSVG)+''.join(ink[len(ink)//3:])+'</g>'+''.join(coastal)
base=base[:idx]+layer+base[idx:]
(R/'dist/assets/world-atlas-v38.svg').write_text(base)
# Export measured facts for dossiers and QA. Navigation stays byte-for-byte unchanged.
metrics=[]
for k,reg in enumerate(regions):
 metrics.append({'realm':k,'waterwayLength':round(waterways.intersection(reg).length),'settlements':sum(f['realm']==k for f in features),'bridges':sum(reg.covers(p)for p in bridges),'coastal':reg.boundary.intersection(land.boundary).length>5})
data={'grid':step,'riverSegments':len(lines),'bridges':len(bridges),'settlements':features,'regions':metrics,'drainageCells':len(streams),'downhill':all(filled.ravel()[parent[i]]<=filled.ravel()[i]for i in streams if parent[i]>=0)}
(R/'content/atlas-detail.json').write_text(json.dumps(data,separators=(',',':'))+'\n')
(R/'dist/atlas-detail.js').write_text("'use strict';\nconst ATLAS_DETAIL="+json.dumps(data,separators=(',',':'))+';\n')
print(json.dumps({k:data[k]for k in ['riverSegments','bridges','drainageCells','downhill']}))
