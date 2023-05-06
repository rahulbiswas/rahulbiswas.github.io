import java.util.ArrayList;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.*;
import java.math.RoundingMode;
import java.text.DecimalFormat;

public class trig {
    static int increment = 1;
    public static HashMap<Integer, Double> sin_t = new HashMap<Integer, Double>();
    public static ArrayList<ArrayList> table;
    private static final DecimalFormat df = new DecimalFormat("0.000");

    public static void main(String[] args) {
        table = new ArrayList<>();
        table.add(new ArrayList<String>(
                Arrays.asList("deg", "sin", "cos", "tan", "csc", "sec", "cot")));
        for (int i = 1; i < 91; i++) {
            ArrayList row = new ArrayList(Arrays.asList(i, df.format(sine(i)), df.format(cosine(i)), df.format(tangent(i)), df.format(cosecant(i)), df.format(secant(i)), df.format(cotangent(i))));
            table.add(row);
        }
        for (int l = 0; l < 7; l++) {
            System.out.print("        "+table.get(0).get(l));
        }
        System.out.println("");
        for (int index = 1; index < table.size(); index++) {
            for (int index1 = 0; index1 < 7; index1++) {
                if ((index == 90 && index1 == 3) || (index == 90 && index1 == 5)) {
                    System.out.printf("%11s", "1e10");
                } else {
                    System.out.printf("%11s", table.get(index).get(index1));
                }
            }
            System.out.println("");
        }
    }

    public static double division(double a, double b) {
        if (Math.abs(b) > 1e-5) {
            return a / b;
        } else {
            return 1e10;
        }
    }

    public static double cosine(int num) {
        double val = Math.sqrt(1 - ((sine(num)) * sine(num)));
        if (num < 90 | (num < 360 && num > 270)) {
            return val;
        } else {
            return -val;
        }
    }

    public static double sine(int num) {
        if (num == increment) {
            return Math.sin(increment * Math.PI / 180.0);
        } else if (sin_t.containsKey(num)) {
            return sin_t.get(num);
        } else {
            double val = sine(increment) * cosine(num - increment) + cosine(increment) * sine(num - increment);
            sin_t.remove(num);
            sin_t.put(num, val);
            return val;
        }
    }
    public static double tangent(int num) {
        return division(sine(num), cosine(num));
    }
    public static double cosecant(int num) {
        return 1/sine(num);
    }
    public static double secant(int num) {
        return division(1,cosine(num));
    }
    public static double cotangent(int num) {
        return 1/tangent(num);
    }
}