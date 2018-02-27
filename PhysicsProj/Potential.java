
// $AISD_VERSION:NumDemo.java@1.2/home/coei/arc/archive%shell3.ba.best.com$

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

import java.applet.*;
import java.awt.Graphics;
import java.awt.*;
import PhysicsProj.*;

// import RKDemo;
// import Circle;
// import Line;

public class Potential extends Applet 
{
    static int height = 600;
    static int width = 900;
    double r1 = 20;
    double rs = 10.;
    static double velocx = 0.;
    static double velocy = 0.;

    static double x1 = 300.;
    static double y1 = height/2;

    static double x2 = 450; 
    static double y2 = (height - 150); 

    static double x3 = 450;
    static double y3 = (height - (height-150));

    boolean go = false;
    int dx =10;

    double tim = 0;
    double dtim=475.;

    public double[] x;

    static double q1 = -1.0;
    static double q2 = 10.0;
    static double q3 = 10.0;

    int maxtim = 2*369000;

    int bconecx;
    int bconecy;

    double dist1;
    double dist2;
    double dist3;

    double compx, compy, comp;
    int istop;
    int nstop = 60;
    double dummy = 0.;

    int numline = 4;
    double distmin =5.;
    double distm;
    static double emagmin = .00000001;

    int si = 0;
    int sii = 0;

    Circle cone,ctwo,cthree;

    Scrollbar dxScroll = new Scrollbar(Scrollbar.HORIZONTAL,dx,1,5,50);
    Scrollbar vxScroll = new Scrollbar(Scrollbar.HORIZONTAL,(int)velocx,1,0,700);
    Scrollbar vyScroll = new Scrollbar(Scrollbar.HORIZONTAL,(int)velocy,1,0,200);

    public Label dxLabel = new Label("Faster =   "+dx);
    public Label vxLabel = new Label("vx = " +velocx);
    public Label vyLabel = new Label("vy = " +velocy);

    Button restartbutton = new Button("Restart"), gobutton = new Button("Go");


//These are all the backup values, mess with them and bear the consequences!

    double bq1 = q1;
    double bq2 = q2;
    double bq3 = q3;
   
    int bdx = dx;
    int bnumline = numline;

    double bx1 = x1;
    double by1 = y1;

    double bvelocx = velocx;
    double bvelocy = velocy;

    double bx2 = x2;
    double by2 = y2;

    double bx3 = x3;
    double by3 = y3;

// End of backup values, have a nice day!

public void init()
    {
    setBackground(Color.white);

    /*Sets up the background and foreground colors for
    both the buttons and the scrollbars */

    restartbutton.setForeground(Color.black);
    restartbutton.setBackground(Color.lightGray);

    gobutton.setForeground(Color.black);
    gobutton.setBackground(Color.lightGray);

    dxScroll.setForeground(Color.black);
    dxScroll.setBackground(Color.lightGray);

    vxScroll.setForeground(Color.black);
    vxScroll.setBackground(Color.lightGray);

    vyScroll.setForeground(Color.black);
    vyScroll.setBackground(Color.lightGray);


    /*Creates a new layout manager, and groups the buttons
    and scrollbars into panels, which are then placed on
    the North and South sectors of the applet. */

    setLayout(new BorderLayout());
    Panel p = new Panel();
    p.setLayout(new FlowLayout(FlowLayout.CENTER));

    p.add(dxScroll);
    p.add(dxLabel);

    p.add(vxScroll);
    p.add(vxLabel);

    p.add(vyScroll);
    p.add(vyLabel);

    p.add(gobutton);
    p.add(restartbutton);
    add("North",p);

    }

public void paint(Graphics g)
    {
	setBackground(java.awt.Color.white);
	
        x = new double[4];

	x[0]=300;
	x[1]=(height/2);
	x[2]=velocx;
        x[3]=velocy;

        double[] xold=new double[4];

	xold[0]=x[0];
	xold[1]=x[1]; 
	xold[2]=x[2];
   	xold[3]=x[3];

	cone = new Circle(0, (int)rs,(int)x1,(int)y1);
	ctwo = new Circle(0, (int)r1,(int)x2,(int)y2);
	cthree = new Circle(0, (int)r1,(int)x3,(int)y3);

	RKDemo nint=new RKDemo(tim,x,.01);
	Line line=new Line(0.0,0.0,0.0,0.0);

	if(go==true)
      {
		while(tim<maxtim && x1 > -300. && x1 < width+600 && y1 > 0. && y1 < height )
		   {    
    			comp = 1;

			cone.cx = (int)x1;
			cone.cy = (int)y1;

			x1 = xold[0];
			y1 = xold[1];

			if(q1 < 0)
			    {
			    g.setColor(java.awt.Color.black);
			    g.fillOval((int)(x1-rs/2),(int)(y1-rs/2),(int)rs,(int)rs);
			    }
			else if(q1 > 0)
			    {
			    g.setColor(java.awt.Color.red);
			    g.fillOval((int)(x1-rs/2),(int)(y1-rs/2),(int)rs,(int)rs);
			    }

		   	if(q2 < 0)
			    {
			    g.setColor(java.awt.Color.black);
			    g.fillOval((int)(x2-r1/2),(int)(y2-r1/2),(int)r1,(int)r1);
			    }
			else if(q2 > 0)
			    {
			    g.setColor(java.awt.Color.red);
			    g.fillOval((int)(x2-r1/2),(int)(y2-r1/2),(int)r1,(int)r1);
			    }

			if(q3 < 0)
			    {
			    g.setColor(java.awt.Color.black);
			    g.fillOval((int)(x3-r1/2),(int)(y3-r1/2),(int)r1,(int)r1);
			    }
			else if(q3 > 0)
			    {
			    g.setColor(java.awt.Color.red);
			    g.fillOval((int)(x3-r1/2),(int)(y3-r1/2),(int)r1,(int)r1);
			    }
//  draw field lines for q1
	    line.ang = Math.PI/8.;
	    comp = 1.;
	    istop= 0;

    	    while(line.ang < 2*Math.PI)
         	{
        	    line.sx = x1 - 10 * Math.cos(line.ang);
        	    line.sy = y1 - 10 * Math.sin(line.ang);

                    dist1 = Math.sqrt(Math.pow(line.sx-x1, 2) + Math.pow(line.sy-y1, 2));
		    dist2 = Math.sqrt(Math.pow(line.sx-x2, 2) + Math.pow(line.sy-y2, 2));
                    dist3 = Math.sqrt(Math.pow(line.sx-x3, 2) + Math.pow(line.sy-y3, 2));
                    distm=9.;

           	    while(istop < nstop && dist1 > distm && dist2 > distm && dist3 > distm && line.sx > 0 && line.sx < width && line.sy > 0 && line.sy < height )
                	{
                	dist1 = Math.sqrt(Math.pow(line.sx-x1, 2) + Math.pow(line.sy-y1, 2));
                	dist2 = Math.sqrt(Math.pow(line.sx-x2, 2) + Math.pow(line.sy-y2, 2));
                        dist3 = Math.sqrt(Math.pow(line.sx-x3, 2) + Math.pow(line.sy-y3, 2));

                	compx = -(q2*(line.sx - x2) / Math.pow(dist2,3) + q1 *(line.sx - x1) / Math.pow(dist1,3) + q3* (line.sx - x3) / Math.pow(dist3,3));
                	compy = -(q2*(line.sy - y2) / Math.pow(dist2,3) + q1 *(line.sy - y1) / Math.pow(dist1,3) + q3*(line.sy-y3)/Math.pow(dist3,3));

                	comp = Math.sqrt(Math.pow(compx,2) + Math.pow (compy,2));

                        if(comp < emagmin) line.ex = line.sx +dx;
                        else   line.ex = line.sx + (compx/comp) * (double)dx;
                        if(comp < emagmin) line.ey = line.sy +dx;
                        else   line.ey = line.sy + (compy/comp) * (double)dx;

                	g.setColor(new Color(0,190,0));
                	g.drawLine((int)line.sx, (int)line.sy, (int)line.ex, (int)line.ey);

                	line.sx = line.ex;
                	line.sy = line.ey;
                        istop += 1;
                        distm = distmin;
                	}
                    line.ang += Math.PI/4.;
                    comp=1.;
                    istop=0;
		}

//draw field lines for q2
	    line.ang = Math.PI/8.;
 	    comp = 1;
            istop=0;
    	    while(line.ang < 2*Math.PI)
         	{
	    	    //line.ang *= (Math.PI/180.);

        	    line.sx = x2 + 10 * Math.cos(line.ang);
        	    line.sy = y2 - 10 * Math.sin(line.ang);

                    dist1 = Math.sqrt(Math.pow(line.sx-x1, 2) + Math.pow(line.sy-y1, 2));
		    dist2 = Math.sqrt(Math.pow(line.sx-x2, 2) + Math.pow(line.sy-y2, 2));
                    dist3 = Math.sqrt(Math.pow(line.sx-x3, 2) + Math.pow(line.sy-y3, 2));
                    distm = 9.;

             	    while(istop < nstop && dist1 > distm && dist2 > distm && dist3 > distm && line.sx < width && line.sy < height )

                	{
                	dist1 = Math.sqrt(Math.pow(line.sx-x1, 2) + Math.pow(line.sy-y1, 2));
                	dist2 = Math.sqrt(Math.pow(line.sx-x2, 2) + Math.pow(line.sy-y2, 2));
                        dist3 = Math.sqrt(Math.pow(line.sx-x3, 2) + Math.pow(line.sy-y3, 2));

                	compx = q2*(line.sx - x2) / Math.pow(dist2,3) + q1 *(line.sx - x1) / Math.pow(dist1,3) + q3* (line.sx - x3) / Math.pow(dist3,3);
                	compy = q2*(line.sy - y2) / Math.pow(dist2,3) + q1 *(line.sy - y1) / Math.pow(dist1,3) + q3*(line.sy-y3)/Math.pow(dist3,3);

                	comp = Math.sqrt(Math.pow(compx,2) + Math.pow (compy,2));

                        if(comp < emagmin) line.ex = line.sx -dx;
                        else   line.ex = line.sx + (compx/comp) * (double)dx;
                        if(comp < emagmin) line.ey = line.sy -dx;
                        else   line.ey = line.sy + (compy/comp) * (double)dx;

                	g.setColor(new Color(0,190,0));
                	g.drawLine((int)line.sx, (int)line.sy, (int)line.ex, (int)line.ey);

                	line.sx = line.ex;
                	line.sy = line.ey;
                        distm = distmin;
                        istop += 1;
                	}
//	line.ang += 2*Math.PI/(q2*numline);
			line.ang += Math.PI/4.;
                        comp=1.;
                        istop=0;
        	}
//  draw field lines for q3
  	    line.ang =Math.PI/8.; 
	    comp = 1;
            istop=0;
    	    while(line.ang < 2*Math.PI)
         	{

        	    line.sx = x3 + 10 * Math.cos(line.ang);
        	    line.sy = y3 + 10 * Math.sin(line.ang);

                    dist1 = Math.sqrt(Math.pow(line.sx-x1, 2) + Math.pow(line.sy-y1, 2));
		    dist2 = Math.sqrt(Math.pow(line.sx-x2, 2) + Math.pow(line.sy-y2, 2));
                    dist3 = Math.sqrt(Math.pow(line.sx-x3, 2) + Math.pow(line.sy-y3, 2));
			comp = 1;
                    distm=9.;

             	    while(istop < nstop && dist1 > distm && dist2 > distm && dist3 > distm && line.sx < width && line.sy < height )

                	{
                	dist1 = Math.sqrt(Math.pow(line.sx-x1, 2) + Math.pow(line.sy-y1, 2));
                	dist2 = Math.sqrt(Math.pow(line.sx-x2, 2) + Math.pow(line.sy-y2, 2));
                        dist3 = Math.sqrt(Math.pow(line.sx-x3, 2) + Math.pow(line.sy-y3, 2));

                	compx = q2*(line.sx - x2) / Math.pow(dist2,3) + q1 *(line.sx - x1) / Math.pow(dist1,3) + q3* (line.sx - x3) / Math.pow(dist3,3);
                	compy = q2*(line.sy - y2) / Math.pow(dist2,3) + q1 *(line.sy - y1) / Math.pow(dist1,3) + q3*(line.sy-y3)/Math.pow(dist3,3);

                	comp = Math.sqrt(Math.pow(compx,2) + Math.pow (compy,2));

                        if(comp < emagmin) line.ex = line.sx +dx;
                        else   line.ex = line.sx + (compx/comp) * (double)dx;
                        if(comp < emagmin) line.ey = line.sy +dx;
                        else   line.ey = line.sy + (compy/comp) * (double)dx;

                	g.setColor(new Color(0,190,0));
                	g.drawLine((int)line.sx, (int)line.sy, (int)line.ex, (int)line.ey);

                	line.sx = line.ex;
                	line.sy = line.ey;
                        istop+=1;
                	}
	  		line.ang += Math.PI/4.;
                        istop=0;
                        distm = distmin;
        	}
  	    bconecx = cone.cx;
	    bconecy = cone.cy;

	    nint.iterate();
	    xold[0]=nint.x[0]; xold[1]=nint.x[1];xold[2]=nint.x[2];xold[3]=nint.x[3];

	    tim+=dtim;

	    g.setColor(java.awt.Color.white);
	    g.fillOval((int)(x1-rs/2),(int)(y1-rs/2),(int)rs,(int)rs);
	    g.fillRect(0,30,900,600);
    	 	    }  	   
 	    }

	if(q1 < 0)
	    {
	    g.setColor(java.awt.Color.black);
	    g.fillOval((int)(x1-rs/2.),(int)(y1-rs/2),(int)rs,(int)rs);
	    }
	else if(q1 > 0)
	    {
	    g.setColor(java.awt.Color.red);
	    g.fillOval((int)(x1-rs/2),(int)(y1-rs/2),(int)rs,(int)rs);
	    }

	if(q2 < 0)
	    {
	    g.setColor(java.awt.Color.black);
	    g.fillOval((int)(x2-r1/2),(int)(y2-r1/2),(int)r1,(int)r1);
	    }
	else if(q2 > 0)
	    {
	    g.setColor(java.awt.Color.red);
	    g.fillOval((int)(x2-r1/2),(int)(y2-r1/2),(int)r1,(int)r1);
	    }

	if(q3 < 0)
	    {
	    g.setColor(java.awt.Color.black);
	    g.fillOval((int)(x3-r1/2),(int)(y3-r1/2),(int)r1,(int)r1);
	    }
	else if(q3 > 0)
	    {
	    g.setColor(java.awt.Color.red);
	    g.fillOval((int)(x3-r1/2),(int)(y3-r1/2),(int)r1,(int)r1);
	    }

    }

public boolean mouseDown(Event e, int x, int y)
    {

/*
    if (x < ctwo.cx + r1 && x > ctwo.cx - r1 && y < ctwo.cy + r1 && y > ctwo.cy -r1)   
	{
	ctwo.hit = 1;
	System.out.println("Belt points left,  !");
	}

    if (x < cthree.cx + r1 && x > cthree.cx - r1 && y < cthree.cy + r1 && y > cthree.cy -r1)   
	{
	cthree.hit = 1;
	System.out.println("Belt points right, you're alright!");
	}
*/
    if (x < x2 + r1/2 && x > x2 - r1/2 && y < y2 + r1/2 && y > y2 -r1/2)   
	{
	ctwo.hit = 1;
	System.out.println("Belt points left,  !");
	}

    if (x < x3 + r1/2 && x > x3 - r1/2 && y < y3 + r1/2 && y > y3 -r1/2)   
	{
	cthree.hit = 1;
	System.out.println("Belt points right, you're alright!");
	}

    return true;
    }

public boolean mouseUp(Event e, int x, int y)
    {
    ctwo.hit = 0;
    cthree.hit = 0;
    return true;
    }

public boolean mouseDrag(Event e, int x, int y)
    {
    //if (ctwo.hit == 1)  {ctwo.cx = x; ctwo.cy = y; repaint(); }
    //if (cthree.hit == 1)  {cthree.cx = x; cthree.cy = y; repaint(); }

    if (ctwo.hit == 1)    {x2 = x; y2 = y;repaint(); }
    if (cthree.hit == 1)  {x3 = x; y3 = y;repaint(); }
    return true;
    }

public boolean handleEvent(Event e)
    {
    Object target=e.target;

    if(target==dxScroll)
        {
        dx = dxScroll.getValue();
        dxLabel.setText("Faster =  " + dx);
	}
    else if(target==vxScroll)
        {
        velocx = (double)vxScroll.getValue();
        vxLabel.setText("vx = " +velocx);
        }
    else if(target==vyScroll)
        {
        velocy = (double)vyScroll.getValue();
        vyLabel.setText("vy = " +velocy);
        }

    if (e.id==Event.ACTION_EVENT)
        {

        if(target==restartbutton)
            {
            ctwo.hit = 0;
	    cthree.hit = 0;

//          velocx = bvelocx;
//          velocy = bvelocy;

            x1 = bx1;
            y1 = by1;

            x2 = bx2;
            y2 = by2;

	    x3 = bx3;
    	    y3 = by3;

	    cone.cx = (int)bx1;
            cone.cy = (int)by1;

            ctwo.cx = (int)bx2;
            ctwo.cy = (int)by2;
 
	    cthree.cx = (int)bx3;
	    cthree.cy = (int)by3;

            tim = 0;

//          q1 = bq1;

            numline = bnumline;
//         dx = bdx;

//          dxScroll.setValue(bdx);

//	    vxScroll.setValue((int)bvelocx);
//          dxLabel.setText("Faster =  " + bdx);
//   vxLabel.setText("vx = " + velocx);

	    repaint();
            go = false;
            }

        else if(target==gobutton)
            {
            go = true;
	    repaint();
           }
        }
        return super.handleEvent(e);
    }
}
