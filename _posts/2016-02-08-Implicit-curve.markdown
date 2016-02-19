---
layout: post
title:  "Quadtree Algorithm for Implicit Curve Drawing"
date:   2016-02-08 22:34:34
categories: Implicit Curve
id: implicit_curve
comments: true
---
## Implicit Curve

### Background

The function which is defined as $$ f(x, y) = 0 $$ is known as
implicit curve, eg. $$ x sin(x) + y cos(x) - 1 = 0 $$ is an implict curve. 
Similarly, the function which is in the form of $$ f(x, y, z) = 0 $$ is called
implicit surface. Sometimes it is possible to convert an implicit reprentation
into the explicit form, as $$ y - x^2 = 0 $$ can be written as $$ y = x^2 $$, or
into parmeterized form, such as the same equation can be written as $$ y = t^2, x = t $$
but in some cases transformation can be hard, as in $$ x^4 + y^4 + xy = 0 $$. 

Explicit and parameterised curves are comparatively easier to plot than the 
implicit curve. To plot $$ y = f(x) $$ which is an explict function, we have 
to evalute $$ f(x) $$ at $$ n $$ discrete location where $$ n $$ may be horizontal
resolution of the viewport, on the other hand we need to evaluate $$ f(x, y) = 0 $$
at $$ n^2 $$ different location in brute force attempt to plot implicit curves.

We can tackle the problem using two methods : A. Finding the solution of 
$$ f(x, y) = 0 $$ and thereafter following the curve, B. Marching cube. The first
method start by solving $$ f(x, y) = 0 $$ and then exploiting gradient information
to move towards the best direction. It works good in practice, but it doesn't produce
desirable result when gradient vanishes (singular points), the curve is highly
twisted, or the curve is dense. The marching cube algorithm divides the viewport into
small sqaures and evaluate the function at each vertex. Evaluated function value at each
vertex, if function is well defined at the vetex, can either be $$ f(x) \le 0 $$, or 
$$ f(x) \gt 0 $$. Ignoring where $$ f(x_k, y_k) = 0 $$ at the vertex, there are sixteen possible combination of the status of four vertex. We mark each vertex of square with 
$$ sign(f(x, y)) $$. The square which has at least one vertex which sign differs from
all other vertex or where $$ f(x, y) = 0 $$ will definitely have a curve segment if 
the function is continuous at every point in the square. Following figure shows different
possible configuration. First and ninth squares are empty whereas eighth and sixteenth 
show ambiguous configuration. Marching square is a better approach than curve following
however it fails handle singularties and saddle points correctly. Furtheremore, it has to evaluate $$ f(x, y) $$ at each vertex of the square. The evaluation may be costly. 

_Figure 1: Sixteen possible combinations: Circles represent $$ f(x, y) > 0 $$_
![Sixteen possible configurations: Circles represent f(x, y) > 0]({{ site.url }}/assets/marching_square.png)

Quadtree Algorithm for Implicit Curve
---
The quadtree algorithm is an extention of marching square algorithm. The space is
explored recursively by the algorithm to ensure that if the curve passes through the
square. The algorithm maintain two variable <code>SEARCH_DEPTH</code> and <code>
PLOT_DEPTH</code>. All square cells are examined to the <code>SEARCH_DEPTH</code> without any function evalution. Thereafter the algorithm starts testing if a sqaure
cell has a curve segment. The square cells with curve segments are explored further up to<code>PLOT_DEPTH</code> then the curve segment is added to the path.

_Figure 2: Space exploration for $$ |x| - |y| = 0 $$_
![Space exploration for \|x\| + \|y\| = 0]({{ site.url }}/assets/qtree.png)

{%highlight javascript%}
// this is pseudo code for quadtree algorithm
plot(x, y, dx, dy, depth) {
    if(depth < SEARCH_DEPTH) {
        dx = dx * 0.5;
        dy = dy * 0.5;
        plot(x1, y1, dx, dy, depth + 1);
        plot(x1 + dx, y1, dx, dy, depth + 1);
        plot(x1 + dx, y1 + dy, dx, dy, depth + 1);
        plot(x1, y1 + dy, dx, dy, depth + 1);
    } else {
        if(hasSegment(x1, y1, dx, dy)) {
            if(depth >= PLOT_DEPTH) {
                addSegment(x1, y1, dx, dy);
            } else {
                dx = dx * 0.5;
                dy = dy * 0.5;
                plot(x1, y1, dx, dy, depth + 1);
                plot(x1 + dx, y1, dx, dy, depth + 1);
                plot(x1 + dx, y1 + dy, dx, dy, depth + 1);
                plot(x1, y1 + dy, dx, dy, depth + 1);
            }
        }
    }
}
{%endhighlight%}

Digression
---
I implemented this algorithm for [GeoGebra](http://www.geogebra.org "GeoGebra") which supports a range of platform including desktop and web. The implemented algorithm worked fine on desktop however gui often became unresponsive when I tested the algorithm on GeoGebra Web. I tried some optimizations but they failed to work. Finally, I ran these diagonstics for java and javascript separately to discover the actual difference in performance on my 2.7 GHz, 8 GB Quad Core
Dell notebook. It prohabited the algorithm from exploring the tree deeply in web view.

{% highlight java %}
public class PerformanceTest {
    public static void main(String[] str) {
        long t = now();
        int k = 0;
        int z = 10000000;
        for(int i = 0; i < z; i++) {
            if(k < z) k += i;
            else k -= i;
        }
        t = now() - t;
        System.out.println("Value of k : " + k);
        System.out.println("Time taken to iterate " + z + " times: " + t);
    }
    public static long now() {
        return System.currentTimeMillis();	
    }
}
// output : Time taken to execute 10000000 iteration: 20ms
{% endhighlight %}

{% highlight javascript %}
time = Date.now();
k = 0;
z = 10000000;
for(i = 0; i < z; i++) {
    k++;		
}
time = Date.now() - time;
console.log("Time taken to iterate " + z + " times: " + time + "ms");
// console output : Time taken to iterate 10000000 times: 15231ms
{% endhighlight %}

### Limitations
Quadtree algorithm performs better than marching cube algorithm, however it still suffers from certain limitations. It fails to correctly plot curve which is entirely in a single square cell, which has saddle or bifurcation point, or which intersects a square cell twice. We can handle singularities or bifurcation point by maintaining gradient information of curve, because gradient vanishes at singularities. Problem of twice intersection can be handled by communicating information among neighborhood square.
However the first problem can't be solve without exploring the tree further.

### Improvement in quadtree
To improve the algorithm we need to maintain gradient information and share information among neighbors. Both can increase the complexity if evaluated at each level of the tree.Therefore, combined idea of marching cube and quadtree is used. The function and its gradient is evalauted at the <code>SEARCH_DEPTH</code>. The gradients tend to zero near singularity. If gradients are too close to zero the algorithm mark the cell as singular. The algorithm when proceed beyond the <code>SEARCH_DEPTH</code>, it checks the neiborhood and mark them whenever it add a segment.

{%highlight javascript%}
// pseudo code of modified quadtree algorithm
// grid is an nxn array
// grid status can be : 
// singular, empty, finished
grid = array(n, n);
dx = width / n;
dy = height / n;
for(i = 0; i < n; i ++) {
    for(j = 0; j < n; j ++) {
        grid[j][i] = status(x + dx * i, y + dy * j, dx, dy);
    }
}
for(k = 0; k < 8; k++) {
    for(i = 0; i < n; i++) {
        for(j = 0; j < n; j++) {
            if(grid[j][i] == FINISHED) continue;
            cell = [i, j];
            plot(x + dx * i, y + dy * j, dx, dy, SEARCH_DEPTH);
            grid[j][i] = FINISHED;
        }
    }
}
plot(x, y, dx, dy, depth) {
    if(hasSegment(x, y, dx, dy)) {
        if(depth >= PLOT_DEPTH) {
            segment = addSegment(x, y, dx, dy);
            // the function left(cell) return left side 
            // of the square, and left_cell(cell) return
            // the cell left to the current cell
            if(intersect(left(cell), segment)) {
                mark(left_cell(cell));
            }
            if(intersect(right(cell), segment)) {
                mark(right_cell(cell));
            }
            if(intersect(up(cell), segment)) {
                mark(up_cell(cell));
            }
            if(intersect(down(cell), segment)) {
                mark(down_cell(cell));
            }
        }
    }
}
{%endhighlight%}