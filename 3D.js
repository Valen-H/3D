/**
 * REIMPLEMENT D3CONNECTGROUPs
*/


"use strict";

const P2 = Math.PI * 2;

function mod(n, m = 0, M) {
	[m, M] = [m, M].sort();
	let d = (M - m);
	return n < m ? (n + d) : (n > M ? (n - d) : n);
} //mod
function inherit(a, b) {
	for (let i in b) {
		a[i] = b[i];
	}
	return a;
} //inherit

class D3Map {
	constructor(d = 5) {
		this.surface = [0, 0, d]; //coordinates
		this.camera = [0, 0, -d]; //coordinates
		this.orientation = [0, 0, 0]; //angles
		this.vertices = [ ];
		this.Vertex = D3Map.Vertex;
		this.Cube = D3Map.Cube;
		this.RENDER_MODES = D3Map.RENDER_MODES;
	} //ctor
	
	get v0() {
		return new D3Vertex(0, 0, 0, this);
	} //g-v0
	get n() {
		let out = this.v0;
		out.z = -1;
		
		return out;
	} //g-n
	get field() {
		return 2 * Math.atan(1 / this.surface[2]);
	} //g-field
	
	rotate(x = -this.orientation[0], y = 0, z = 0) {
		this.orientation[0] = mod(this.orientation[0] + x, 0, P2);
		this.orientation[1] = mod(this.orientation[1] + y, 0, P2);
		this.orientation[2] = mod(this.orientation[2] + z, 0, P2);
		return this;
	} //rotate
	translate(x = -this.camera[0], y = 0, z = 0) {
		this.camera[0] += x;
		this.camera[1] += y;
		this.camera[2] += z;
		return this;
	} //translate
	display(x = 0, y = 0, z = this.surface[2]) {
		inherit(this.surface, [x, y, z]);
		return this;
	} //display
	reset() {
		this.orientation = [0, 0, 0];
		this.camera = [0, 0, 0];
		return this;
	} //reset
	
	add(...args) {
		if (args.every(arg => (arg instanceof (this.Vertex)))) {
			for (let arg of args) {
				this.add(arg.x, arg.y, arg.z);
			}
			return this;
		}
		let p = new (this.Vertex)(...args, this);
		this.vertices.push(p);
		return p;
	} //add
	
	segmentConnect(verticeArray = this.vertices, pen = document.getElementsByTagName("canvas")[0].getContext("2d")) {
		if (!((verticeArray instanceof Array) && verticeArray.every(vtex => (vtex instanceof (this.Vertex))))) {
			throw "ENOVERTEX";
		}
		
		for (let i = 0; i < verticeArray.length; i++) {
			if (i && verticeArray[i].coords[2] > 0) {
				pen.lineTo(...verticeArray[i].coord2d);
			} else if (!i && verticeArray[i].coords[2] >= 0) {
				pen.moveTo(...verticeArray[i].coord2d);
			} else {
				try {
					let chk = verticeArray[i].clip(verticeArray[i ? i - 1 : (i + 1)]).coord2d;
					if (Number.isNaN(chk[0]) || Number.isNaN(chk[1]) || !Number.isFinite(chk[0]) || !Number.isFinite(chk[1])) break;
					if (i) {
						pen.lineTo(...chk);
					} else {
						pen.moveTo(...chk);
					}
				} catch(r) {
					break;
				}
			}
		}
		
		return this;
	} //segmentConnect
} //D3Map

class D3Vertex {
	constructor(x, y, z, map) {
		if (x instanceof D3Vertex) {
			[x, y, z, map] = [x.x, x.y, x.z, x.map];
		}
		
		this.x = x;
		this.y = y;
		this.z = z;
		this.map = map;
		this._id = this.map.Vertex.idcnt++;
	} //ctor
	
	get coords() {
		let c1 = Math.cos(this.map.orientation[0]),
			c2 = Math.cos(this.map.orientation[1]),
			c3 = Math.cos(this.map.orientation[2]),
			s1 = Math.sin(this.map.orientation[0]),
			s2 = Math.sin(this.map.orientation[1]),
			s3 = Math.sin(this.map.orientation[2]),
			x = this.x - this.map.camera[0],
			y = this.y - this.map.camera[1],
			z = this.z - this.map.camera[2],
			s3y = s3 * y,
			s3x = s3 * x,
			c3x = c3 * x,
			c3y = c3 * y,
			s2z = s2 * z,
			c2z = c2 * z;
		
		return [
			c2 * (s3y + c3x) - s2z,
			s1 * (c2z + s2 * (s3y + c3x)) + c1 * (c3y - s3x),
			c1 * (c2z + s2 * (s3y + c3x)) - s1 * (c3y - s3x)
		];
	} //g-coords
	get scoords() {
		return new D3Vertex(...this.coords, this.map);
	} //g-scoords
	get coord2d() {
		let tmp = this.coords,
			p = this.map.surface[2] / tmp[2];
		
		return [
			p * tmp[0] + this.map.surface[0],
			p * tmp[1] + this.map.surface[1]
		];
	} //g-coord2d
	
	clip(p0) {
		if (!(p0 instanceof D3Vertex)) {
			throw "ENOVERTEX";
		}
		
		let s = this.map.v0.sub(p0).dot(this.map.n) / this.sub(p0).dot(this.map.n),
			pd = this.sub(p0);
		
		if (s < 0 || s > 1 || !this.map.n.dot(pd)) {
			throw "ENOINTERSCT";
		}
		
		return p0.add(pd.mult(s));
	} //clip
	
	add(p1) {
		if (!(p1 instanceof D3Vertex)) {
			throw "ENOVERTEX";
		}
		
		let p0 = new D3Vertex(this);
		p0.x += p1.x;
		p0.y += p1.y;
		p0.z += p1.z;
		
		return p0;
	} //add
	
	sub(p1) {
		if (!(p1 instanceof D3Vertex)) {
			throw "ENOVERTEX";
		}
		
		let p0 = new D3Vertex(this);
		p0.x -= p1.x;
		p0.y -= p1.y;
		p0.z -= p1.z;
		
		return p0;
	} //sub
	
	dot(p1) {
		if (!(p1 instanceof D3Vertex)) {
			throw "ENOVERTEX";
		}
		
		return this.x * p1.x + this.y * p1.y + this.z * p1.z;
	} //dot
	
	mult(num) {
		if (typeof num === "string" && /^[0-9]+$/.test(num)) {
			num = num * 1;
		} else if (typeof num === "number") {
			num = [num, num, num];
		} else if (!(num instanceof Array)) {
			throw "EINVALNUM";
		}
		
		let p0 = new D3Vertex(this);
		p0.x *= num[0];
		p0.y *= num[1];
		p0.z *= num[2];
		
		return p0;
	} //mult
} //D3Vertex

class D3Cube {
	constructor(points8, map6_4 = D3Cube.indicemap) {
		this.points = points8;
		this.indicemap = map6_4;
		this.trans = [0, 0, 0];
		this.middlew = () => { };
	} //ctor
	
	render(map = new D3Map, pen = document.getElementsByTagName("canvas")[0].getContext("2d"), mode = map.RENDER_MODES.BOTH) {
		pen.save();
		
		let pts = this.points.map(pt => new map.Vertex(pt.x + this.trans[0], pt.y + this.trans[1], pt.z + this.trans[2], map));
		
		for (let i of this.indicemap) {
			
			pen.beginPath();
			map.segmentConnect(i.map(idx => pts[idx]), pen);
			this.middlew();
			pen.closePath();
			
			if ((mode & (map.RENDER_MODES.STROKE)) == map.RENDER_MODES.STROKE) {
				pen.stroke();
			}
			if ((mode & (map.RENDER_MODES.FILL)) == map.RENDER_MODES.FILL) {
				pen.fill();
			}
		}
		
		pen.restore();
		
		return this;
	} //render
} //D3Cube

D3Cube.indicemap = [
		[0, 1, 2, 3], //FRONT
		[4, 5, 6, 7], //BACK
		[0, 1, 5, 4], //UP
		[3, 2, 6, 7], //DOWN
		[0, 4, 7, 3], //LEFT
		[1, 5, 6, 2] //RIGHT
	];
D3Vertex.idcnt = 0;
D3Map.Vertex = D3Vertex;
D3Map.Cube = D3Cube;
D3Map.RENDER_MODES = {
	FILL: 1,
	STROKE: 2,
	BOTH: 3
};

/*
	https://en.m.wikipedia.org/wiki/D3_projection
	
	Orthographic: coords.x  coords.y
	Perspective: coord2d.x  coord2d.y
*/
