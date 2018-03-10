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
}

function repaint(context) {
	reset(context);
	drawSetup(context);
}

/*** Draw Methods ***/
function drawPoint(context, color, x, y, r) {
	context.beginPath();
	context.fillStyle = color;
	context.arc(x, y, r, 0, 2 * Math.PI);
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

function putRulerData(context) {
	context.font = "12px Arial"; 
	context.textAlign = "right";
	context.fillStyle = 'black';
	context.fillText("Ruler Length: " + Math.round(rulerLength * 100) / 100, 890 , 25);
	context.fillText("Ruler Angle: " + (360 - rulerAngToHorizontal.toFixed(2)).toFixed(2), 890 , 45);
	context.stroke();
}

function drawRuler(context) {

	var halfWidth = 10;
	var freq = 10;
	var offset1x = rulerX + halfWidth*Math.cos(toRadians(90 + rulerAngToHorizontal));
	var offset1y = rulerY + halfWidth*Math.sin(toRadians(90 + rulerAngToHorizontal));
	var offset2x = rulerX - halfWidth*Math.cos(toRadians(90 + rulerAngToHorizontal));
	var offset2y = rulerY - halfWidth*Math.sin(toRadians(90 + rulerAngToHorizontal));
	var rulerLengthX = rulerLength*Math.cos(toRadians(rulerAngToHorizontal));
	var rulerLengthY = rulerLength*Math.sin(toRadians(rulerAngToHorizontal));

	// Draw Ticks
	for (var i = 0; i < rulerLength/freq; i++) {
		var pX = offset1x + (i*freq)*Math.cos(toRadians(rulerAngToHorizontal));
		var pY = offset1y + (i*freq)*Math.sin(toRadians(rulerAngToHorizontal));
		var len = (4 + 2*(i%2) + 2*(i%4));
		console.log("tick(X, Y): " + (pX - 3*Math.cos(toRadians(90 + rulerAngToHorizontal))) + ", " + (pY - 3*Math.sin(toRadians(90 + rulerAngToHorizontal))));
		drawLine(context, 'blue', pX, pY, pX - len*Math.cos(toRadians(90 + rulerAngToHorizontal)), pY - len*Math.sin(toRadians(90 + rulerAngToHorizontal)));
	}

	// Draw Rectangle Ends
	drawLine(context, 'blue', offset1x, offset1y, offset2x, offset2y);
	drawLine(context, 'blue', offset1x + rulerLengthX, offset1y + rulerLengthY,
							  offset2x + rulerLengthX, offset2y + rulerLengthY);
	
	// Draw Sides
	drawLine(context, 'blue', offset1x, offset1y, offset1x + rulerLengthX,
											  	  offset1y + rulerLengthY);
	drawLine(context, 'blue', offset2x, offset2y, offset2x + rulerLengthX,
											  	  offset2y + rulerLengthY);


	// Draw Endpoints
	drawPoint(context, 'blue', rulerX, rulerY, 2);
	drawPoint(context, 'blue', rulerX + rulerLengthX, rulerY + rulerLengthY, 2);

	putRulerData(context);
}

function drawSetup(context) {
	if (withinBoundariesOfPanel((xPoint - radiusPoint/2), (yPoint - radiusPoint/2), 5) &&
		withinBoundariesOfPanel((xPoint + radiusPoint/2), (yPoint + radiusPoint/2), 5)) {
			drawPoint(context, 'black', xPoint, yPoint, radiusPoint);
	}

	drawPoint(context, 'red', xBottomCharge, yBottomCharge, radiusCharge);
	drawPoint(context, 'red', xTopCharge, yTopCharge, radiusCharge);
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

function drawPointChargeFieldLines(context, line) {
	while (line.ang < 2*Math.PI) {
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

function drawChargeOfBottomFieldLines(context, line) {
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

function drawChargeOfTopFieldLines(context, line) {
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

function drawIteration(context, x, xold, nint, line) {
	// clear page to create animation
	reset(context);
	comp = 1;
	pointCircleObject.cx = xPoint;
	pointCircleObject.cy = yPoint;

	xPoint = xold[0];
	yPoint = xold[1];

	drawSetup(context);

	// draw field lines for pointCharge
	// line.ang = Math.PI/8.;
	// comp = 1;
	// istop = 0;
	// drawPointChargeFieldLines(context, line);
	drawFieldLines(context, 'point', line);

	// draw field lines for chargeOfBottom
	// line.ang = Math.PI/8.;
	// comp = 1;
	// istop = 0;
	// drawChargeOfBottomFieldLines(context, line);
	drawFieldLines(context, 'bottom', line);

	// draw field lines for chargeOfTop
	// line.ang = Math.PI/8.;
	// comp = 1;
	// istop = 0;
	// drawChargeOfTopFieldLines(context, line);
	drawFieldLines(context, 'top', line);

	bconecx = pointCircleObject.cx;
	bconecy = pointCircleObject.cy;

	// nint.log();
	nint.iterate();
	xold[0] = nint.x[0];
	xold[1] = nint.x[1];
	xold[2] = nint.x[2];
	xold[3] = nint.x[3];

	timeValue += dTime;

	if (showRuler)
		drawRuler(context);
}

var simTimer;

var isInit = false;
var initAction = false;
var x;
var xold;
var nint;
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

	nint = new RKDemo(timeValue, x, .01);
	nint.setPotentialValues(chargeOfPoint, chargeOfBottom, chargeOfTop, xBottomCharge, yBottomCharge, xTopCharge, yTopCharge);
	line = new Line(0.0,0.0,0.0,0.0);

	isInit = true;
	drawSetup(context);
}

function iterateSimulation(canvas, context) {
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
			xold[0] = x[0];
			xold[1] = x[1];
			xold[2] = x[2];
			xold[3] = x[3];
			nint = new RKDemo(timeValue, x, 0.01);
			nint.setPotentialValues(chargeOfPoint, chargeOfBottom, chargeOfTop, xBottomCharge, yBottomCharge, xTopCharge, yTopCharge);
			initAction = true;
		}
		if (timeValue < timeMax && withinBoundariesOfPanel((xPoint - radiusPoint/2), (yPoint - radiusPoint/2), 5) &&
								   withinBoundariesOfPanel((xPoint + radiusPoint/2), (yPoint + radiusPoint/2), 5)) {
			xPoint = xold[0];
			yPoint = xold[1];
			drawIteration(context, x, xold, nint, line);
		} else {
			inAction = false;
			initAction = false;
			reset(context);
			drawSetup(context);
			if (showRuler)
				drawRuler(context);
			clearInterval(simTimer);
		}
	}
}