import java.util.Random;
/**
 * Very simple svm training example 
 * Motivated by Karpathy's blog, with
 * some tweaks, ignoring mathematical rigours
 * Trying direct optimization
 * Without any quadratic progrmming optimization 
 */
public class SVM {
  private static final char ESC = (char) 27;
  private static final String RED = ESC + "[31m";
  private static final String YELLOW = ESC + "[33m";
  private static final String GREEN = ESC + "[32m";
  private static final String WHITE = ESC + "[37m";
  private static final String BOLD = ESC + "[1m";
  private static final double lambda = 0.005;
  // A simple SVM trainer with SGD update
  public static void SGDUpdate(double[] w, double[] x, double alpha, int label) {
    double pull = 0.0;
    double prod = dot(w, x) / length(w);
    
    if(label == -1 && prod > -1) {
      pull = Math.max(-1, -1 - prod);
    } else if(label == 1 && prod < 1) {
      pull = Math.min(1, 1 - prod);
    }

    w[0] = w[0] + alpha * x[0] * pull;        
    for(int i = 1; i < w.length; i++) {
      w[i] = w[i] + alpha * (x[i] * pull - lambda * w[i]);      
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
    return Math.sqrt(dot(w, w) - w[0] * w[0]);
  }

  public static void main(String[] s) {
    double[][] data = {{1, 2, 8}, {1, 5, 8}, {1, 3, 5}, {1, 3, 4}, {1, 8, 9},
               {1, 3, 2}, {1, 4, 2}, {1, 9, 2}, {1, 4, 3}, {1, 5, 3},
               {1, 3, 7}, {1, 5, 4}, {1, 5, 9}, {1, 5, 11}, {1, 1, 3}};
    int[] labels = {1, 1, 1, 1, 1, -1, -1, -1, -1, -1, 1, -1, 1, -1, 1};
    Random random = new Random();
    double[] w = {10, 1, 10}; // a bad and random start point
    int length = labels.length;
    double alpha = 0.01;
    double[] best = w;
    double mx = 0.0; 
    System.out.print(BOLD);
    // randomly select a sample, perform SGD with the sample
    // display accuracy for every 20 updates
    // try to vary following paramters
    // alpha: learning rate; lamda: regularization
    // rate decay when we are to close to solution
    // initialize weight vector too far from solution and see how
    // ||w|| goes towards zero and error reduces gradually and stochastically
    for(int i = 0; i < 400; i++) {
      int sample = random.nextInt(length);
      SGDUpdate(w, data[sample], alpha, labels[sample]);
      if(i % 20 == 0) {
        double correct = 0.0;
        for(int j = 0; j < length; j++) {
          if(dot(w, data[j]) * labels[j] > 0.0) correct++;
        }
        
        correct *= 100.0 / labels.length;
        
        if(correct < 70.0) {
          System.out.print(RED);
        } else if(correct < 90.0) {
          alpha *= 0.95;
          System.out.print(YELLOW);
        } else {
          alpha *= 0.80;
          System.out.print(GREEN);        
        }

        if(correct > mx) {
          best = w;
          mx = correct;
        }
        System.out.format("Accuracy : %.2f", correct);
        System.out.format(" with [%.4f, %.4f, %.4f] norm = %.5f\n", w[0], w[1], w[2], length(w));
      }
    }
    System.out.print(GREEN);        
    System.out.print("Best params : ");
    System.out.format("accuracy = %.2f with [%.4f, %.4f, %.4f]\n", mx, best[0], best[1], best[2]);
  }
}