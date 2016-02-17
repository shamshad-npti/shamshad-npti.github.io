---
layout: post
title:  "Intersection between implicit curves"
date:   2016-02-08 22:34:34
categories: Implicit Curve
---
Interscetion between two implicit curves
---
In this post I would discuss two different method to find intersection between two implicit curves $$ f(x, y) = 0 $$
and $$ g(x, y) = 0 $$. I would start with simple problem formulation, manual solution followed by two methods - Newton's
and Broyden's method to find intersections.

### Problem formulation
For two different implicit curves $$ f(x, y) = 0 $$ and $$ g(x, y) = 0 $$ find some points $$ (x_k, y_k) $$,
where $$ x_{min} \le x_k \le x_{max} $$ and $$ y_{min} \le y_k \le y_{max} $$, in $$ R^2 $$ such that $$ f(x_k, y_k) = 0 $$
and $$ g(x_k, y_k) = 0 $$.

#### Example
Let $$ f(x, y) = y - x^2 - 4 = 0 $$ and $$ g(x, y) = y - 2x^2 = 0 $$. From second equation we get $$ y = 2x^2 $$. When we substitute this value in the first equation we get $$ x = \pm 2 $$. Thus $$ (x, y) = \{(-2, 8), (2, 8)\}$$ satisfies both equation. But, it is not always so simple. It is difficult to find the solution of $$ x^3 + 3x^2y + 5xy^2 + 4xy + y^3 = 0 $$ and $$ sin(x + 2y) + xy = 0 $$.

### Newton's Method
Newton's method is an iterative method which is used to find roots of function $$ f(x) = 0 $$. In this method we begin with some intial guess $$ x_0 $$ and iteratively update initial guess with a better approximation using following expression until desired accuracy is achieved

$$ x_{k+1} = x_{k} - \frac {f(x_k)} {f'(x_k)} $$

The same idea can be extended to $$ R^2 $$ find intersection between two implicit curves. we know that

$$ f(x + \Delta x, y + \Delta y) = f(x, y) + [\frac {\partial f(x, y)} {\partial x}, \frac {\partial f(x, y)} {\partial y}] [\Delta x, \Delta y]^T + O(\epsilon^2)$$

We begin with some intial guess $$ (x, y) $$, and try to move small step $$ (\Delta x, \Delta y) $$ in the best direction
that is the move for which $$ f(x + \Delta x, y + \Delta y) \approx g(x + \Delta x, y + \Delta y) $$.

To avoid clutter let's define 

$$ \Delta x = x_{k+1} - x_k $$,
$$ \Delta y = y_{k+1} - y_k $$,
$$ f(x, y) = f_k $$,
$$ f(x + \Delta x, y + \Delta y) = f_{k+1} $$, 
$$ \partial f(x, y) /\partial x = f_x $$,
$$ \partial f(x, y) /\partial y = f_y $$,
and the same for g(x). We can write

$$ F = - J \Delta X $$

$$ \Rightarrow \Delta X = -J^{-1} F $$

where $$ F = \begin{bmatrix}f_k & g_k\end{bmatrix}^T, \Delta X = \begin{bmatrix}\Delta x & \Delta y \end{bmatrix}^T$$, and

$$ J = \begin{bmatrix}
f_x & f_y \\
g_x & g_y
\end{bmatrix}$$

Since $$ J $$ is a 2x2 square matrix it is simple to find its inverse.

$$ J^{-1} = \frac{1} {f_xg_y - g_xf_y} \begin{bmatrix}
g_y & -f_y \\
-g_x & f_x
\end{bmatrix}$$

Now the expression becomes

$$ \begin{bmatrix} x_{k+1} \\ y_{k+1} \end{bmatrix} = \begin{bmatrix} x_{k} \\ y_{k} \end{bmatrix}
- \frac{1} {f_xg_y - g_xf_y} \begin{bmatrix}
g_y & -f_y \\
-g_x & f_x
\end{bmatrix} \begin{bmatrix} f_{k} \\ g_{k} \end{bmatrix} $$

Where $$ {f_xg_y - g_xf_y} \ne 0 $$

The idea can be extended to equation even in higher dimension.

#### Damping
Sometimes the step size $$ \Delta X $$ that is chosen by the algorithm is too large that leads to divergence. To avoid it we introduce a damping factor $$ \alpha $$

$$ X_{k+1} = X_{k} - \alpha J^{-1} F_k, $$ where $$ 0 \lt \alpha \le 1 $$

In theory we use line search to find the best $$ \alpha $$. In practice, for simple application, we can use binary search
to find a good $$ \alpha $$ that reduces $$ ||F_{k+1} - F_k|| $$

#### Limitations
* Both functions should be continuous and differentiable
* It is computationally expensive to evaluate derivative at each step
* Near singular jacobian matrix sometimes leads to divergence
* If starting point is not close to the solution, the algorithm may not converge quickly or even may diverge

