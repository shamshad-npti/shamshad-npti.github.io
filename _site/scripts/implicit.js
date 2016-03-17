"use strict"

var Timer = function() {
	var me = this;
	me.start = 0, me.elapse = 0;
	me.reset = function() { me.start = time(); };
	me.record = function() { me.elapse = time() - me.start; };
	function time() { return (new Date()).getTime(); };
};

var LinkedList = function() {
  var Node = function(elem, next, prev) {
    this.elem = elem, this.next = next, this.prev = prev;
  };
  var me = this;
  me.head = new Node(null, null, null);
  me.head.next = me.head.prev = me.head;
  me.shift = function() {
    detach(me.head.next);
  };
  
  me.pop = function() {
    detach(me.head.prev);
  };
  
  me.push = function(e) {
    var node = new Node(e, me.head, me.head.prev);
    me.head.prev.next = node;
    me.head.prev = node;
  };

  me.unshift = function(e) {
    var node = new Node(e, me.head.next, me.head);
    me.head.next.prev = node;
    me.head.next = node;
  };
  
  me.merge = function(list) {
    if(list.isEmpty()) return;
    me.head.prev.next = list.head.next;
    list.head.next.prev = me.head.prev;
    list.head.prev.next = me.head;
    me.head.prev = list.head.prev;
    list.destroy();
  }

  me.isEmpty = function() {
    return me.head === me.head.next;
  };

  me.destroy = function() {
    me.head = new Node(null, null, null);
  }

  me.toArray = function() {
    var node = me.head.next;
    var array = [];
    while(node != me.head) {
      array.push(node.elem);
      node = node.next;
    }
    return array;
  }

  me.remove = function(current) {
    if(current instanceof Node) detach(current);
  }

  me.forEach = function(callback) {
    var current = me.head.next, next;
    while(current !== me.head) {
      next = current.next;
      callback(current.elem, current);
      current = next;
    }
  }

  function detach(node) {
    node.next.prev = node.prev;
    node.prev.next = node.next;
    node.next = node.prev = null;
    node.elem = null;
  }

};

var Point = function(x, y, lineTo) {
  var me = this; 
  me.x = x, me.y = y, me.lineTo = lineTo;

	me.equals = function(p) {
		return equals(me.x, p.x, 1e-6) && equals(me.y, p.y, 1e-6);
	};

	function equals(x, y, eps) {
		if(x === y) return true;
		return ((x - eps) < y) && (y < (x + eps));
	};
};

var PointList = function(start, end) {
	var me = this;
	me.start = start, me.end = end;
	me.start.lineTo = false, me.end.lineTo = true;
	me.points = new LinkedList();

	me.merge = function(list) {
		me.points.push(me.end);
		list.start.lineTo = true;
		me.points.push(list.start);
		me.end = list.end;
		if(list.points.length == 0) return;
		me.points.merge(list.points);
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
	me.eval = [0, 0, 0, 0], me.rect = [0, 0, 0, 0];
  me.x = 0, me.y = 0, me.children = null, me.status = 0;
	me.singular = false, me.func = func;

	me.copy = function(r) {
		for(var i = 0; i < 4; i++) {
			me.eval[i] = r.eval[i];
			me.rect[i] = r.rect[i];
		}
    me.x = r.x, me.y = r.y;
		me.singular = r.singular;
		me.status = r.status;
	};

  me.set = function(x, y, fx, fy, singular) {
    me.x = x, me.y = y, me.rect[2] = fx, me.rect[3] = fy;
    me.singular = singular;
  };

	me.split = function() {
		if(me.children === null) {
			me.children = [];
			for(var i = 0; i < 4; i++) {
				me.children.push(new Rectangle(me.func));
			}
		}
		var r = me.children;
		var w2 = me.rect[2] * 0.5;
		var h2 = me.rect[3] * 0.5;
		for(var i = 0; i < 4; i++) {
			r[i].copy(me);
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
		return r;
	};

	me.x1 = function() {return me.rect[0]; };
	me.y1 = function() {return me.rect[1]; };
	me.x2 = function() {return me.rect[0] + me.rect[2]; };
	me.y2 = function() {return me.rect[1] + me.rect[3]; };
};

var Implicit = function(func, finish) {
	var me = this;
	var EMPTY = 0, FINISHED = -1, T_INV = -1, VALID = 1;
	var T0000 = 0, T0001 = 1, T0010 = 2, T0011 = 3;
	var T0100 = 4, T0101 = 5, T0110 = 6, T0111 = 7;
  var LIST_THRESHOLD = 16, MAX_SPLIT = 40, RES_COARSE = 8;
  var timer = new Timer(), MAX_DEPTH = 5;

	me.func = func, me.finish = finish, me.grid = null;
	me.temp = null, me.plotDepth = 0, me.segmentCheckDepth = 0;
	me.openList = [], me.segments = [];
	me.sw = 0, me.sh = 0, me.pts = [null, null];

	function intersect(c1, c2) {
		return c1 * c2 <= 0 ? 1 : 0;
	}

	function edgeConfig(r) {
		var cfg = (intersect(r.eval[0], r.eval[1]) << 3) |
			      (intersect(r.eval[1], r.eval[2]) << 2) |
			      (intersect(r.eval[2], r.eval[3]) << 1) |
			      (intersect(r.eval[3], r.eval[0]));
		if(cfg === 0 || cfg === 15) { return EMPTY; }
		return cfg;
	};

  function config(r) {
    var cfg = 0;
    for(var i = 0; i < 4; i++) {
      cfg = (cfg << 1) | sign(r.eval[i]);
    }
    return cfg >= 8 ? (~cfg) & 0xf : cfg;
  }

  function sign(v) {
    if((!isFinite(v)) || isNaN(v)) return T_INV;
    return v >= 0.0 ? 1 : 0;
  }

	function interpolate(fa, fb, p1, p2) {
		var r = -fb / (fa - fb);
		if (r >= 0 && r <= 1) { return r * (p1 - p2) + p2; }
		return (p1 + p2) * 0.5;
	};

  me.abortList = function() {
    for(var i = 0; i < me.openList.length; i++) {
      me.segments.push(me.openList[i].start);
      me.segments = me.segments.concat(me.openList[i].points.toArray());
      me.segments.push(me.openList[i].end);
    }
    me.openList = [];
  };

	me.create = function(r, d) {
		var cfg = config(r);
		if(cfg === T_INV || (cfg === T0101 && !d)) { return cfg; }
    var x1 = r.x1(), x2 = r.x2(), y1 = r.y1(), y2 = r.y2();
    var tl = r.eval[0], tr = r.eval[1], br = r.eval[2], bl = r.eval[3];
    var q1 = 0, q2 = 0;
		switch(cfg) {
			case T0001:
        me.pts[0] = new Point(x1, interpolate(bl, tl, y2, y1), false);
        me.pts[1] = new Point(interpolate(bl, br, x1, x2), y2, true);
        q1 = Math.min(Math.abs(bl), Math.abs(tl));
        q2 = Math.min(Math.abs(bl), Math.abs(br));        
				break;
			case T0010:
        me.pts[0] = new Point(x2, interpolate(br, tr, y2, y1), false);
        me.pts[1] = new Point(interpolate(br, bl, x2, x1), y2, true);
        q1 = Math.min(Math.abs(br), Math.abs(tr));
        q2 = Math.min(Math.abs(br), Math.abs(bl));
				break;
			case T0100:
        me.pts[0] = new Point(x2, interpolate(tr, br, y1, y2), false);
        me.pts[1] = new Point(interpolate(tr, tl, x2, x1), y1, true);
        q1 = Math.min(Math.abs(tr), Math.abs(br));
        q2 = Math.min(Math.abs(tr), Math.abs(tl));
				break;
			case T0111:
        me.pts[0] = new Point(x1, interpolate(tl, bl, y1, y2), false);
        me.pts[1] = new Point(interpolate(tl, tr, x1, x2), y1, true);
        q1 = Math.min(Math.abs(bl), Math.abs(tl));
        q2 = Math.min(Math.abs(tl), Math.abs(tr));
				break;
			case T0011:
        me.pts[0] = new Point(x1, interpolate(tl, bl, y1, y2), false);
        me.pts[1] = new Point(x2, interpolate(tr, br, y1, y2), true);
        q1 = Math.min(Math.abs(tl), Math.abs(bl));
        q2 = Math.min(Math.abs(tr), Math.abs(br));
				break;
			case T0110:
        me.pts[0] = new Point(interpolate(tl, tr, x1, x2), y1, false);
        me.pts[1] = new Point(interpolate(bl, br, x1, x2), y2, true);
        q1 = Math.min(Math.abs(tl), Math.abs(tr));
        q2 = Math.min(Math.abs(bl), Math.abs(br));
				break;
			default:
				return EMPTY;
		}
		var p = Math.abs(me.func(me.pts[0].x, me.pts[0].y));
		var q = Math.abs(me.func(me.pts[1].x, me.pts[1].y));
		if((p <= q1) && (q <= q2)) {
			return VALID;
		}
		return EMPTY;
	};

	me.append = function(r, d) {
		var cfg = me.create(r, d);
		if(cfg === VALID) {
			if(me.pts[0].x > me.pts[1].x) {
				var temp = me.pts[0]; me.pts[0] = me.pts[1]; me.pts[1] = temp;
			}
			var inx1 = -1, inx2 = -1;

			for(var i = 0; i < me.openList.length; i++) {
				if(me.pts[1].equals(me.openList[i].start)) {
					inx1 = i; 
          break;
				}
			}
			
			for(var i = 0; i < me.openList.length; i++) {
				if(me.pts[0].equals(me.openList[i].end)) {
					inx2 = i;
					break;
				}
			}

			if(inx1 !== -1 && inx2 !== -1) {
				me.openList[inx2].merge(me.openList[inx1]);
				me.openList.splice(inx1, 1);
			} else if(inx1 !== -1) {
				me.openList[inx1].unshift(me.pts[0]);
			} else if(inx2 !== -1) {
				me.openList[inx2].push(me.pts[1]);
			} else {
				me.openList.push(new PointList(me.pts[0], me.pts[1]));
			}
      if(me.openList.length > LIST_THRESHOLD) {
        me.abortList();
      }
		}
		return cfg;
	};

	me.update = function(x1, y1, x2, y2, px, py) {
    x1 -= 0.25 * Math.PI / px;
    me.sw = Math.min(MAX_SPLIT, Math.floor(px / RES_COARSE));
    me.sh = Math.min(MAX_SPLIT, Math.floor(py / RES_COARSE));
    if (me.sw == 0 || me.sh == 0) { return; }
    if (me.grid === null || me.grid.length !== me.sh || me.grid[0].length !== me.sw) {
      me.grid = [];
      for (var i = 0; i < me.sh; i++) {
        var col = [];
        for (var j = 0; j < me.sw; j++) {
          col.push(new Rectangle(me.func));
        }
        me.grid.push(col);
      }
    }
    
    if(me.temp === null) {
      me.temp = new Rectangle(me.func);
    }

    var w = x2 - x1, h = y2 - y1, cur, prev;
    var frx = w / me.sw, fry = h / me.sh;

    var vertices = [], xcoords = [], ycoords = [];

    for (var i = 0; i <= me.sw; i++) {
      xcoords.push(x1 + i * frx);
    }

    for (var i = 0; i <= me.sh; i++) {
      ycoords.push(y1 + i * fry)
    }

    for (var i = 0; i <= me.sw; i++) {
      vertices.push(me.func(xcoords[i], ycoords[0]));
    }
    timer.reset();
    var i, j, dx, dy, fx, fy;

    for (i = 1; i <= me.sh; i++) {
      prev = me.func(xcoords[0], ycoords[i]);
      fy = ycoords[i] - 0.5 * fry;
      for (j = 1; j <= me.sw; j++) {
        cur = me.func(xcoords[j], ycoords[i]);
        var rect = me.grid[i - 1][j - 1];
        rect.set(j - 1, i - 1, frx, fry, false);
        rect.rect[0] = xcoords[j - 1];
        rect.rect[1] = ycoords[i - 1];
        rect.eval[0] = vertices[j - 1];
        rect.eval[1] = vertices[j];
        rect.eval[2] = cur;
        rect.eval[3] = prev;
        rect.status = config(rect);
        vertices[j - 1] = prev;
        prev = cur;
      }
      vertices[me.sw] = prev;
    }

    timer.record();

    if (timer.elapse <= 10) {
      // Fast device optimize for UX
      me.plotDepth = 3;
      me.segmentCheckDepth = 2;
      LIST_THRESHOLD = 48;
    } else {
      // Slow device detected reduce parameters
      me.plotDepth = 2;
      me.segmentCheckDepth = 1;
      LIST_THRESHOLD = 24;
    }

    for (i = 0; i < me.sh; i++) {
      for (j = 0; j < me.sw; j++) {
        if (!me.grid[i][j].singular && me.grid[i][j].status != EMPTY) {
          me.temp.copy(me.grid[i][j]);
          me.plot(me.temp, 0);
          me.grid[i][j].status = FINISHED;
        }
      }
    }

    timer.record();

    if (timer.elapse >= 500) {
      // I can't do anything more. I've been working for 500 ms
      // Therefore I am tired
      return;
    } else if (timer.elapse >= 300) {
      // I am exhausted, reducing load!
      me.plotDepth -= 1;
      me.segmentCheckDepth -= 1;
    }

    for (var k = 0; k < 4; k++) {
      for (i = 0; i < me.sh; i++) {
        for (j = 0; j < me.sw; j++) {
          if (me.grid[i][j].singular
              && me.grid[i][j].status != FINISHED) {
            me.temp.copy(grid[i][j]);
            me.plot(temp, 0);
            me.grid[i][j].status = FINISHED;
          }
        }
      }
    }
    me.abortList();
		me.finish(me.segments);
	};

	me.makeTree = function(r, d) {
		var children = r.split();
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
		var cfg = edgeConfig(r);
    if(cfg !== EMPTY) {
      if(d >= me.plotDepth) {
        if(me.append(r, d === MAX_DEPTH) === T0101 && d < MAX_DEPTH) {
          me.makeTree(r, d + 1);
        }
      } else {
        me.makeTree(r, d + 1);
      }
    }
	};
 };

 var CanvasPlotter = function(canvas, func) {
  var me = this;
  me.canvas = canvas;
  me.x1 = -10;
  me.x2 = 10;
  me.y1 = -10;
  me.y2 = 10;
  me.func = func;
  me.ctx = canvas.getContext("2d");
  me.color = "green";
  me.axisColor = "#0cc";
  me.gridColor = "#444";
  me.clearColor = "black";
  me.px = 300;
  me.py = 300;
  me.tx = 0;
  me.ty = 0;
  me.isdown = false;
  me.mouseX = 0;
  me.mouseY = 0;
  me.timer = new Timer();
  me.mousedown = function(evt) {
    if(evt.button != 0) return;
    var bRect = me.canvas.getBoundingClientRect();
    me.mouseX = (evt.clientX - bRect.left)*(me.canvas.width/bRect.width);
    me.mouseY = (evt.clientY - bRect.top)*(me.canvas.height/bRect.height);
    me.isdown = true;
    me.timer.reset();
  };

  me.mousemove = function(evt) { 
    if(!me.isdown) return;
    var bRect = me.canvas.getBoundingClientRect();
    var mx = (evt.clientX - bRect.left)*(me.canvas.width/bRect.width);
    var my = (evt.clientY - bRect.top)*(me.canvas.height/bRect.height);
    var dx = mx - me.mouseX;
    var dy = my - me.mouseY;
    me.mouseX = mx;
    me.mouseY = my;
    dx /= me.tx;
    dy /= me.ty;
    me.x1 -= dx; me.x2 -= dx; me.y1 += dy; me.y2 += dy;
    me.canvas.style = "cursor: move";
    me.update();
  };

  me.mouseup = function(evt) {
    if(!me.isdown) return;
    var bRect = me.canvas.getBoundingClientRect();
    var mx = (evt.clientX - bRect.left)*(me.canvas.width/bRect.width);
    var my = (evt.clientY - bRect.top)*(me.canvas.height/bRect.height);
    mx -= me.mouseX;
    my -= me.mouseY;
    mx /= me.tx;
    my /= me.ty;
    me.x1 -= mx; me.x2 -= mx; me.y1 += my; me.y2 += my;
    me.isdown = false;
    me.canvas.style = "cursor: default";
    me.update();
  }

  function transform(p) {
    p.x = me.tx * (p.x - me.x1);
    p.y = me.ty * (me.y2 - p.y);
  }

  function beforeplot() {
    me.ctx.beginPath();
    me.ctx.rect(0, 0, me.px, me.py);
    me.ctx.fillStyle = me.clearColor;
    me.ctx.fill();
    me.ctx.beginPath();
    var p = new Point(0, me.y1, false);
    transform(p);
    me.ctx.moveTo(p.x, p.y);
    p.x = 0, p.y = me.y2;
    transform(p);
    me.ctx.lineTo(p.x, p.y);
    p.x = me.x1, p.y = 0;
    transform(p);
    me.ctx.moveTo(p.x, p.y);
    p.x = me.x2, p.y = 0;
    transform(p);
    me.ctx.lineTo(p.x, p.y);
    me.ctx.lineWidth = 0.5;
    me.ctx.strokeStyle = me.axisColor;
    me.ctx.stroke();
    me.ctx.beginPath();
    var dx = (me.x2 - me.x1) / 10;
    var dy = (me.y2 - me.y1) / 10;
    for(var i = 1; ; i++) {
      p.x = i * dx;
      if(p.x >= me.x2) break;
      p.y = me.y1;
      transform(p);
      me.ctx.moveTo(p.x, p.y);
      p.x = i * dx;
      p.y = me.y2;
      transform(p);
      me.ctx.lineTo(p.x, p.y);
    }
    for(var i = -1; ; i--) {
      p.x = i * dx;
      if(p.x <= me.x1) break;
      p.y = me.y1;
      transform(p);
      me.ctx.moveTo(p.x, p.y);
      p.x = i * dx;
      p.y = me.y2;
      transform(p);
      me.ctx.lineTo(p.x, p.y);      
    }
    for(var i = 1; ; i++) {
      p.y = i * dy;
      if(p.y >= me.y2) break;
      p.x = me.x1;
      transform(p);
      me.ctx.moveTo(p.x, p.y);
      p.y = i * dy;
      p.x = me.x2;
      transform(p);
      me.ctx.lineTo(p.x, p.y);      
    }
    for(var i = -1; ; i--) {
      p.y = i * dy;
      if(p.y <= me.y1) break;
      p.x = me.x1;
      transform(p);
      me.ctx.moveTo(p.x, p.y);
      p.y = i * dy;
      p.x = me.x2;
      transform(p);
      me.ctx.lineTo(p.x, p.y);      
    }
    me.ctx.lineWidth = 0.5;
    me.ctx.strokeStyle = me.gridColor;
    me.ctx.stroke();
  }

  me.finish = function(segments) {
    beforeplot();
    me.ctx.beginPath();
    for(var i = 0; i < segments.length; i++) {
      transform(segments[i]);
      if(segments[i].lineTo) {
        me.ctx.lineTo(segments[i].x, segments[i].y);
      } else {
        me.ctx.moveTo(segments[i].x, segments[i].y);        
      }
    }
    me.ctx.strokeStyle = me.color;
    me.ctx.lineWidth = 2;
    me.ctx.stroke();
  }

  me.update = function() {
    me.px = canvas.scrollWidth;
    me.py = canvas.scrollHeight;
    me.tx = me.px / (me.x2 - me.x1);
    me.ty = me.py / (me.y2 - me.y1);
    me.plot = new Implicit(me.func, me.finish);
    me.plot.update(me.x1, me.y1, me.x2, me.y2, me.px, me.py);
  }
  me.canvas.addEventListener("mousedown", me.mousedown, false);
  me.canvas.addEventListener("mouseup", me.mouseup, false);
  me.canvas.addEventListener("mousemove", me.mousemove, false);
 };