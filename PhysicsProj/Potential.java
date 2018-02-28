
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
import java.awt.event.*;
import javax.swing.*;
import PhysicsProj.*;

// import RKDemo;
// import Circle;
// import Line;

public class Potential extends JApplet implements MouseListener, MouseMotionListener, AdjustmentListener, ActionListener {
	boolean released = false;

	static int height = 600;
	static int width = 900;
	double radiusCharge = 20; //radius of spheres
	double radiusPoint = 10.; //radius of point
	
	static double vx = 0.;
	static double vy = 0.;

	static double xPoint = 300.;
	static double yPoint = height/2;

	static double xBottomCharge = 450; 
	static double yBottomCharge = (height - 150); 

	static double xTopCharge = 450;
	static double yTopCharge = (height - (height-150));

	boolean inAction = false;
	int dx = 10;

	double timeValue = 0;
	double dTime = 475.;

	public double[] x;

	static double chargeOfPoint = -1.0;
	static double chargeOfBottom = 10.0;
	static double chargeOfTop = 10.0;

	int timeMax = 2*369000;

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

	Circle pointCircleObject,bottomChargeCircleObject,topChargeCircleObject;

	public JScrollBar dxScroll = new JScrollBar(JScrollBar.HORIZONTAL,dx,1,1,50);
	public JScrollBar vxScroll = new JScrollBar(JScrollBar.HORIZONTAL,(int)vx,1,0,700);
	public JScrollBar vyScroll = new JScrollBar(JScrollBar.HORIZONTAL,(int)vy,1,0,200);
	public JLabel dxLabel = new JLabel("Faster =   " + dx);
	public JLabel vxLabel = new JLabel("vx = " + vx);
	public JLabel vyLabel = new JLabel("vy = " + vy);
	public JButton restartButton = new JButton("Restart");
	public JButton goButton = new JButton("Go");

	//These are all the default values, mess with them and bear the consequences!
	int defaultDx = dx;
	int defaultNumline = numline;
	double defaultChargeOfPoint = chargeOfPoint;
	double defaultChargeOfBottom = chargeOfBottom;
	double defaultChargeOfTop = chargeOfTop;
	double defaultXPoint = xPoint;
	double defaultYPoint = yPoint;
	double defaultVx = vx;
	double defaultVy = vy;
	double defaultXBottomCharge = xBottomCharge;
	double defaultYBottomCharge = yBottomCharge;
	double defaultXTopCharge = xTopCharge;
	double defaultYTopCharge = yTopCharge;

	public enum ChargeType { POINT, TOP, BOTTOM };

	public void init() {
		setBackground(Color.white);
		/*Sets up the background and foreground colors for
		both the buttons and the scrollbars */
		restartButton.setForeground(Color.black);
		restartButton.setBackground(Color.lightGray);
		goButton.setForeground(Color.black);
		goButton.setBackground(Color.lightGray);
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
		JPanel p = new JPanel();
		p.setLayout(new FlowLayout(FlowLayout.CENTER));
		p.add(dxScroll);
		p.add(dxLabel);
		p.add(vxScroll);
		p.add(vxLabel);
		p.add(vyScroll);
		p.add(vyLabel);
		p.add(goButton);
		p.add(restartButton);
		
		dxScroll.addAdjustmentListener(this);
		vxScroll.addAdjustmentListener(this);
		vyScroll.addAdjustmentListener(this);
		restartButton.addActionListener(this);
		goButton.addActionListener(this);

		addMouseListener(this);
		addMouseMotionListener(this);
		add("North", p);

	}

	public boolean withinBoundariesOfPanel(double x, double y, int margin) {
		return (x >= 0+margin && x <= 900-margin && y >= 30+margin && y <= 600-margin);
	}

	public void drawPoint(Graphics g, double chargeMagnitude, double x, double y, double r) {
		if (chargeMagnitude > 0)
			g.setColor(java.awt.Color.red);
		else
			g.setColor(java.awt.Color.black);
		g.fillOval((int)(x-r/2),(int)(y-r/2),(int)r,(int)r);
	}

	public void drawFieldLines(Graphics g, double xPoint, double yPoint, double xBottomCharge, double yBottomCharge, double xTopCharge, double yTopCharge,
							   double chargeOfPoint, double chargeOfBottom, double chargeOfTop, ChargeType type) {
		Line line = new Line(0.0,0.0,0.0,0.0);
		line.ang = Math.PI/8.;
		comp = 1.;
		istop= 0;
		while(line.ang < 2*Math.PI) {
			//Conditional xPoint, yPoint;
			if (type == ChargeType.POINT) {
				line.sx = xPoint - 10 * Math.cos(line.ang);
				line.sy = yPoint - 10 * Math.sin(line.ang);
			}
			else if (type == ChargeType.TOP) {
				line.sx = xTopCharge + 10 * Math.cos(line.ang);
				line.sy = yTopCharge + 10 * Math.sin(line.ang);
			}
			else if (type == ChargeType.BOTTOM) {
				line.sx = xBottomCharge + 10 * Math.cos(line.ang);
				line.sy = yBottomCharge - 10 * Math.sin(line.ang);
			}

			while(istop < nstop && dist1 > distm && dist2 > distm && dist3 > distm && line.sx < width && line.sy < height ) {
				dist1 = Math.sqrt(Math.pow(line.sx-xPoint, 2) + Math.pow(line.sy-yPoint, 2));
				dist2 = Math.sqrt(Math.pow(line.sx-xBottomCharge, 2) + Math.pow(line.sy-yBottomCharge, 2));
				dist3 = Math.sqrt(Math.pow(line.sx-xTopCharge, 2) + Math.pow(line.sy-yTopCharge, 2));
				distm = 9.;

				compx = chargeOfBottom*(line.sx - xBottomCharge) / Math.pow(dist2,3) + chargeOfPoint *(line.sx - xPoint) / Math.pow(dist1,3) + chargeOfTop* (line.sx - xTopCharge) / Math.pow(dist3,3);
				compy = chargeOfBottom*(line.sy - yBottomCharge) / Math.pow(dist2,3) + chargeOfPoint *(line.sy - yPoint) / Math.pow(dist1,3) + chargeOfTop*(line.sy-yTopCharge)/Math.pow(dist3,3);
				
				if (type == ChargeType.POINT) {
					compx *= -1;
					compy *= -1;
				}
				comp = Math.sqrt(Math.pow(compx,2) + Math.pow (compy,2));

				if (withinBoundariesOfPanel(line.sx, line.sy, 5) &&
					withinBoundariesOfPanel(line.ex, line.ey, 5)) {
					g.setColor(new Color(0,190,0));
					g.drawLine((int)line.sx, (int)line.sy, (int)line.ex, (int)line.ey);
				}

				line.sx = line.ex;
				line.sy = line.ey;
				distm = distmin;
				istop += 1;
			}

			line.ang += Math.PI/4.;
			comp=1.;
			istop=0;
		}
	}


	public void paint(Graphics g) {
		setBackground(java.awt.Color.white);
		
		x = new double[4];

		x[0] = 300;
		x[1] = (height/2);
		x[2] = vx;
		x[3] = vy;

		double[] xold = new double[4];

		xold[0] = x[0];
		xold[1] = x[1]; 
		xold[2] = x[2];
		xold[3] = x[3];

		pointCircleObject = new Circle(0, (int)radiusPoint,(int)xPoint,(int)yPoint);
		bottomChargeCircleObject = new Circle(0, (int)radiusCharge,(int)xBottomCharge,(int)yBottomCharge);
		topChargeCircleObject = new Circle(0, (int)radiusCharge,(int)xTopCharge,(int)yTopCharge);

		RKDemo nint = new RKDemo(timeValue, x, .01);
		Line line = new Line(0.0,0.0,0.0,0.0);

		if(inAction) {
			while (timeValue < timeMax && withinBoundariesOfPanel((double)(xPoint - radiusPoint/2), (double)(yPoint - radiusPoint/2), 5) &&
										  withinBoundariesOfPanel((double)(xPoint + radiusPoint/2), (double)(yPoint + radiusPoint/2), 5)) { 
				comp = 1;

				pointCircleObject.cx = (int)xPoint;
				pointCircleObject.cy = (int)yPoint;

				xPoint = xold[0];
				yPoint = xold[1];

				if (withinBoundariesOfPanel((double)(xPoint - radiusPoint/2), (double)(yPoint - radiusPoint/2), 5) &&
					withinBoundariesOfPanel((double)(xPoint + radiusPoint/2), (double)(yPoint + radiusPoint/2), 5)) {
					drawPoint(g, chargeOfPoint, xPoint, yPoint, radiusPoint);
				}
				// drawPoint(g, chargeOfPoint, xPoint, yPoint, radiusPoint);
				drawPoint(g, chargeOfBottom, xBottomCharge, yBottomCharge, radiusCharge);
				drawPoint(g, chargeOfTop, xTopCharge, yTopCharge, radiusCharge);


				// drawFieldLines(g, xPoint, yPoint, xBottomCharge, yBottomCharge, xTopCharge, yTopCharge, chargeOfPoint, chargeOfBottom, chargeOfTop, ChargeType.POINT);
				// drawFieldLines(g, xPoint, yPoint, xBottomCharge, yBottomCharge, xTopCharge, yTopCharge, chargeOfPoint, chargeOfBottom, chargeOfTop, ChargeType.BOTTOM);
				// drawFieldLines(g, xPoint, yPoint, xBottomCharge, yBottomCharge, xTopCharge, yTopCharge, chargeOfPoint, chargeOfBottom, chargeOfTop, ChargeType.TOP);
	
				// draw field lines for chargeOfPoint
				line.ang = Math.PI/8.;
				comp = 1.;
				istop= 0;
				while(line.ang < 2*Math.PI) {
					line.sx = xPoint - 10 * Math.cos(line.ang);
					line.sy = yPoint - 10 * Math.sin(line.ang);

					dist1 = Math.sqrt(Math.pow(line.sx-xPoint, 2) + Math.pow(line.sy-yPoint, 2));
					dist2 = Math.sqrt(Math.pow(line.sx-xBottomCharge, 2) + Math.pow(line.sy-yBottomCharge, 2));
					dist3 = Math.sqrt(Math.pow(line.sx-xTopCharge, 2) + Math.pow(line.sy-yTopCharge, 2));
					distm = 9.;

					while(istop < nstop && dist1 > distm && dist2 > distm && dist3 > distm && line.sx < width && line.sy < height ) {
						dist1 = Math.sqrt(Math.pow(line.sx-xPoint, 2) + Math.pow(line.sy-yPoint, 2));
						dist2 = Math.sqrt(Math.pow(line.sx-xBottomCharge, 2) + Math.pow(line.sy-yBottomCharge, 2));
						dist3 = Math.sqrt(Math.pow(line.sx-xTopCharge, 2) + Math.pow(line.sy-yTopCharge, 2));

						compx = -(chargeOfBottom*(line.sx - xBottomCharge) / Math.pow(dist2,3) + chargeOfPoint *(line.sx - xPoint) / Math.pow(dist1,3) + chargeOfTop* (line.sx - xTopCharge) / Math.pow(dist3,3));
						compy = -(chargeOfBottom*(line.sy - yBottomCharge) / Math.pow(dist2,3) + chargeOfPoint *(line.sy - yPoint) / Math.pow(dist1,3) + chargeOfTop*(line.sy-yTopCharge)/Math.pow(dist3,3));

						comp = Math.sqrt(Math.pow(compx,2) + Math.pow (compy,2));

						if (comp < emagmin)
							line.ex = line.sx + dx;
						else
							line.ex = line.sx + (compx/comp) * (double)dx;
						if (comp < emagmin)
							line.ey = line.sy + dx;
						else
							line.ey = line.sy + (compy/comp) * (double)dx;

						//Don't draw out of boundary (5 = margin)
						if (withinBoundariesOfPanel(line.sx, line.sy, 5) &&
							withinBoundariesOfPanel(line.ex, line.ey, 5)) {
							g.setColor(new Color(0,190,0));
							g.drawLine((int)line.sx, (int)line.sy, (int)line.ex, (int)line.ey);
						}

						line.sx = line.ex;
						line.sy = line.ey;
						istop += 1;
						distm = distmin;
					}
					line.ang += Math.PI/4.;
					comp=1.;
					istop=0;
				}

				// draw field lines for chargeOfBottom
				line.ang = Math.PI/8.;
				comp = 1;
				istop=0;
				while(line.ang < 2*Math.PI) {
					//line.ang *= (Math.PI/180.);
					line.sx = xBottomCharge + 10 * Math.cos(line.ang);
					line.sy = yBottomCharge - 10 * Math.sin(line.ang);

					dist1 = Math.sqrt(Math.pow(line.sx-xPoint, 2) + Math.pow(line.sy-yPoint, 2));
					dist2 = Math.sqrt(Math.pow(line.sx-xBottomCharge, 2) + Math.pow(line.sy-yBottomCharge, 2));
					dist3 = Math.sqrt(Math.pow(line.sx-xTopCharge, 2) + Math.pow(line.sy-yTopCharge, 2));
					distm = 9.;

					while(istop < nstop && dist1 > distm && dist2 > distm && dist3 > distm && line.sx < width && line.sy < height ) {
						dist1 = Math.sqrt(Math.pow(line.sx-xPoint, 2) + Math.pow(line.sy-yPoint, 2));
						dist2 = Math.sqrt(Math.pow(line.sx-xBottomCharge, 2) + Math.pow(line.sy-yBottomCharge, 2));
						dist3 = Math.sqrt(Math.pow(line.sx-xTopCharge, 2) + Math.pow(line.sy-yTopCharge, 2));

						compx = chargeOfBottom*(line.sx - xBottomCharge) / Math.pow(dist2,3) + chargeOfPoint *(line.sx - xPoint) / Math.pow(dist1,3) + chargeOfTop* (line.sx - xTopCharge) / Math.pow(dist3,3);
						compy = chargeOfBottom*(line.sy - yBottomCharge) / Math.pow(dist2,3) + chargeOfPoint *(line.sy - yPoint) / Math.pow(dist1,3) + chargeOfTop*(line.sy-yTopCharge)/Math.pow(dist3,3);

						comp = Math.sqrt(Math.pow(compx,2) + Math.pow (compy,2));

						if (comp < emagmin)
							line.ex = line.sx - dx;
						else
							line.ex = line.sx + (compx/comp) * (double)dx;
						if (comp < emagmin)
							line.ey = line.sy - dx;
						else
							line.ey = line.sy + (compy/comp) * (double)dx;

						//Don't draw out of boundary (5 = margin)
						if (withinBoundariesOfPanel(line.sx, line.sy, 5) &&
							withinBoundariesOfPanel(line.ex, line.ey, 5)) {
							g.setColor(new Color(0,190,0));
							g.drawLine((int)line.sx, (int)line.sy, (int)line.ex, (int)line.ey);
						}

						line.sx = line.ex;
						line.sy = line.ey;
						distm = distmin;
						istop += 1;
					}
					//	line.ang += 2*Math.PI/(chargeOfBottom*numline);
					line.ang += Math.PI/4.;
					comp=1.;
					istop=0;
				}

				// draw field lines for chargeOfTop
				line.ang =Math.PI/8.; 
				comp = 1;
				istop=0;
				while(line.ang < 2*Math.PI) {
					line.sx = xTopCharge + 10 * Math.cos(line.ang);
					line.sy = yTopCharge + 10 * Math.sin(line.ang);

					dist1 = Math.sqrt(Math.pow(line.sx-xPoint, 2) + Math.pow(line.sy-yPoint, 2));
					dist2 = Math.sqrt(Math.pow(line.sx-xBottomCharge, 2) + Math.pow(line.sy-yBottomCharge, 2));
					dist3 = Math.sqrt(Math.pow(line.sx-xTopCharge, 2) + Math.pow(line.sy-yTopCharge, 2));
					distm = 9.;

					while(istop < nstop && dist1 > distm && dist2 > distm && dist3 > distm && line.sx < width && line.sy < height ) {
						dist1 = Math.sqrt(Math.pow(line.sx-xPoint, 2) + Math.pow(line.sy-yPoint, 2));
						dist2 = Math.sqrt(Math.pow(line.sx-xBottomCharge, 2) + Math.pow(line.sy-yBottomCharge, 2));
						dist3 = Math.sqrt(Math.pow(line.sx-xTopCharge, 2) + Math.pow(line.sy-yTopCharge, 2));

						compx = chargeOfBottom*(line.sx - xBottomCharge) / Math.pow(dist2,3) + chargeOfPoint *(line.sx - xPoint) / Math.pow(dist1,3) + chargeOfTop* (line.sx - xTopCharge) / Math.pow(dist3,3);
						compy = chargeOfBottom*(line.sy - yBottomCharge) / Math.pow(dist2,3) + chargeOfPoint *(line.sy - yPoint) / Math.pow(dist1,3) + chargeOfTop*(line.sy-yTopCharge)/Math.pow(dist3,3);

						comp = Math.sqrt(Math.pow(compx,2) + Math.pow (compy,2));

						if (comp < emagmin)
							line.ex = line.sx + dx;
						else
							line.ex = line.sx + (compx/comp) * (double)dx;
						if (comp < emagmin)
							line.ey = line.sy + dx;
						else
							line.ey = line.sy + (compy/comp) * (double)dx;

						//Don't draw out of boundary (5 = margin)
						if (withinBoundariesOfPanel(line.sx, line.sy, 5) &&
							withinBoundariesOfPanel(line.ex, line.ey, 5)) {
							g.setColor(new Color(0,190,0));
							g.drawLine((int)line.sx, (int)line.sy, (int)line.ex, (int)line.ey);
						}

						line.sx = line.ex;
						line.sy = line.ey;
						distm = distmin;
						istop+=1;
					}
					line.ang += Math.PI/4.;
					istop=0;
					distm = distmin;
				}
				bconecx = pointCircleObject.cx;
				bconecy = pointCircleObject.cy;

				nint.iterate();
				xold[0] = nint.x[0];
				xold[1] = nint.x[1];
				xold[2] = nint.x[2];
				xold[3] = nint.x[3];

				timeValue += dTime;

				//reset point everytime (to similute movement)
				g.setColor(java.awt.Color.white);
				g.fillRect(0,30,1000,700);
			}
		}

		g.setColor(java.awt.Color.white);
		g.fillRect(0,30,1000,700);

		// Cast ints as double
		if (withinBoundariesOfPanel((double)(xPoint - radiusPoint/2), (double)(yPoint - radiusPoint/2), 5) &&
			withinBoundariesOfPanel((double)(xPoint + radiusPoint/2), (double)(yPoint + radiusPoint/2), 5)) {
			drawPoint(g, chargeOfPoint, xPoint, yPoint, radiusPoint);
		}
		drawPoint(g, chargeOfBottom, xBottomCharge, yBottomCharge, radiusCharge);
		drawPoint(g, chargeOfTop, xTopCharge, yTopCharge, radiusCharge);
	}

	public void mouseClicked (MouseEvent mouseEvent) {
		int mouseX = mouseEvent.getX();
		int mouseY = mouseEvent.getY();
		System.out.println(mouseX + ", " + mouseY);
	}

	public void mouseDragged(MouseEvent mouseEvent) {
		int mouseX = mouseEvent.getX();
		int mouseY = mouseEvent.getY();
		if (mouseX < xBottomCharge + radiusCharge && mouseX > xBottomCharge - radiusCharge &&
			mouseY < yBottomCharge + radiusCharge && mouseY > yBottomCharge -radiusCharge) {
			bottomChargeCircleObject.hit = 1;
			xBottomCharge = mouseX;
			yBottomCharge = mouseY;
			repaint();
		}
		if (mouseX < xTopCharge + radiusCharge && mouseX > xTopCharge - radiusCharge &&
			mouseY < yTopCharge + radiusCharge && mouseY > yTopCharge -radiusCharge) {
			topChargeCircleObject.hit = 1;
			xTopCharge = mouseX;
			yTopCharge = mouseY;
			repaint();
		}
	}

	public void mouseReleased (MouseEvent mouseEvent) {
		System.out.println("Mouse Released");
		bottomChargeCircleObject.hit = 0;
		topChargeCircleObject.hit = 0;
	} 

	public void mousePressed (MouseEvent mouseEvent) { }
	public void mouseEntered (MouseEvent mouseEvent) {}
	public void mouseExited (MouseEvent mouseEvent) {}
	public void mouseMoved(MouseEvent mouseEvent) {}	

	public void adjustmentValueChanged(AdjustmentEvent e) {
		Object target = e.getSource();
		if(target == dxScroll) {
			dx = dxScroll.getValue();
			dxLabel.setText("Faster =  " + dx);
		}
		else if(target == vxScroll) {
			vx = (double)vxScroll.getValue();
			vxLabel.setText("vx = " +vx);
		}
		else if(target == vyScroll) {
			vy = (double)vyScroll.getValue();
			vyLabel.setText("vy = " +vy);
		}
	}

	public void actionPerformed(ActionEvent e) {
		Object target = e.getSource();
		if(target == restartButton) {
			bottomChargeCircleObject.hit = 0;
			topChargeCircleObject.hit = 0;
			xPoint = defaultXPoint;
			yPoint = defaultYPoint;
			xBottomCharge = defaultXBottomCharge;
			yBottomCharge = defaultYBottomCharge;
			xTopCharge = defaultXTopCharge;
			yTopCharge = defaultYTopCharge;
			pointCircleObject.cx = (int)defaultXPoint;
			pointCircleObject.cy = (int)defaultYPoint;
			bottomChargeCircleObject.cx = (int)defaultXBottomCharge;
			bottomChargeCircleObject.cy = (int)defaultYBottomCharge;
			topChargeCircleObject.cx = (int)defaultXTopCharge;
			topChargeCircleObject.cy = (int)defaultYTopCharge;
			timeValue = 0;
			numline = defaultNumline;
			System.out.println("Restart");
			repaint();
			inAction = false;
		}
		else if(target == goButton) {
			timeValue = 0;
			inAction = true;
			System.out.println("inAction");
			repaint();
		}
	}
}
