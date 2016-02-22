/**
 * Very simple svm training example
 * Without any optimization
 */
public class SVM {
  private static final char ESC = (char) 27;
  private static final String RED = ESC + "[31m";
  private static final String YELLOW = ESC + "[33m";
  private static final String GREEN = ESC + "[32m";
  private static final String WHITE = ESC + "[37m";
  private static final String BOLD = ESC + "[1m";
  
  // A simple SVM trainer with SGD update
  public static void SGDUpdate(double[] w, double[] x, double alpha, int label) {
    double pull = 0.0;
    // find w.x / ||w||
    double prod = dot(w, x) / length(w);

    if(label == -1 && prod > -1) {
      pull = Math.max(-1, -1 - prod);
    } else if(label == 1 && prod < 1) {
      pull = Math.min(1, 1 - prod);
    }

    for(int i = 0; i < w.length; i++) {
      w[i] = w[i] + pull * alpha * x[i];
    }

  }

  public static double dot(double[] u, double[] v) {
    double d = 0.0;
    for(int i = 0; i < u.length; i++) {
      d += u[i] * v[i];
    }
    return d;
  }

  public static double length(double[] w) {
    return Math.sqrt(dot(w, w));
  }

  public static void main(String[] s) {
    double[][] data = {{1, 2, 8}, {1, 5, 8}, {1, 3, 5}, {1, 3, 4}, {1, 8, 9},
               {1, 3, 2}, {1, 4, 2}, {1, 9, 2}, {1, 4, 3}, {1, 5, 3},
               {1, 3, 7}, {1, 5, 4}, {1, 5, 9}, {1, 5, 11}, {1, 1, 3}};
    int[] labels = {1, 1, 1, 1, 1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1};           
    double[] w = {Math.random(), Math.random(), Math.random()};
    double alpha = 0.1;
    System.out.print(BOLD);
    for(int i = 0; i < 10; i++) {
      System.out.println("SGD Iterations: " + (i + 1));
      for(int j = 0; j < labels.length; j++) {
        SGDUpdate(w, data[j], alpha, labels[j]);
      }

      double correct = 0;
      for(int j = 0; j < labels.length; j++) {
        if(dot(w, data[j]) / length(w) * labels[j] >= 0.0) {
          correct++;
        }
      }

      correct *= 100.0 / labels.length;
      if(correct < 50.0) {
        alpha = Math.min(0.1, alpha * 1.01);
        System.out.print(RED);
      } else if(correct < 80.0) {
        alpha *= 0.9;
        System.out.print(YELLOW);
      } else {
        alpha *= 0.6;
        System.out.print(GREEN);        
      }

      System.out.format("Accuracy : %.2f\n", correct);
      System.out.print(WHITE);
      System.out.format("params = [%.4f, %.4f, %.4f]\n", w[0], w[1], w[2]);
      System.out.println("-------------");
    }
  }
}