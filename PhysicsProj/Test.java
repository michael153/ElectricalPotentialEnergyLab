package PhysicsProj;

public class Test {
	public static void main(String[] args) {

		double vx = 0;
		double vy = 10;
		double height = 600;
		double timeValue = 0;

		double[] x = new double[4];

		x[0] = 300;
		x[1] = (height/2);
		x[2] = vx;
		x[3] = vy;

		double[] xold = new double[4];

		xold[0] = x[0];
		xold[1] = x[1]; 
		xold[2] = x[2];
		xold[3] = x[3];

		RKDemo nint = new RKDemo(0, x, .01);
		for (int i = 0; i < 100; i++) {
			nint.iterate();
			// System.out.println(nint.x[0] + ", " + nint.x[1] + ", " + nint.x[2] + ", " + nint.x[3]);
			System.out.println(nint.k1[0] + ", " + nint.k1[1] + ", " + nint.k1[2] + ", " + nint.k1[3]);
		}
	}
}