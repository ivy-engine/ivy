import{$ as c,V as a}from"./vendor.cc2cfa35.js";const o=new c,u=new a;class l{constructor(e){let i=e.geometry;if(!i.isBufferGeometry||i.attributes.position.itemSize!==3)throw new Error("THREE.MeshSurfaceSampler: Requires BufferGeometry triangle mesh.");i.index&&(console.warn("THREE.MeshSurfaceSampler: Converting geometry to non-indexed BufferGeometry."),i=i.toNonIndexed()),this.geometry=i,this.randomFunction=Math.random,this.positionAttribute=this.geometry.getAttribute("position"),this.colorAttribute=this.geometry.getAttribute("color"),this.weightAttribute=null,this.distribution=null}setWeightAttribute(e){return this.weightAttribute=e?this.geometry.getAttribute(e):null,this}build(){const e=this.positionAttribute,i=this.weightAttribute,n=new Float32Array(e.count/3);for(let t=0;t<e.count;t+=3){let r=1;i&&(r=i.getX(t)+i.getX(t+1)+i.getX(t+2)),o.a.fromBufferAttribute(e,t),o.b.fromBufferAttribute(e,t+1),o.c.fromBufferAttribute(e,t+2),r*=o.getArea(),n[t/3]=r}this.distribution=new Float32Array(e.count/3);let s=0;for(let t=0;t<n.length;t++)s+=n[t],this.distribution[t]=s;return this}setRandomGenerator(e){return this.randomFunction=e,this}sample(e,i,n){const s=this.distribution[this.distribution.length-1],t=this.binarySearch(this.randomFunction()*s);return this.sampleFace(t,e,i,n)}binarySearch(e){const i=this.distribution;let n=0,s=i.length-1,t=-1;for(;n<=s;){const r=Math.ceil((n+s)/2);if(r===0||i[r-1]<=e&&i[r]>e){t=r;break}else e<i[r]?s=r-1:n=r+1}return t}sampleFace(e,i,n,s){let t=this.randomFunction(),r=this.randomFunction();return t+r>1&&(t=1-t,r=1-r),o.a.fromBufferAttribute(this.positionAttribute,e*3),o.b.fromBufferAttribute(this.positionAttribute,e*3+1),o.c.fromBufferAttribute(this.positionAttribute,e*3+2),i.set(0,0,0).addScaledVector(o.a,t).addScaledVector(o.b,r).addScaledVector(o.c,1-(t+r)),n!==void 0&&o.getNormal(n),s!==void 0&&this.colorAttribute!==void 0&&(o.a.fromBufferAttribute(this.colorAttribute,e*3),o.b.fromBufferAttribute(this.colorAttribute,e*3+1),o.c.fromBufferAttribute(this.colorAttribute,e*3+2),u.set(0,0,0).addScaledVector(o.a,t).addScaledVector(o.b,r).addScaledVector(o.c,1-(t+r)),s.r=u.x,s.g=u.y,s.b=u.z),this}}export{l as M};
