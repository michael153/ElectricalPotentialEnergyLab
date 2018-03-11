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



var showRuler = false;
var rulerClicked = false;
var rulerStartClicked = false;
var rulerEndClicked = false;
var rulerX = 30;
var rulerY = 30;
var rulerClickOffset; 
var rulerLength = 500;
var rulerAngToHorizontal = 30.0;


/*** Reset Methods ***/
function resetHits() {
	bottomChargeCircleObject.hit = 0;
	topChargeCircleObject.hit = 0;
}

function reset(context) {
	context.strokeStyle = 'black';
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function hardReset(context) {
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
	repaint(context);
	if (!dragRuler && showRuler)
		drawRuler(context);
}

function repaint(context) {
	reset(context);
	drawSetup(context);
	if (inAction) {
		drawFieldLines(context, 'point', line);
		drawFieldLines(context, 'bottom', line);
		drawFieldLines(context, 'top', line);
		putSimData(context);
	}
}

/*** Draw Methods ***/
function drawPoint(context, color, x, y, r) {
	context.beginPath();
	context.strokeStyle = color;
	context.fillStyle = color;
	context.arc(x, y, r, 0, 2 * Math.PI);
	context.fill();
	context.stroke();
}

function drawCharge(context, color, x, y, r) {
	drawPoint(context, color, x, y, r);
	drawPoint(context, 'white', x, y, 1);
}

function drawLine(context, color, x1, y1, x2, y2) {
	context.beginPath();
	context.strokeStyle = color;
	context.fillStyle = color;
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
}

function putRulerData(context) {
	context.font = "12px Arial"; 
	context.textAlign = "right";
	context.fillStyle = 'black';
	context.fillText("Ruler Length: " + Math.round(rulerLength * 100) / 100, 890 , 25);
	var angToPut = (360 - rulerAngToHorizontal.toFixed(2)).toFixed(2);
	if (angToPut > 180) 
		angToPut = (360 - angToPut).toFixed(2);
	if (pivot == "end")
		angToPut = (180 - angToPut).toFixed(2);
	context.fillText("Ruler Angle: " + angToPut, 890 , 45);
	context.stroke();
}

function putSimData(context) {
	context.font = "12px Arial"; 
	context.textAlign = "left";
	context.fillStyle = 'black';
	context.fillText("Min X-value: " + xminVal.toFixed(3), 10 , 25);
	context.fillText("Max X-value: " + xmaxVal.toFixed(3), 10 , 45);
	context.fillText("Min Y-value: " + yminVal.toFixed(3), 10 , 65);
	context.fillText("Max Y-value: " + ymaxVal.toFixed(3), 10 , 85);
	context.stroke();
}

var rulerWidth = 20;
var rulerRectX = new Array(2);
var rulerRectY = new Array(2);
var rulerLengthX, rulerLengthY;

function drawRuler(context) {

	
	var freq = 10;
	rulerRectX[0] = rulerX + (rulerWidth/2)*Math.cos(toRadians(90 + rulerAngToHorizontal));
	rulerRectY[0] = rulerY + (rulerWidth/2)*Math.sin(toRadians(90 + rulerAngToHorizontal));
	rulerRectX[1] = rulerX - (rulerWidth/2)*Math.cos(toRadians(90 + rulerAngToHorizontal));
	rulerRectY[1] = rulerY - (rulerWidth/2)*Math.sin(toRadians(90 + rulerAngToHorizontal));
	rulerLengthX = rulerLength*Math.cos(toRadians(rulerAngToHorizontal));
	rulerLengthY = rulerLength*Math.sin(toRadians(rulerAngToHorizontal));

	// Draw Ticks
	for (var i = 0; i < rulerLength/freq; i++) {
		var pX = rulerRectX[0] + (i*freq)*Math.cos(toRadians(rulerAngToHorizontal));
		var pY = rulerRectY[0] + (i*freq)*Math.sin(toRadians(rulerAngToHorizontal));
		var len = (4 + 2*(i%2) + 2*(i%4));
		drawLine(context, 'blue', pX, pY, pX - len*Math.cos(toRadians(90 + rulerAngToHorizontal)), pY - len*Math.sin(toRadians(90 + rulerAngToHorizontal)));
	}

	// Draw Rectangle Ends
	drawLine(context, 'blue', rulerRectX[0], rulerRectY[0], rulerRectX[1], rulerRectY[1]);
	drawLine(context, 'blue', rulerRectX[0] + rulerLengthX, rulerRectY[0] + rulerLengthY,
							  rulerRectX[1] + rulerLengthX, rulerRectY[1] + rulerLengthY);
	
	// Draw Sides
	drawLine(context, 'blue', rulerRectX[0], rulerRectY[0], rulerRectX[0] + rulerLengthX, rulerRectY[0] + rulerLengthY);
	drawLine(context, 'blue', rulerRectX[1], rulerRectY[1], rulerRectX[1] + rulerLengthX, rulerRectY[1] + rulerLengthY);


	// Draw Endpoints
	drawPoint(context, 'blue', rulerX, rulerY, 2);
	drawPoint(context, 'blue', rulerX + rulerLengthX, rulerY + rulerLengthY, 2);


	// var tempX1 = rulerRectX[0] + rulerRectX[0]*Math.cos(toRadians(rulerAngToHorizontal));
	// var tempY1 = rulerRectY[0] + rulerRectY[0]*Math.sin(toRadians(rulerAngToHorizontal));
	// drawLine(context, 'red', rulerRectX[0], rulerRectY[0], tempX1, tempY1);
	// drawLine(context, 'red', rulerRectX[0], rulerRectY[0] + rulerLength,
							 // tempX1, tempY1 + rulerLengthY);


	putRulerData(context);
}

function drawSetup(context) {
	if (withinBoundariesOfPanel((xPoint - radiusPoint/2), (yPoint - radiusPoint/2), 5) &&
		withinBoundariesOfPanel((xPoint + radiusPoint/2), (yPoint + radiusPoint/2), 5)) {
			drawCharge(context, 'black', xPoint, yPoint, radiusPoint);
	}

	drawCharge(context, 'red', xBottomCharge, yBottomCharge, radiusCharge);
	drawCharge(context, 'red', xTopCharge, yTopCharge, radiusCharge);
}

/*** Simulation Methods ***/
function withinBoundariesOfPanel(x, y, margin) {
	return (x >= 0+margin && x <= 900-margin && y >= 30+margin && y <= 600-margin);
}

function withinBottomSphere(x, y) {
	return (x < xBottomCharge + radiusCharge && x > xBottomCharge - radiusCharge &&
			y < yBottomCharge + radiusCharge && y > yBottomCharge - radiusCharge);
}

function withinTopSphere(x, y) {
	return (x < xTopCharge + radiusCharge && x > xTopCharge - radiusCharge &&
			y < yTopCharge + radiusCharge && y > yTopCharge - radiusCharge);
}

function updateBottomSphere(context, x, y) {
	xBottomCharge = x;
	yBottomCharge = y;
	repaint(context);
}

function updateTopSphere(context, x, y) {
	xTopCharge = x;
	yTopCharge = y;
	repaint(context);
}

function drawFieldLines(context, type, line) {
	line.ang = Math.PI/8;
	comp = 1;
	istop = 0;

	while (line.ang < 2*Math.PI) {
		if (type == 'top') {
			line.sx = xTopCharge + 10 * Math.cos(line.ang);
			line.sy = yTopCharge + 10 * Math.sin(line.ang);
		}
		else if (type == 'bottom') {
			line.sx = xBottomCharge + 10 * Math.cos(line.ang);
			line.sy = yBottomCharge - 10 * Math.sin(line.ang);
		}
		else if (type == 'point') {
			line.sx = xPoint - 10 * Math.cos(line.ang);
			line.sy = yPoint - 10 * Math.sin(line.ang);
		}

		dist1 = Math.sqrt(Math.pow(line.sx-xPoint, 2) + Math.pow(line.sy-yPoint, 2));
		dist2 = Math.sqrt(Math.pow(line.sx-xBottomCharge, 2) + Math.pow(line.sy-yBottomCharge, 2));
		dist3 = Math.sqrt(Math.pow(line.sx-xTopCharge, 2) + Math.pow(line.sy-yTopCharge, 2));
		distm = 9.;

		while (istop < nstop && dist1 > distm && dist2 > distm && dist3 > distm && line.sx < width && line.sy < height ) {
			dist1 = Math.sqrt(Math.pow(line.sx-xPoint, 2) + Math.pow(line.sy-yPoint, 2));
			dist2 = Math.sqrt(Math.pow(line.sx-xBottomCharge, 2) + Math.pow(line.sy-yBottomCharge, 2));
			dist3 = Math.sqrt(Math.pow(line.sx-xTopCharge, 2) + Math.pow(line.sy-yTopCharge, 2));

			if (type == 'point') {
				compx = -(chargeOfBottom*(line.sx - xBottomCharge) / Math.pow(dist2,3) + chargeOfPoint *(line.sx - xPoint) / Math.pow(dist1,3) + chargeOfTop* (line.sx - xTopCharge) / Math.pow(dist3,3));
				compy = -(chargeOfBottom*(line.sy - yBottomCharge) / Math.pow(dist2,3) + chargeOfPoint *(line.sy - yPoint) / Math.pow(dist1,3) + chargeOfTop*(line.sy-yTopCharge)/Math.pow(dist3,3));
			}
			else {
				compx = chargeOfBottom*(line.sx - xBottomCharge) / Math.pow(dist2, 3) + chargeOfPoint * (line.sx - xPoint) / Math.pow(dist1, 3) + chargeOfTop* (line.sx - xTopCharge) / Math.pow(dist3,3);
				compy = chargeOfBottom*(line.sy - yBottomCharge) / Math.pow(dist2, 3) + chargeOfPoint * (line.sy - yPoint) / Math.pow(dist1, 3) + chargeOfTop*(line.sy-yTopCharge)/Math.pow(dist3,3);
			}

			comp = Math.sqrt(Math.pow(compx,2) + Math.pow (compy,2));

			if (comp < emagmin) {
				if (type == 'top' || type == 'point')
					line.ex = line.sx + dx;
				if (type == 'bottom')
					line.ex = line.sx - dx;
			}
			else
				line.ex = line.sx + (compx/comp) * dx;
			if (comp < emagmin) {
				if (type == 'top' || type == 'point')
					line.ey = line.sy + dx;
				else if (type == 'bottom')
					line.ey = line.sy - dx;
			}
			else
				line.ey = line.sy + (compy/comp) * dx;

			if (withinBoundariesOfPanel(line.sx, line.sy, 5) &&
				withinBoundariesOfPanel(line.ex, line.ey, 5) &&
				!withinTopSphere(line.sx, line.sy) &&
				!withinBottomSphere(line.sx, line.sy)) {
				drawLine(context, '#00BE00', line.sx, line.sy, line.ex, line.ey);
			}

			line.sx = line.ex;
			line.sy = line.ey;
			distm = distmin;
			istop +=1;
		}
		line.ang += Math.PI/4.;
		istop = 0;
		distm = distmin;
	}
}

var xminVal;
var xmaxVal;
var yminVal;
var ymaxVal;

function drawIteration(context, x, xold, mvar, line) {
	// clear page to create animation
	reset(context);
	comp = 1;
	pointCircleObject.cx = xPoint;
	pointCircleObject.cy = yPoint;

	xPoint = xold[0];
	yPoint = xold[1];

	xmaxVal = Math.max(xPoint, xmaxVal);
	xminVal = Math.min(xPoint, xminVal);
	ymaxVal = Math.max(yPoint, ymaxVal);
	yminVal = Math.min(yPoint, yminVal);

	drawSetup(context);

	drawFieldLines(context, 'point', line);
	drawFieldLines(context, 'bottom', line);
	drawFieldLines(context, 'top', line);

	putSimData(context);

	bconecx = pointCircleObject.cx;
	bconecy = pointCircleObject.cy;

	// mvar.log();
	mvar.iterate();
	xold[0] = mvar.x[0];
	xold[1] = mvar.x[1];
	xold[2] = mvar.x[2];
	xold[3] = mvar.x[3];

	timeValue += dTime;

	if (!dragRuler && showRuler)
		drawRuler(context);
}

var simTimer;

var isInit = false;
var initAction = false;
var x;
var xold;
var mvar;
var line;

function init(context) {
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

	mvar = new MotionVariable(timeValue, x, .01);
	mvar.setPotentialValues(chargeOfPoint, chargeOfBottom, chargeOfTop, xBottomCharge, yBottomCharge, xTopCharge, yTopCharge);
	line = new Line(0.0,0.0,0.0,0.0);

	isInit = true;
	drawSetup(context);
}

function iterateSimulation(canvas, context) {
	if (!isInit) {
		isInit = true;
		init(context);
	}
	if (inAction) {
		if (!initAction) {
			x[0] = 300;
			x[1] = (height/2);
			x[2] = vx;
			x[3] = vy;
			xold[0] = x[0];
			xold[1] = x[1];
			xold[2] = x[2];
			xold[3] = x[3];
			mvar = new MotionVariable(timeValue, x, 0.01);
			mvar.setPotentialValues(chargeOfPoint, chargeOfBottom, chargeOfTop, xBottomCharge, yBottomCharge, xTopCharge, yTopCharge);
			initAction = true;
		}
		if (timeValue < timeMax && withinBoundariesOfPanel((xPoint - radiusPoint/2), (yPoint - radiusPoint/2), 5) &&
								   withinBoundariesOfPanel((xPoint + radiusPoint/2), (yPoint + radiusPoint/2), 5)) {
			xPoint = xold[0];
			yPoint = xold[1];
			drawIteration(context, x, xold, mvar, line);
		} else {
			inAction = false;
			initAction = false;
			reset(context);
			drawSetup(context);
			if (!dragRuler && showRuler)
				drawRuler(context);
			clearInterval(simTimer);
		}
	}
}