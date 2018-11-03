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
function perm(xs) {
	let ret = [ ];
	
	for (let i = 0; i < xs.length; i++) {
		let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));
		
		if (!rest.length) {
			ret.push([xs[i]]);
		} else {
			for (let j = 0; j < rest.length; j++) {
				ret.push([xs[i]].concat(rest[j]));
			}
		}
	}
			
	return ret;
} //perm

class D3Map {
	constructor(d = 5) {
		this.surface = [0, 0, d]; //coordinates
		this.camera = [0, 0, 0]; //coordinates
		this.orientation = [0, 0, 0]; //angles
		this.pointlist = [ ];
		this.groupings = new Map();
		this.Point = D3Map.Point;
		this.ConnectGroup = D3Map.ConnectGroup;
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
		if (args.every(arg => (arg instanceof (this.Point)))) {
			for (let arg of args) {
				this.add(arg.x, arg.y, arg.z);
			}
			return this;
		}
		let p = new (this.Point)(...args, this);
		this.pointlist.push(p);
		return p;
	} //add
	addGroup(name, init = [ ]) {
		let tmp;
		this.groupings.set(name, tmp = new (this.ConnectGroup)(this));
		for (let i of init) {
			tmp.add(i, false);
		}
		tmp.process();
		return tmp;
	} //addGroup
	render(ctx, group) {
		if (!group) {
			for (let g of this.groupings.values()) {
				g._render(ctx);
			}
		} else {
			this.groupings.get(group)._render(ctx);
		}
		return this;
	} //render
} //D3Map

class D3Point {
	constructor(x, y, z, map) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.map = map;
		this._id = this.map.Point.idcnt++;
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
} //D2Point

class D3ConnectGroup {
	constructor(map) {
		this.pointlist = [ ];
		this._processed = [ ];
		this.map = map;
		this.render = ctx => ctx.fill();
	} //ctor
	
	add(point, p = true) {
		if ((point instanceof (this.map.Point)) && !this.pointlist.some(p => p._id == point._id)) {
			this.pointlist.push(point);
		} else {
			this.pointlist.push(point = this.map.add(...point));
		}
		p && this.process();
		
		return this;
	} //add
	process() {
		return this._processed = perm(this.pointlist.map(p => p._id));
	} //process
	_render(ctx) {
		ctx.beginPath();
		for (let i of this._processed) {
			for (let j in i) {
				if (!j) {
					ctx.moveTo(...(this.pointlist[i[j]].coord2d));
				} else {
					ctx.lineTo(...(this.pointlist[i[j]].coord2d));
				}
			}
		}
		ctx.closePath();
		return this.render(ctx);
	} //_render
} //D3ConnectGroup

D3Point.idcnt = 0;
D3Map.Point = D3Point;
D3Map.ConnectGroup = D3ConnectGroup;

function D3test(ctx = document.getElementsByTagName("canvas")[0].getContext("2d")) {
	let map = new D3Map();
	map.addGroup("main", [[5, 5, 5], [10, -8, -1], [12, 7, 7]]);
	map.render(ctx);
	return map;
} //D3test

/*
	https://en.m.wikipedia.org/wiki/D3_projection
*/
