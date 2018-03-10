
// $AISD_VERSION:RKInt.java@1.1/home/coei/arc/archive%shell3.ba.best.com$

//COPYRIGHT: 
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

package PhysicsProj;

public abstract class RKInt 
{
    public double t;
    public double[] x;
    double[] k1,k2,k3,k4;
    public double dt;
    int n;

public RKInt(double i_t, double[] i_x, double i_dt)
    {
	int j;
	t=i_t;
	dt=i_dt;
	n=i_x.length;
	x = new double[n];
	for (j=0;j<n;j++)
	x[j]=i_x[j];
    }

protected abstract double[] derivative(double i_t,double[] i_x);

public void iterate()
   { 
	int i;
	double[] x1 = new double[n];

	k1 = derivative(t,x);
		
	System.out.println("x: " + x[0] + ", " + x[1] + ", " + x[2] + ", " + x[3]);
	System.out.println("k1: " + k1[0] + ", " + k1[1] + ", " + k1[2] + ", " + k1[3]);
	for (i=0;i<n;i++)
	    x1[i]=x[i]+dt*k1[i]/2.0;
	System.out.println("x1: " + x1[0] + ", " + x1[1] + ", " + x1[2] + ", " + x1[3]);
	k2 = derivative(t+dt/2,x1);

	for (i=0;i<n;i++)
	    x1[i]=x[i]+dt*k2[i]/2.0;

	k3 = derivative(t+dt/2,x1);

	for (i=0;i<n;i++)
  	    x1[i]=x[i]+dt*k3[i];

	k4 = derivative(t+dt,x1);

	for (i=0;i<n;i++)
	    x[i]+=dt/6.0*(k1[i]+2.0*k2[i]+2.0*k3[i]+k4[i]);
	t+=dt;
    }
}
