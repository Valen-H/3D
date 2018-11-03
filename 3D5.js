"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var P2 = Math.PI * 2;

function mod(n) {
	var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	var M = arguments[2];

	var _sort = [m, M].sort();

	var _sort2 = _slicedToArray(_sort, 2);

	m = _sort2[0];
	M = _sort2[1];

	var d = M - m;
	return n < m ? n + d : n > M ? n - d : n;
} //mod
function inherit(a, b) {
	for (var i in b) {
		a[i] = b[i];
	}
	return a;
} //inherit
function perm(xs) {
	var ret = [];

	for (var i = 0; i < xs.length; i++) {
		var rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

		if (!rest.length) {
			ret.push([xs[i]]);
		} else {
			for (var j = 0; j < rest.length; j++) {
				ret.push([xs[i]].concat(rest[j]));
			}
		}
	}

	return ret;
} //perm

var D3Map = function () {
	function D3Map() {
		var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;

		_classCallCheck(this, D3Map);

		this.surface = [0, 0, d]; //coordinates
		this.camera = [0, 0, 0]; //coordinates
		this.orientation = [0, 0, 0]; //angles
		this.pointlist = [];
		this.groupings = new Map();
		this.Point = D3Map.Point;
		this.ConnectGroup = D3Map.ConnectGroup;
	} //ctor

	_createClass(D3Map, [{
		key: "rotate",
		value: function rotate() {
			var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -this.orientation[0];
			var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

			this.orientation[0] = mod(this.orientation[0] + x, 0, P2);
			this.orientation[1] = mod(this.orientation[1] + y, 0, P2);
			this.orientation[2] = mod(this.orientation[2] + z, 0, P2);
			return this;
		} //rotate

	}, {
		key: "translate",
		value: function translate() {
			var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -this.camera[0];
			var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

			this.camera[0] += x;
			this.camera[1] += y;
			this.camera[2] += z;
			return this;
		} //translate

	}, {
		key: "display",
		value: function display() {
			var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;

			inherit(this.surface, [x, y, z]);
			return this;
		} //display

	}, {
		key: "reset",
		value: function reset() {
			this.orientation = [0, 0, 0];
			this.camera = [0, 0, 0];
			return this;
		} //reset

	}, {
		key: "add",
		value: function add() {
			var _this = this;

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			if (args.every(function (arg) {
				return arg instanceof _this.Point;
			})) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var arg = _step.value;

						this.add(arg.x, arg.y, arg.z);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				return this;
			}
			var p = new (Function.prototype.bind.apply(this.Point, [null].concat(args, [this])))();
			this.pointlist.push(p);
			return p;
		} //add

	}, {
		key: "addGroup",
		value: function addGroup(name) {
			var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			var tmp = void 0;
			this.groupings.set(name, tmp = new this.ConnectGroup(this));
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = init[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var i = _step2.value;

					tmp.add(i, false);
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			tmp.process();
			return tmp;
		} //addGroup

	}, {
		key: "render",
		value: function render(ctx, group) {
			if (!group) {
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = this.groupings.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var g = _step3.value;

						g._render(ctx);
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}
			} else {
				this.groupings.get(group)._render(ctx);
			}
			return this;
		} //render

	}]);

	return D3Map;
}(); //D3Map

var D3Point = function () {
	function D3Point(x, y, z, map) {
		_classCallCheck(this, D3Point);

		this.x = x;
		this.y = y;
		this.z = z;
		this.map = map;
		this._id = this.map.Point.idcnt++;
	} //ctor

	_createClass(D3Point, [{
		key: "coords",
		get: function get() {
			var c1 = Math.cos(this.map.orientation[0]),
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

			return [c2 * (s3y + c3x) - s2z, s1 * (c2z + s2 * (s3y + c3x)) + c1 * (c3y - s3x), c1 * (c2z + s2 * (s3y + c3x)) - s1 * (c3y - s3x)];
		} //g-coords

	}, {
		key: "coord2d",
		get: function get() {
			var tmp = this.coords,
			    p = this.map.surface[2] / tmp[2];

			return [p * tmp[0] + this.map.surface[0], p * tmp[1] + this.map.surface[1]];
		} //g-coord2d

	}]);

	return D3Point;
}(); //D2Point

var D3ConnectGroup = function () {
	function D3ConnectGroup(map) {
		_classCallCheck(this, D3ConnectGroup);

		this.pointlist = [];
		this._processed = [];
		this.map = map;
		this.render = function (ctx) {
			return ctx.fill();
		};
	} //ctor

	_createClass(D3ConnectGroup, [{
		key: "add",
		value: function add(point) {
			var p = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			if (point instanceof this.map.Point && !this.pointlist.some(function (p) {
				return p._id == point._id;
			})) {
				this.pointlist.push(point);
			} else {
				var _map;

				this.pointlist.push(point = (_map = this.map).add.apply(_map, _toConsumableArray(point)));
			}
			p && this.process();

			return this;
		} //add

	}, {
		key: "process",
		value: function process() {
			return this._processed = perm(this.pointlist.map(function (p) {
				return p._id;
			}));
		} //process

	}, {
		key: "_render",
		value: function _render(ctx) {
			ctx.beginPath();
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this._processed[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var i = _step4.value;

					for (var j in i) {
						if (!j) {
							ctx.moveTo.apply(ctx, _toConsumableArray(this.pointlist[i[j]].coord2d));
						} else {
							ctx.lineTo.apply(ctx, _toConsumableArray(this.pointlist[i[j]].coord2d));
						}
					}
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			ctx.closePath();
			return this.render(ctx);
		} //_render

	}]);

	return D3ConnectGroup;
}(); //D3ConnectGroup

D3Point.idcnt = 0;
D3Map.Point = D3Point;
D3Map.ConnectGroup = D3ConnectGroup;

function D3test() {
	var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.getElementsByTagName("canvas")[0].getContext("2d");

	var map = new D3Map();
	map.addGroup("main", [[5, 5, 5], [10, -8, -1], [12, 7, 7]]);
	map.render(ctx);
	return map;
} //D3test

/*
	https://en.m.wikipedia.org/wiki/D3_projection
*/