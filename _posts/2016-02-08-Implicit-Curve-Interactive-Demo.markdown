---
layout: post
title:  "Implicit Curve Interactive Demo"
description: "Interactive demo of implicit curve in html canvas using javascript"
date:   2016-02-08 08:24:12
categories: Implicit Curve
id: implicit_curve_demo
comments: true
---
<script type="text/javascript" src="{{ "/scripts/math.min.js" | prepend: site.baseurl }}"></script>
<script type="text/javascript" src="{{ "/scripts/implicit.js" | prepend: site.baseurl }}"></script>
<canvas id="paint" style="border: solid 1px green;" width="640" height="480"></canvas>
<form id="eq_form">
	<input type="text" placeholder = "Equation" name="equation" id="equation"/>
	<span id="error"> </span>
	<div style="font-size: smaller; color:#222; padding-top:20px;">
		<div style="font-size: large;">You may like to try following equation</div>
		<div>abs(x) + abs(y) - 6</div>
		<div>x^3 + y - 4</div>
		<div>x^4 + y^4 - x*y - 8</div>
	</div>
</form>
<script type="text/javascript">
var canvas = document.getElementById("paint");
var cv = new CanvasPlotter(canvas, function(x, y) {return -1;});
var error = document.getElementById("error");
document.getElementById("eq_form").addEventListener("submit", function(evt) {
	evt.preventDefault();
	try {
		var eqn = document.getElementById("equation").value;
		fn = math.eval("f(x, y) = " + eqn);
		cv.func = fn;
		cv.update();
		error.innerHTML = "";
	} catch(ex) {
		error.innerHTML = "Invalid input!";
		console.log("Invalid equation!");
	}
});
</script>
