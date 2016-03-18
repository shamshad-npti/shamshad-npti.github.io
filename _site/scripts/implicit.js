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
  me.x = 0, me.y = 0, me.children = null, me.status = null;
  me.singular = false, me.func = func;

  me.copy = function(r) {
    for(var i = 0; i < 4; i++) {
      me.eval[i] = r.eval[i];
      me.rect[i] = r.rect[i];
    }
    me.x = r.x, me.y = r.y;
    me.singular = r.singular;
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
  var LIST_THRESHOLD = 16, MAX_SPLIT = 32, RES_COARSE = 8;
  var timer = new Timer(), MAX_DEPTH = 4, T0101 = 5;

  me.func = func, me.finish = finish, me.grid = null;
  me.temp = null, me.plotDepth = 0, me.segmentCheckDepth = 0;
  me.openList = [], me.segments = [];
  me.sw = 0, me.sh = 0, me.pts = [null, null];

  function buildStatus(r) {
    var z = 0, p = 0, n = 0, k = true;
    for(var i = 0; i < 4; i++) {
      if(!isFinite(r.eval[i]) || isNaN(r.eval[i])) {
        k = false;
        break;
      }
      if(r.eval[i] < 0.0) n++;
      else if(r.eval[i] > 0.0) p++;
      else z++;
    }
    r.status = {pos: p, neg: n, zero: z, valid: k, empty: !k || ((z + 1) | p | n) >= 4};
  }

  function interpolate(p1, p2, fa, fb) {
    var r = -fb / (fa - fb);
    if (r >= 0 && r <= 1) { return r * (p1 - p2) + p2; }
    return (p1 + p2) * 0.5;
  };

  function createLine(x1, y1, x2, y2) {
    me.pts[0] = new Point(x1, y1, false);
    me.pts[1] = new Point(x2, y2, true);
    return VALID;
  }

  function oppSign(x, y) { 
    return x * y < 0.0; 
  }

  me.abortList = function() {
    for(var i = 0; i < me.openList.length; i++) {
      me.segments.push(me.openList[i].start);
      me.segments = me.segments.concat(me.openList[i].points.toArray());
      me.segments.push(me.openList[i].end);
    }
    me.openList = [];
  };
  
  me.create = function(r) {
    if(r.status.empty) return EMPTY;
    var zer = r.status.zero;
    var neg = r.status.neg;
    var pos = r.status.pos;
    if(((zer + 1) | neg | pos) >= 4) { return EMPTY; }
    var x1 = r.x1(), x2 = r.x2(), y1 = r.y1(), y2 = r.y2();
    var tl = r.eval[0], tr = r.eval[1], br = r.eval[2], bl = r.eval[3];
    switch(zer) {
      case 0:
        var k = 0;
        if(neg === pos && !oppSign(tl, br)) return T0101;
        if(oppSign(tl, tr)) me.pts[k++] = new Point(interpolate(x1, x2, tl, tr), y1, k !== 0);
        if(oppSign(tr, br)) me.pts[k++] = new Point(x2, interpolate(y1, y2, tr, br), k !== 0);
        if(oppSign(br, bl)) me.pts[k++] = new Point(interpolate(x1, x2, bl, br), y2, k !== 0);
        if(oppSign(bl, tl)) me.pts[k++] = new Point(x1, interpolate(y1, y2, tl, bl), k !== 0);
        return VALID;
      case 1:
        if(neg === 3 || pos === 3) {
          if(tl === 0.0) return createLine(x1, y1, x1, y1);
          if(tr === 0.0) return createLine(x2, y1, x2, y1);
          if(bl === 0.0) return createLine(x1, y2, x2, y2);
          if(br === 0.0) return createLine(x2, y2, x2, y2);
        }
        if(tl === 0.0) {
          if(oppSign(bl, br)) return createLine(x1, y1, interpolate(x1, x2, bl, br), y2);
          if(oppSign(tr, br)) return createLine(x1, y1, x2, interpolate(y1, y1, tr, br));
          return EMPTY;
        }
        if(tr === 0.0) {
          if(oppSign(bl, br)) return createLine(interpolate(x1, x2, bl, br), y2, x2, y1);
          if(oppSign(bl, tl)) return createLine(x1, interpolate(y1, y2, tl, bl), x2, y1);
          return EMPTY;
        }
        if(br === 0.0) {
          if(oppSign(tl, tr)) return createLine(interpolate(x1, x2, tl, tr), y1, x2, y2);
          if(oppSign(tl, bl)) return createLine(x1, interpolate(y1, y2, tl, bl), x2, y2);
          return EMPTY;
        }
        if(bl === 0.0) {
          if(oppSign(tl, tr)) return createLine(x1, y2, interpolate(x1, x2, tl, tr), y1);
          if(oppSign(tr, br)) return createLine(x1, y2, x2, interpolate(y1, y2, tr, br));
          return EMPTY;
        }
        return EMPTY;
      case 2:
        if(pos === 2 || neg === 2) {
          if(tl === 0.0) {
            if(tr === 0.0) return createLine(x1, y1, x2, y1);
            if(bl === 0.0) return createLine(x1, y1, x1, y2);
          } else if(br === 0.0) {
            if(tr === 0.0) return createLine(x2, y1, x2, y2);
            if(bl === 0.0) return createLine(x1, y2, x2, y2);
          }
        } else {
          if(tr === 0.0 && bl === 0.0) return createLine(x1, y2, x2, y1);
          if(tl === 0.0 && br === 0.0) return createLine(x1, y1, x2, y2);
        }
        return EMPTY;
    }
  };

  me.append = function(r) {
    var cfg = me.create(r);
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

  me.update = function(x1, y1, x2, y2, px, py, fast) {
    x1 -= 0.25 * Math.PI / px;
    if(fast) {
      me.sw = 8;
      me.sh = 8;
    } else {
      me.sw = Math.min(MAX_SPLIT, Math.floor(px / RES_COARSE));
      me.sh = Math.min(MAX_SPLIT, Math.floor(py / RES_COARSE));      
    }
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
        rect.status = buildStatus(rect);
        vertices[j - 1] = prev;
        prev = cur;
      }
      vertices[me.sw] = prev;
    }

    timer.record();

    if (timer.elapse <= 10) {
      // Fast device optimize for UX
      me.plotDepth = 2;
      me.segmentCheckDepth = 1;
      LIST_THRESHOLD = 48;
    } else {
      // Slow device detected reduce parameters
      me.plotDepth = 1;
      me.segmentCheckDepth = 0;
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
    } else if (timer.elapse >= 200) {
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
    buildStatus(r);
    if(!r.status.empty) {
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
  me.canvas = canvas; me.func = func;
  me.style = attr(canvas, "style");
  me.x1 = -10; me.x2 = 10;
  me.y1 = -10; me.y2 = 10;
  me.ctx = canvas.getContext("2d");
  me.color = "green";
  me.axisColor = "#222";
  me.gridColor = "#ccc";
  me.clearColor = "#efefef";
  me.px = 300; me.py = 300;
  me.tx = 0; me.ty = 0;
  me.isdown = false;
  me.mouseX = 0; me.mouseY = 0;
  me.working = false;

  function attr(elem, name) {
    var atr = elem.getAttribute(name);
    if(atr !== undefined && atr !== null) return atr;
    return "";
  }

  me.mousedown = function(evt) {
    if(evt.button != 0) return;
    me.processEvt(evt);
    me.mouseX = me.mx; me.mouseY = me.my;
    me.canvas.style = me.style + ";cursor: move;";
    me.isdown = true;
  };

  me.mousemove = function(evt) { 
    if(!me.isdown) return;
    me.processEvt(evt);
    var dx = me.mx - me.mouseX;
    var dy = me.my - me.mouseY;
    me.mouseX = me.mx; me.mouseY = me.my;
    dx /= me.tx; dy /= me.ty;
    me.x1 -= dx; me.x2 -= dx; 
    me.y1 += dy; me.y2 += dy;
    me.update(true);
  };

  me.mouseup = function(evt) {
    if(!me.isdown) return;
    me.isdown = false;
    me.processEvt(evt);
    me.mx -= me.mouseX; me.my -= me.mouseY;
    me.mx /= me.tx; me.my /= me.ty;
    me.x1 -= me.mx; me.x2 -= me.mx; 
    me.y1 += me.my; me.y2 += me.my;
    me.canvas.style = me.style;
    me.update(false);
  }

  me.processEvt = function(evt) {
    var rect = me.canvas.getBoundingClientRect();
    me.mx = (evt.clientX - rect.left)*(me.canvas.width/rect.width);
    me.my = (evt.clientY - rect.top)*(me.canvas.height/rect.height);
  }

  function beforeplot() {
    me.ctx.setTransform(me.tx, 0, 0, -me.ty, -me.x1 * me.tx, me.y2 * me.ty);
    me.lineWidth = 1 / Math.max(Math.abs(me.tx), Math.abs(me.ty));
    me.ctx.beginPath();
    me.ctx.rect(me.x1, me.y1, me.x2 - me.x1, me.y2 - me.y1);
    me.ctx.fillStyle = me.clearColor;
    me.ctx.fill();
    me.ctx.beginPath();
    me.ctx.moveTo(0, me.y1);
    me.ctx.lineTo(0, me.y2);
    me.ctx.moveTo(me.x1, 0);
    me.ctx.lineTo(me.x2, 0);
    me.ctx.lineWidth = 0.5 * me.lineWidth;
    me.ctx.strokeStyle = me.axisColor;
    me.ctx.stroke();
    me.ctx.beginPath();
    var dx = (me.x2 - me.x1) / 10;
    var dy = (me.y2 - me.y1) / 10;
    for(var i = dx; i < me.x2; i += dx) {
      me.ctx.moveTo(i, me.y1);
      me.ctx.lineTo(i, me.y2);
    }
    for(var i = -dx; i > me.x1; i -= dx) {
      me.ctx.moveTo(i, me.y1);
      me.ctx.lineTo(i, me.y2);
    }
    for(var i = dy; i < me.y2; i += dy) {
      me.ctx.moveTo(me.x1, i);
      me.ctx.lineTo(me.x2, i);
    }
    for(var i = -dy; i > me.y1; i -= dy) {
      me.ctx.moveTo(me.x1, i);
      me.ctx.lineTo(me.x2, i);
    }
    me.ctx.lineWidth = 0.5 * me.lineWidth;
    me.ctx.strokeStyle = me.gridColor;
    me.ctx.stroke();
  }

  me.finish = function(segments) {
    beforeplot();
    me.ctx.beginPath();
    for(var i = 0; i < segments.length; i++) {
      if(segments[i].lineTo) {
        me.ctx.lineTo(segments[i].x, segments[i].y);
      } else {
        me.ctx.moveTo(segments[i].x, segments[i].y);        
      }
    }
    me.ctx.strokeStyle = me.color;
    me.ctx.lineWidth = 2 * me.lineWidth;
    me.ctx.stroke();
  }

  me.update = function(fast = false) {
    me.px = canvas.scrollWidth;
    me.py = canvas.scrollHeight;
    me.tx = me.px / (me.x2 - me.x1);
    me.ty = me.py / (me.y2 - me.y1);
    me.plot = new Implicit(me.func, me.finish);
    me.plot.update(me.x1, me.y1, me.x2, me.y2, me.px, me.py, fast);
  }
  me.canvas.addEventListener("mousedown", me.mousedown, false);
  me.canvas.addEventListener("mouseup", me.mouseup, false);
  me.canvas.addEventListener("mousemove", me.mousemove, false);
  document.body.addEventListener("mouseup", function() { me.isdown = false; }, false);
};