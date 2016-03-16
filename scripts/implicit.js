var Timer = function() {
	var me = this;
	me.start = 0;
	me.elapse = 0;
	me.reset = function() {
		me.start = time();
	};
	me.record = function() {
		me.elapse = time() - me.start;
	};
	
	function time() { 
		return (new Date()).getTime(); 
	};
};

var Point = function(x, y, lineTo) {
	me.x = x;
	me.y = y;
	me.lineTo = lineTo;

	me.equals = function(p) {
		return equal(me.x, p.x, 1e-10) && equal(me.y, p.y, 1e-10);
	};

	function equals(x, y, eps) {
		if(x === y) return true;
		return ((x - eps) < y) && (y < (x + eps));
	};
};

var PointList = function(start, end) {
	var me = this;
	me.start = start;
	me.end = end;
	me.start.lineTo = false;
	me.end.lineTo = true;
	me.points = [];

	me.merge = function(list) {
		me.points.push(me.end);
		list.start.lineTo = true;
		me.points.push(list.start);
		me.end = list.end;
		if(list.points.length == 0) return;
		me.points.concat(list.points);
	}

	me.push = function(point) {
		point.lineTo = true;
		me.points.push(me.end);
		me.end = point;
	};

	me.unshift = function(point) {
		point.lineTo = false;
		me.start.lineTo = true;
		me.points.unshift(me.start);
		me.start = point;
	};
};

var Rectangle = function(func) {
	var me = this;
	me.eval = [0, 0, 0, 0];
	me.rect = [0, 0, 0, 0];
	me.children = null;
	me.status = 0;
	me.singular = false;
	me.func = func;

	me.set = function(r) {
		for(var i = 0; i < 4; i++) {
			me.eval[i] = r.eval[i];
			me.rect[i] = r.rect[i];
		}
		me.singular = r.singular;
		me.status = r.status;
	};

	me.split = function() {
		if(me.children === null) {
			me.children = [];
			for(var i = 0; i < 4; i++) {
				me.children.push(new Rectangle());
			}
		}
		var r = me.children;
		var w2 = me.rect[2] * 0.5;
		var h2 = me.rect[3] * 0.5;
		for(var i = 0; i < 4; i++) {
			r[i].set(me);
			r[i].rect[2] = w2;
			r[i].rect[3] = h2;
		}
		r[1].rect[0] += w2;
		r[2].rect[0] += w2;
		r[2].rect[1] += h2;
		r[3].rect[1] += h2;
		r[0].eval[1] = me.func(r[1].rect[0], r[1].rect[1]);
		r[0].eval[2] = me.func(r[2].rect[0], r[2].rect[1]);
		r[0].eval[3] = me.func(r[3].rect[0], r[3].rect[1]);
		r[1].eval[2] = me.func(r[2].rect[0] + w2, r[2].rect[1]);
		r[2].eval[3] = me.func(r[2].rect[0], r[2].rect[1] + h2);
		r[1].eval[0] = r[0].eval[1];
		r[1].eval[3] = r[0].eval[2];
		r[2].eval[0] = r[0].eval[2];
		r[2].eval[1] = r[1].eval[2];
		r[3].eval[0] = r[0].eval[3];
		r[3].eval[1] = r[0].eval[2];
		r[3].eval[2] = r[2].eval[3];
		return rect;
	};

	me.x1 = function() {return me.rect[0]; };
	me.y1 = function() {return me.rect[1]; };
	me.x2 = function() {return me.rect[0] + me.rect[2]; };
	me.y2 = function() {return me.rect[1] + me.rect[3]; };
};

var Implicit = function(func, finish) {
	var me = this;
	var EMPTY = 0;
	var FINISH = -1;
	var T0000 = 0;
	var T0001 = 1;
	var T0010 = 2;
	var T0011 = 3;
	var T0100 = 4;
	var T0101 = 5;
	var T0110 = 6;
	var T0111 = 7;
	var T_INV = -1;
	var VALID = 1;

	me.func = func;
	me.finish = finish;
	me.grid = null;
	me.temp = null;
	me.plotDepth = 0;
	me.segmentCheckDepth = 0;
	me.openList = [];
	me.sw = 0;
	me.sh = 0;
	me.segments = [];

	function intersect(c1, c2) {
		return c1 * c2 <= 0 ? 1 : 0;
	}

	function config(r) {
		var cfg = (intersect(r.eval[0], r.eval[1]) << 3) |
			      (intersect(r.eval[1], r.eval[2]) << 2) |
			      (intersect(r.eval[2], r.eval[3]) << 1) |
			      (intersect(r.eval[3], r.eval[0]));
		if(cfg === 0 || cfg === 15) {
			return EMPTY;
		}
		return cfg;
	};

	function interpolate(fa, fb, p1, p2) {
		var r = -fb / (fa - fb);
		if (r >= 0 && r <= 1) {
			return r * (p1 - p2) + p2;
		}
		return (p1 + p2) * 0.5;
	};

	me.create = function(r) {
		var cfg = config(r);
		if(cfg === T_INV || cfg === T0101) {
			return cfg;
		}
		switch(cfg) {
			case T0001:

				break;
			case T0010:
				break;
			case T0100:
				break;
			case T0111:
				break;
			case T0011:
				break;
			case T0110:
				break;
			default:
				return EMPTY;
		}
		var p = Math.abs(me.func(pts[0].x, pts[0].y));
		var q = Math.abs(me.func(pts[1].x, pts[1].y));
		if((p <= p1) && (q <= q1)) {
			return VALID;
		}
		return EMPTY;
	};

	me.append = function(r) {
		var cfg = me.create(r);
		if(cfg === VALID) {
			if(pts[0].x > pts[1].x) {
				temp = pts[0];
				pts[0] = pts[1];
				pts[1] = temp;
			}
			var inx1 = -1;
			var inx2 = -1;

			for(var i = 0; i < openList.length; i++) {
				if(pts[1].equals(openList[i].start)) {
					inx1 = i;
					break;
				}
			}
			
			for(var i = 0; i < openList.length; i++) {
				if(pts[0].equals(openList[i].end)) {
					inx2 = i;
					break;
				}
			}

			if(inx1 !== -1 && inx2 !== -1) {
				openList[inx2].merge(openList[inx1]);
				openList.splice(inx1, 1);
			} else if(inx1 !== -1) {
				openList[inx1].unshift(pts[0]);
			} else if(inx2 !== -1) {
				openList[inx2].push(pts[1]);
			} else {
				openList.push(new PointList(pts[0], pts[1]));
			}
		}
		return cfg;
	};

	me.update = function(x1, y1, x2, y2, px, py) {
		me.finish(segments);
	};

	me.makeTree = function(r, d) {
		Rectangle children = r.split();
		me.plot(children[0], d);
		me.plot(children[1], d);
		me.plot(children[2], d);
		me.plot(children[3], d);
	};

	me.plot = function(r, d) {
		if(d < me.segmentCheckDepth) {
			me.makeTree(r, d + 1);
			return;
		}
		var cfg = me.config(r);
	};
 };
