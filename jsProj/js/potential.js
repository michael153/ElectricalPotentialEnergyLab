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

var defaultDx = dx;
var defaultNumline = numline;
var defaultChargeOfPoint = chargeOfPoint;
var defaultChargeOfBottom = chargeOfBottom;
var defaultChargeOfTop = chargeOfTop;
var defaultXPoint = xPoint;
var defaultYPoint = yPoint;
var defaultVx = vx;
var defaultVy = vy;
var defaultXBottomCharge = xBottomCharge;
var defaultYBottomCharge = yBottomCharge;
var defaultXTopCharge = xTopCharge;
var defaultYTopCharge = yTopCharge;



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


/*** Reset Methods ***/
function resetHits() {
	bottomChargeCircleObject.hit = 0;
	topChargeCircleObject.hit = 0;
}

function reset() {
	context.strokeStyle = 'black';
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function hardReset() {
	xPoint = defaultXPoint;
	yPoint = defaultYPoint;
	xBottomCharge = defaultXBottomCharge;
	yBottomCharge = defaultYBottomCharge;
	xTopCharge = defaultXTopCharge;
	yTopCharge = defaultYTopCharge;
	pointCircleObject.cx = defaultXPoint;
	pointCircleObject.cy = defaultYPoint;
	bottomChargeCircleObject.cx = defaultXBottomCharge;
	bottomChargeCircleObject.cy = defaultYBottomCharge;
	topChargeCircleObject.cx = defaultXTopCharge;
	topChargeCircleObject.cy = defaultYTopCharge;
	timeValue = 0;
	resetHits();
	repaint();
}

function repaint() {
	reset();
	drawSetup();
}

/*** Draw Methods ***/
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

function drawSetup() {
	if (withinBoundariesOfPanel((xPoint - radiusPoint/2), (yPoint - radiusPoint/2), 5) &&
		withinBoundariesOfPanel((xPoint + radiusPoint/2), (yPoint + radiusPoint/2), 5)) {
			drawPoint(context, chargeOfPoint, xPoint, yPoint, radiusPoint);
	}

	drawPoint(context, chargeOfBottom, xBottomCharge, yBottomCharge, radiusCharge);
	drawPoint(context, chargeOfTop, xTopCharge, yTopCharge, radiusCharge);
}

/*** Simulation Methods ***/
function checkDragSphere(ex, ey, type) {
	if (type == "bottom") {
		if (ex < xBottomCharge + radiusCharge && ex > xBottomCharge - radiusCharge &&
			ey < yBottomCharge + radiusCharge && ey > yBottomCharge - radiusCharge) {
			bottomChargeCircleObject.hit = 1;
			xBottomCharge = ex;
			yBottomCharge = ey;
			console.log("bottom hit");
			repaint();
		}
	}
	else if (type == 'top') {
		if (ex < xTopCharge + radiusCharge && ex > xTopCharge - radiusCharge &&
			ey < yTopCharge + radiusCharge && ey > yTopCharge - radiusCharge) {
			topChargeCircleObject.hit = 1;
			xTopCharge = ex;
			yTopCharge = ey;
			console.log("top hit");
			repaint();
		}
	}
}

function withinBoundariesOfPanel(x, y, margin) {
	return (x >= 0+margin && x <= 900-margin && y >= 30+margin && y <= 600-margin);
}


function drawPointChargeFieldLines(line) {
	while (line.ang < 2*Math.PI) {
		// console.log("line.ang: " + line.ang);
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
}

function drawChargeOfBottomFieldLines(line) {
	while (line.ang < 2*Math.PI) {
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

			compx = chargeOfBottom*(line.sx - xBottomCharge) / Math.pow(dist2, 3) + chargeOfPoint * (line.sx - xPoint) / Math.pow(dist1, 3) + chargeOfTop * (line.sx - xTopCharge) / Math.pow(dist3, 3);
			compy = chargeOfBottom*(line.sy - yBottomCharge) / Math.pow(dist2, 3) + chargeOfPoint * (line.sy - yPoint) / Math.pow(dist1, 3) + chargeOfTop * (line.sy - yTopCharge) / Math.pow(dist3, 3);

			comp = Math.sqrt(Math.pow(compx,2) + Math.pow (compy,2));

			if (comp < emagmin)
				line.ex = line.sx - dx;
			else
				line.ex = line.sx + (compx/comp) * dx;
			if (comp < emagmin)
				line.ey = line.sy - dx;
			else
				line.ey = line.sy + (compy/comp) * dx;

			//Don't draw out of boundary (5 = margin)
			if (withinBoundariesOfPanel(line.sx, line.sy, 5) &&
				withinBoundariesOfPanel(line.ex, line.ey, 5)) {
				drawLine(context, '#00BE00', line.sx, line.sy, line.ex, line.ey);
			}

			line.sx = line.ex;
			line.sy = line.ey;
			distm = distmin;
			istop += 1;
		}
		//	line.ang += 2*Math.PI/(chargeOfBottom*numline);
		line.ang += Math.PI/4.;
		comp = 1.;
		istop = 0;
	}
}

function drawChargeOfTopFieldLines(line) {
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

			compx = chargeOfBottom*(line.sx - xBottomCharge) / Math.pow(dist2,3) + chargeOfPoint * (line.sx - xPoint) / Math.pow(dist1, 3) + chargeOfTop* (line.sx - xTopCharge) / Math.pow(dist3,3);
			compy = chargeOfBottom*(line.sy - yBottomCharge) / Math.pow(dist2,3) + chargeOfPoint * (line.sy - yPoint) / Math.pow(dist1, 3) + chargeOfTop*(line.sy-yTopCharge)/Math.pow(dist3,3);

			comp = Math.sqrt(Math.pow(compx,2) + Math.pow (compy,2));

			if (comp < emagmin)
				line.ex = line.sx + dx;
			else
				line.ex = line.sx + (compx/comp) * dx;
			if (comp < emagmin)
				line.ey = line.sy + dx;
			else
				line.ey = line.sy + (compy/comp) * dx;

			//Don't draw out of boundary (5 = margin)
			if (withinBoundariesOfPanel(line.sx, line.sy, 5) &&
				withinBoundariesOfPanel(line.ex, line.ey, 5)) {
				drawLine(context, '#00BE00', line.sx, line.sy, line.ex, line.ey);
			}

			line.sx = line.ex;
			line.sy = line.ey;
			distm = distmin;
			istop+=1;
		}
		line.ang += Math.PI/4.;
		istop = 0;
		distm = distmin;
	}
}

function drawIteration(x, xold, nint, line) {
	// clear page to create animation
	reset();
	comp = 1;
	pointCircleObject.cx = xPoint;
	pointCircleObject.cy = yPoint;

	xPoint = xold[0];
	yPoint = xold[1];

	drawSetup();

	// draw field lines for pointCharge
	line.ang = Math.PI/8.;
	comp = 1;
	istop = 0;
	drawPointChargeFieldLines(line);

	// draw field lines for chargeOfBottom
	line.ang = Math.PI/8.;
	comp = 1;
	istop = 0;
	drawChargeOfBottomFieldLines(line);

	// draw field lines for chargeOfTop
	line.ang = Math.PI/8.;
	comp = 1;
	istop = 0;
	drawChargeOfTopFieldLines(line);

	bconecx = pointCircleObject.cx;
	bconecy = pointCircleObject.cy;

	// nint.log();
	nint.iterate();
	xold[0] = nint.x[0];
	xold[1] = nint.x[1];
	xold[2] = nint.x[2];
	xold[3] = nint.x[3];

	timeValue += dTime;
	// console.log("done");
}

var simTimer;

var isInit = false;
var initAction = false;
var x;
var xold;
var nint;
var line;

function init() {
	x = new Array(4);
	x[0] = 300;
	x[1] = (height/2);
	x[2] = vx;
	x[3] = vy;

	xold = new Array(4);
	xold[0] = x[0];
	xold[1] = x[1];
	xold[2] = x[2];
	xold[3] = x[3];

	pointCircleObject = new Circle(0, radiusPoint, xPoint, yPoint);
	bottomChargeCircleObject = new Circle(0, radiusCharge,xBottomCharge,yBottomCharge);
	topChargeCircleObject = new Circle(0, radiusCharge,xTopCharge,yTopCharge);

	nint = new RKDemo(timeValue, x, .01);
	nint.setPotentialValues(chargeOfPoint, chargeOfBottom, chargeOfTop, xBottomCharge, yBottomCharge, xTopCharge, yTopCharge);
	line = new Line(0.0,0.0,0.0,0.0);

	isInit = true;
	drawSetup();
}

function loadSliderVariables(dx_, vx_, vy_) {
	dx = dx_;
	vx = vx_;
	vy = vy_;
}

function iterateSimulation(canvas, context) {
	// console.log("drawing...");
	if (!isInit) {
		isInit = true;
		init();
	}
	if (inAction) {
		if (!initAction) {
			x[0] = 300;
			x[1] = (height/2);
			x[2] = vx;
			x[3] = vy;
			console.log("vx: " + x[2] + ", vy: " + x[3]);

			xold[0] = x[0];
			xold[1] = x[1];
			xold[2] = x[2];
			xold[3] = x[3];

			nint = new RKDemo(timeValue, x, 0.01);
			nint.setPotentialValues(chargeOfPoint, chargeOfBottom, chargeOfTop, xBottomCharge, yBottomCharge, xTopCharge, yTopCharge);
			initAction = true;
		}
		// nint.iterate();
		// nint.log();
		if (timeValue < timeMax && withinBoundariesOfPanel((xPoint - radiusPoint/2), (yPoint - radiusPoint/2), 5) &&
								   withinBoundariesOfPanel((xPoint + radiusPoint/2), (yPoint + radiusPoint/2), 5)) {
			xPoint = xold[0];
			yPoint = xold[1];
			console.log("withinBoundaries = (" + withinBoundariesOfPanel((xPoint - radiusPoint/2), (yPoint - radiusPoint/2), 5) + ", " + withinBoundariesOfPanel((xPoint + radiusPoint/2), (yPoint + radiusPoint/2), 5) + ")");
			drawIteration(x, xold, nint, line);
		} else {
			console.log("violated: " + xPoint + ", " + yPoint);
			inAction = false;
			initAction = false;
			reset();
			drawSetup();
			clearInterval(simTimer);
		}
	}
}