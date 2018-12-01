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
		this.surface = [0, 0, d / 2]; //coordinates
		this.camera = [0, 0, -d / 2]; //coordinates
		this.orientation = [0, 0, 0]; //angles
		this.vertices = [ ];
		this.Vertex = D3Map.Vertex;
	} //ctor
	
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
	display(x = 0, y = 0, z = 5) {
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
} //D3Map

class D3Vertex {
	constructor(x, y, z, map) {
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
	get coord2d() {
		let tmp = this.coords,
			p = this.map.surface[2] / tmp[2];
		
		return [
			p * tmp[0] + this.map.surface[0],
			p * tmp[1] + this.map.surface[1]
		];
	} //g-coord2d
} //D2Vertex

D3Vertex.idcnt = 0;
D3Map.Vertex = D3Vertex;

/*
	https://en.m.wikipedia.org/wiki/D3_projection
	
	Orthographic: coords.x  coords.y
	Perspective: coord2d.x  coord2d.y
*/
