
// $AISD_VERSION:RKDemo.java@1.2/home/coei/arc/archive%shell3.ba.best.com$

//COPYRIGHT: Copyright (c) 1997 by Christopher K. Oei, Incorporated.
//COPYRIGHT: 
//COPYRIGHT: http://www.chrisoei.com
//COPYRIGHT: info@chrisoei.com
//COPYRIGHT: 
//COPYRIGHT: Permission to use, display, and modify this code
//COPYRIGHT: is hereby granted provided that:
//COPYRIGHT: 
//COPYRIGHT: 1) this notice is included in its entirety
//COPYRIGHT: 2) we are notified of the usage

// RKDemo is a class that demonstrates the use of the RKInt class
// by integrating an ODE of the form
//
// dx[0]/dt = -x[1] - 0.05 x[0]
// dx[1]/dt = x[0]
//

package PhysicsProj;

// import RKInt;
// import Potential;
import PhysicsProj.*;

public class RKDemo extends RKInt {

	public RKDemo(double i_t, double[] i_x, double i_dt) {
		super(i_t,i_x,i_dt);
	}

	protected double[] derivative(double i_t,double[] i_x) {
		double q1 = Potential.chargeOfPoint;  
		double q2 = Potential.chargeOfBottom;  
		double q3 = Potential.chargeOfTop;  
		double x2 = Potential.xBottomCharge;  
		double y2 = Potential.yBottomCharge;
		double x3 = Potential.xTopCharge;
		double y3 = Potential.yTopCharge;  
		
		double dist2;
		double dist3;
		double consta = 1000000.;

		double compx;
		double compy;

		double[] y = new double[4];
		y[0]=i_x[2];
		y[1]=i_x[3];

		dist2 = Math.sqrt(Math.pow(i_x[0]-x2, 2) + Math.pow(i_x[1]-y2, 2));
		dist3 = Math.sqrt(Math.pow(i_x[0]-x3, 2) + Math.pow(i_x[1]-y3, 2));

		compx = q2*(i_x[0] - x2) / Math.pow(dist2,3) + q3* (i_x[0] - x3) / Math.pow(dist3,3);
		compy = q2*(i_x[1] - y2) / Math.pow(dist2,3) + q3*(i_x[1]-y3)/Math.pow(dist3,3);

		//  restrict to one dimensional motion 
		y[2] = consta * q1 * compx;
		y[3] = consta * q1 * compy;
		System.out.println("y[0] = "+y[0] + " y[1] = "+y[1] + " y[2] = "+y[2] + " y[3] = "+y[3]);
		// System.out.println("compx "+ compx + " compy "+ compy);
		return y;
	}
}
