---
layout: post
title:  "Marching Cube Algorithm For Implicit Surface Plotting"
description: "Description of marching cube algorithm for surface plotting with some application in science and mathematics"
date:   2016-01-10 21:05:40
categories: Implicit Curve
id: marching_cube
comments: true
---

### Background
Equations in the form of $$ f(x, y, z) = 0 $$ are called implicit surface, e.g. $$ 3x^2 + 4y^2 + 9z^2 - 16 $$ is an implicit equation of the ellipsoid. Such equations are often arises in engineering and mathematics. It is helpful to visualize these equations to understand the system clearly or to communicate the idea with others. If we can convert an implicit equation to a parameteric equation the surface plotting task become easy, and computationally less expensive. However such transformation are not always possible. Therefore we need an algorithm that accept an arbitrary equation of implicit surface and bounding space as parameters, and generate surface within the bound. Ray tracing method is often used for this task. The other approach which we discuss here is to use marching cube. Though it suffers from some limitations, it has capability to plot arbitrary surface with acceptable deviation. 

#### Marching Cube Algorithm
The algorithm divide the space in a finite number of small cube and evaluate the equation at the corner of each cube. The evaluated value can be either non-negative or negative (ignoring discontinuity), therefore there are $$ 256 = (2^8) $$ possibilities. However half of them are reflection of the other half. Moreover if we notice carefully we see there are only fifteen different combinations that we need to care about. They are shown in the following figure.

{: .img}
![fifteen possible unique combinations of vertices]({{ site.url }}/assets/marching_cube.png)*Figure 1: Fifteen possible unique combination of vertices*

