// require('RKDemo.js');
// require('Circle.js')

/*** Simulation Variables ***/
var height = 600;
var width = 900;
var radiusCharge = 20; //radius of spheres
var radiusPoint = 10.; //radius of point
var vx = 0.;
var vy = 0.;
var xPoint = 300.;
var yPoint = height/2;
var xBottomCharge = 450; 
var yBottomCharge = (height - 150); 
var xTopCharge = 450;
var yTopCharge = (height - (height-150));
var inAction = false;
var dx = 10;
var timeValue = 0;
var dTime = 475.;
var chargeOfPoint = -1.0;
var chargeOfBottom = 10.0;
var chargeOfTop = 10.0;

var timeMax = 2*369000;

var bconecx;
var bconecy;

var dist1;
var dist2;
var dist3;

var compx, compy, comp;
var istop;
var nstop = 60;
var dummy = 0.;

var numline = 4;
var distmin =5.;
var distm;
var emagmin = .00000001;

var si = 0;
var sii = 0;

var pointCircleObject, bottomChargeCircleObject, topChargeCircleObject;



/*** For Testing Purposes ***/
// x = new Array(4);
// x[0] = 300;
// x[1] = 300; // height/2;
// x[2] = 300.0; //vx
// x[3] = 50.0; //vy
// var nint = new RKDemo(100, x, .01);
// nint.setPotentialValues(-1.0, 10.0, 10.0, 450, 450, 450, 150);
// function test() {
// 	console.log("Calling test()...");
// 	nint.iterate();
// }
/*** End ***/


function drawPoint(context, chargeMagnitude, x, y, r) {
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI);
	if (chargeMagnitude > 0)
		context.fillStyle = 'red';
	else
		context.fillStyle = 'black';
	context.fill();
	context.stroke();
}

function drawLine(context, color, x1, y1, x2, y2) {
	context.beginPath();
	context.strokeStyle = color;
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
}

function withinBoundariesOfPanel(x, y, margin) {
	return (x >= 0+margin && x <= 900-margin && y >= 30+margin && y <= 600-margin);
}

function iterateSimulation(canvas, context) {
	var x = new Array(4);
	x[0] = 300;
	x[1] = (height/2);
	x[2] = vx;
	x[3] = vy;

	var xold = new Array(4);
	xold[0] = x[0];
	xold[1] = x[1];
	xold[2] = x[2];
	xold[3] = x[3];

	pointCircleObject = new Circle(0, radiusPoint, xPoint, yPoint);
	bottomChargeCircleObject = new Circle(0, radiusCharge,xBottomCharge,yBottomCharge);
	topChargeCircleObject = new Circle(0, radiusCharge,xTopCharge,yTopCharge);

	var nint = new RKDemo(timeValue, x, .01);
	nint.setPotentialValues(chargeOfPoint, chargeOfBottom, chargeOfTop, xBottomCharge, yBottomCharge, xTopCharge, yTopCharge);
	var line = new Line(0.0,0.0,0.0,0.0);
	
	if (inAction) {
		while (timeValue < timeMax && withinBoundariesOfPanel((xPoint - radiusPoint/2), (yPoint - radiusPoint/2), 5) &&
									  withinBoundariesOfPanel((xPoint + radiusPoint/2), (yPoint + radiusPoint/2), 5)) { 
			comp = 1;
			pointCircleObject.cx = xPoint;
			pointCircleObject.cy = yPoint;

			xPoint = xold[0];
			yPoint = xold[1];

			if (withinBoundariesOfPanel((xPoint - radiusPoint/2), (yPoint - radiusPoint/2), 5) &&
				withinBoundariesOfPanel((xPoint + radiusPoint/2), (yPoint + radiusPoint/2), 5)) {
					// console.log("xPoint: " + xPoint);
					drawPoint(context, chargeOfPoint, xPoint, yPoint, radiusPoint);
			}

			drawPoint(context, chargeOfBottom, xBottomCharge, yBottomCharge, radiusCharge);
			drawPoint(context, chargeOfTop, xTopCharge, yTopCharge, radiusCharge);

			line.ang = Math.PI/8.;
			comp = 1.;
			istop = 0;

			// draw field lines for pointCharge
			while (line.ang < 2*Math.PI) {
				console.log("line.ang: " + line.ang);
				line.sx = xPoint - 10 * Math.cos(line.ang);
				line.sy = yPoint - 10 * Math.sin(line.ang);

				dist1 = Math.sqrt(Math.pow(line.sx-xPoint, 2) + Math.pow(line.sy-yPoint, 2));
				dist2 = Math.sqrt(Math.pow(line.sx-xBottomCharge, 2) + Math.pow(line.sy-yBottomCharge, 2));
				dist3 = Math.sqrt(Math.pow(line.sx-xTopCharge, 2) + Math.pow(line.sy-yTopCharge, 2));
				distm = 9.;

				while (istop < nstop && dist1 > distm && dist2 > distm && dist3 > distm && line.sx < width && line.sy < height ) {
					dist1 = Math.sqrt(Math.pow(line.sx-xPoint, 2) + Math.pow(line.sy-yPoint, 2));
					dist2 = Math.sqrt(Math.pow(line.sx-xBottomCharge, 2) + Math.pow(line.sy-yBottomCharge, 2));
					dist3 = Math.sqrt(Math.pow(line.sx-xTopCharge, 2) + Math.pow(line.sy-yTopCharge, 2));

					compx = -(chargeOfBottom*(line.sx - xBottomCharge) / Math.pow(dist2,3) + chargeOfPoint *(line.sx - xPoint) / Math.pow(dist1,3) + chargeOfTop* (line.sx - xTopCharge) / Math.pow(dist3,3));
					compy = -(chargeOfBottom*(line.sy - yBottomCharge) / Math.pow(dist2,3) + chargeOfPoint *(line.sy - yPoint) / Math.pow(dist1,3) + chargeOfTop*(line.sy-yTopCharge)/Math.pow(dist3,3));

					comp = Math.sqrt(Math.pow(compx,2) + Math.pow (compy,2));

					if (comp < emagmin)
						line.ex = line.sx + dx;
					else
						line.ex = line.sx + (compx/comp) * dx;
					if (comp < emagmin)
						line.ey = line.sy + dx;
					else
						line.ey = line.sy + (compy/comp) * dx;

					if (withinBoundariesOfPanel(line.sx, line.sy, 5) &&
						withinBoundariesOfPanel(line.ex, line.ey, 5)) {
						drawLine(context, '#00BE00', line.sx, line.sy, line.ex, line.ey);
					}

					line.sx = line.ex;
					line.sy = line.ey;
					istop += 1;
					distm = distmin;
				}
				line.ang += Math.PI/4.;
				comp = 1.;
				istop = 0;
			}

			// draw field lines for chargeOfBottom
			// draw field lines for chargeOfTop

			bconecx = pointCircleObject.cx;
			bconecy = pointCircleObject.cy;

			nint.iterate();
			xold[0] = nint.x[0];
			xold[1] = nint.x[1];
			xold[2] = nint.x[2];
			xold[3] = nint.x[3];

			timeValue += dTime;

			//reset (to simulate movement)
			// g.setColor(java.awt.Color.white);
			// g.fillRect(0,30,1000,700);
			context.clearRect(0, 0, canvas.width, canvas.height);
		}

		context.clearRect(0, 0, canvas.width, canvas.height);
		if (withinBoundariesOfPanel((xPoint - radiusPoint/2), (yPoint - radiusPoint/2), 5) &&
			withinBoundariesOfPanel((xPoint + radiusPoint/2), (yPoint + radiusPoint/2), 5)) {
			drawPoint(context, chargeOfPoint, xPoint, yPoint, radiusPoint);
		}
		drawPoint(context, chargeOfBottom, xBottomCharge, yBottomCharge, radiusCharge);
		drawPoint(context, chargeOfTop, xTopCharge, yTopCharge, radiusCharge);
	}

	// nint.iterate();
	// console.log(x);
}