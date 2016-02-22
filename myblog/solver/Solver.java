
/** 
 * Copyright 2016 Shamshad Alam
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


package myblog.solver;
import java.util.List;
import java.util.ArrayList;
/** 
 * Java code for the intersection of implicit curve
 * This is a very naive implementation. You shouldn't 
 * use this for any production purpose
 */
public class Solver {

    public static interface FunctionXY {
        public double evaluate(double x, double y);
        public double derivativeX(double x, double y);
        public double derivativeY(double x, double y);
    }

    public static boolean isZero(double v, double eps) {
        return (v > -eps) && (v < eps);
    }

    public static void add(List<double[]> sols, double x, double y) {
        for(int i = 0; i < sols.size(); i++) {
            double[] v = sols.get(i);
            if(isZero(x - v[0], 1e-3) && isZero(y - v[1], 1e-3)) {
                return;
            }
        }
        sols.add(new double[]{x, y});
    }

    public static List<double[]> solve(FunctionXY f, FunctionXY g, 
        double[] bounds, double eps) {
        double[][] samples = rootSamples(f, g, bounds, 8, 8);
        List<double[]> sols = new ArrayList<>();
        double x1, y1, x2, y2, er, er1, fv, gv, fv1, gv1;
        double jfx, jfy, jgx, jgy, det, alpha, dx, dy;
        int MAX_ITR = 16;
        boolean success;
        for(int i = 0; i < samples.length; i++) {
            x1 = samples[i][0];
            y1 = samples[i][1];
            fv = f.evaluate(x1, y1);
            gv = g.evaluate(x1, y1);
            er = Math.abs(fv) + Math.abs(gv);
            for(int j = 0; j < MAX_ITR && !isZero(er, eps); j++) {
                jfx = f.derivativeX(x1, y1);
                jfy = f.derivativeY(x1, y1);
                jgx = g.derivativeX(x1, y1);
                jgy = g.derivativeY(x1, y1);
                det = jfx * jgy - jfy * jgx;
                if(isZero(det, 1e-8)) {
                    break;
                }
                dx = (jgy * fv - jfy * gv) / det;
                dy = (jfx * gv - jgx * fv) / det;
                alpha = 1.0;
                success = false;
                // We can use line search that satisfies
                // Wolfe condition, but for now keep it
                // simple
                do {
                    x2 = x1 - alpha * dx;
                    y2 = y1 - alpha * dy;
                    fv1 = f.evaluate(x2, y2);
                    gv1 = g.evaluate(x2, y2);
                    er1 = Math.abs(fv1) + Math.abs(gv1);
                    if(er1 < er) {
                        success = true;
                        er = er1;
                        fv = fv1;
                        gv = gv1;
                        x1 = x2;
                        y1 = y2;
                        break;
                    }
                    alpha *= 0.8;
                } while(alpha >= 0.01);

                if(!success) {
                    break;
                }
            }

            if(isZero(er, eps)) {
                add(sols, x1, y1);
            }
        }
        return sols;
    }

    /**
     * divide the entire space in 10x10 grid and evaluate
     * f and g at each vertex return mid point of consecutive
     * vertices for which both functions change their sign.
     */
    public static double[][] rootSamples(FunctionXY f, FunctionXY g, double[] bounds,
            int sampleXSize, int sampleYSize) {
        double inx = (bounds[2] - bounds[0]) / sampleXSize;
        double iny = (bounds[3] - bounds[1]) / sampleYSize;
        double[][] samples = new double[sampleYSize * sampleYSize][2];
        int found = 0, k = 0;
        double[] v1 = new double[4];
        double[] v2 = new double[4];
        int[][] mv = {{0, 0}, {0, 1}, {1, 0}, {1, 1}};
        for(double x = bounds[0]; x < bounds[2]; x += inx) {
            for(double y = bounds[1]; y < bounds[3]; y += iny) {
                for(int i = 0; i < 4; i++) {
                    v1[i] = f.evaluate(x + inx * mv[i][0], y + iny * mv[i][1]);
                    v2[i] = g.evaluate(x + inx * mv[i][0], y + iny * mv[i][1]);
                }
                if(has(v1) && has(v2)) {
                    samples[k][0] = x + inx * 0.5;
                    samples[k++][1] = y + iny * 0.5;
                }
            }
        }
        if(k == 0) {
            // add random samples
            System.out.println("samples");
            inx = bounds[2] - bounds[0];
            iny = bounds[3] - bounds[1];
            for(double x = 0.25; x < 1.0; x += 0.5) {
                for(double y = 0.25; y < 1.0; y += 0.5) {
                    samples[k][0] = bounds[0] + x * inx;
                    samples[k++][1] = bounds[1] + y * iny;
                }
            }
        }
        double[][] ret = new double[k][2];
        for(int i = 0; i < k; i++) {
            ret[i][0] = samples[i][0];
            ret[i][1] = samples[i][1];
        }
        return ret;
    }

    public static boolean has(double[] v) {
        for(int i = 1; i < 4; i++) {
            if(v[i] * v[0] <= 0.0) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        FunctionXY f = new FunctionXY() {
            public double evaluate(double x, double y) {
                return y - 0.25 * x * x;
            }
            public double derivativeX(double x, double y) {
                return -0.5 * x;
            }
            public double derivativeY(double x, double y) {
                return 1.0;
            }
        };
        FunctionXY g = new FunctionXY() {
            public double evaluate(double x, double y) {
                return y * y - x + 0.2;
            }
            public double derivativeX(double x, double y) {
                return -1.0;
            }
            public double derivativeY(double x, double y) {
                return 2.0 * y;
            }
        };

        double[] bounds = {-10.0, -10.0, 10, 10};
        List<double[]> roots = solve(f, g, bounds, 1e-8);
        if(roots.size() == 0) {
            System.out.println("Oops! no root founds. :-(");
        } else {
            System.out.println("Number of roots founds :-) : " + roots.size());
            for(double[] root : roots) {
                System.out.println("------------------------");
                System.out.format("x = %.8f\n", root[0]);
                System.out.format("y = %.8f\n", root[1]);
                System.out.format("f = %.8f\n", f.evaluate(root[0], root[1]));
                System.out.format("g = %.8f\n", g.evaluate(root[0], root[1]));
            }
        }
    }
}
