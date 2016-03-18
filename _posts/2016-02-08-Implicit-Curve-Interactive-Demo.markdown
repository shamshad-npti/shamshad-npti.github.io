---
layout: post
title:  "Implicit Curve Interactive Demo"
description: "Interactive demo of implicit curve in html canvas using javascript"
date:   2016-02-08 08:24:12
categories: Implicit Curve
id: implicit_curve_demo
comments: true
---

<script type="text/javascript" src="{{ "/scripts/implicit.js" | prepend: site.baseurl }}"></script>
<canvas id="paint" style="border: solid 1px green;" width="640" height="480"></canvas>
<form>
    Enter equation* (Not supported)
    <input type="text" name="equation" value="|x*y| - 5 = 0" readonly />
</form>
$$ |xy| - 5 = 0 $$
<script type="text/javascript">
var canvas = document.getElementById("paint");
var cv = new CanvasPlotter(canvas, function(x, y){return Math.abs(x*y) - 5;});
cv.update();
</script>
