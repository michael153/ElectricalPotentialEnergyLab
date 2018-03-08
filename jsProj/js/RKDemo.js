class RKDemo {
	constructor(i_t, i_x, i_dt) {
		this.t = i_t;
		this.dt = i_dt;
		this.n = i_x.length;
		this.x = new Array(this.n);
		this.k1 = [];
		this.k2 = [];
		this.k3 = [];
		this.k4 = [];
		for (var i = 0; i < this.n; i ++) {
			this.x[i] = i_x[i];
		}
		// console.log("In initializer... this.x: " + this.x);
	}

	derivative (i_t, i_x) {
		var q1 = this.potential_q1; // Potential.chargeOfPoint;  
		var q2 = this.potential_q2; // Potential.chargeOfBottom;  
		var q3 = this.potential_q3; // Potential.chargeOfTop;  
		var x2 = this.potential_x2; // Potential.xBottomCharge;  
		var y2 = this.potential_y2; // Potential.yBottomCharge;
		var x3 = this.potential_x3; // Potential.xTopCharge;
		var y3 = this.potential_y3; // Potential.yTopCharge;  
		
		var dist2;
		var dist3;
		var consta = 1000000.;

		var compx;
		var compy;

		var y = new Array(4);
		y[0] = i_x[2];
		y[1] = i_x[3];

		dist2 = Math.sqrt(Math.pow(i_x[0] - x2, 2) + Math.pow(i_x[1] - y2, 2));
		dist3 = Math.sqrt(Math.pow(i_x[0] - x3, 2) + Math.pow(i_x[1] - y3, 2));

		compx = q2 * (i_x[0] - x2) / Math.pow(dist2, 3) + q3 * (i_x[0] - x3) / Math.pow(dist3,3);
		compy = q2 * (i_x[1] - y2) / Math.pow(dist2, 3) + q3 * (i_x[1] - y3) / Math.pow(dist3,3);

		//  restrict to one dimensional motion 
		y[2] = consta * q1 * compx;
		y[3] = consta * q1 * compy;

		// console.log("q1: " + q1);
		// console.log("q2: " + q2);
		// console.log("q3: " + q3);
		// console.log("x2: " + x2);
		// console.log("y2: " + y2);
		// console.log("x3: " + x3);
		// console.log("y3: " + y3);
		// console.log("dist2: " + dist2);
		// console.log("dist3: " + dist3);
		// console.log("consta: " + consta);
		// console.log("compx: " + compx);
		// console.log("compy: " + compy);
		// console.log("y[0] = " + y[0] + " y[1] = " + y[1] + " y[2] = " + y[2] + " y[3] = "+y[3]);
		return y;
	}

	setPotentialValues(q1_, q2_, q3_, x2_, y2_, x3_, y3_) {
		this.potential_q1 = q1_;
		this.potential_q2 = q2_;
		this.potential_q3 = q3_;
		this.potential_x2 = x2_;
		this.potential_y2 = y2_;
		this.potential_x3 = x3_;
		this.potential_y3 = y3_;
	}

	iterate() {
		// console.log("Start of iterate..." + this.k1 + ", " + this.k2 + ", " + this.k3 + ", " + this.k4 + ", " + this.t);
		var i;
		var x1 = new Array(this.n);
		// console.log("this.x: " + this.x)
		this.k1 = this.derivative(this.t, this.x);

		// console.log(this.k1 + ", " + this.k2 + ", " + this.k3 + ", " + this.k4 + ", " + this.t);
		// console.log("this.k1... " + this.k1);

		for (var i = 0; i < this.n; i++) {
		    x1[i] = this.x[i] + this.dt * this.k1[i]/2.0;
		}
		this.k2 = this.derivative(this.t + this.dt/2, x1);
		for (var i = 0; i < this.n; i++) {
		    x1[i] = this.x[i] + this.dt * this.k2[i]/2.0;
		}
		this.k3 = this.derivative(this.t + this.dt/2, x1);
		for (var i = 0; i < this.n; i++) {
			x1[i] = this.x[i] + this.dt * this.k3[i];
		}
		this.k4 = this.derivative(this.t + this.dt, x1);
		for (var i = 0; i < this.n; i++) {
		    this.x[i] += this.dt/6.0 * (this.k1[i] + 2.0*this.k2[i] + 2.0*this.k3[i] + this.k4[i]);
		}
		this.t += this.dt;
		console.log("this.k1: " + this.k1);
		console.log("this.k2: " + this.k2);
		console.log("this.k3: " + this.k3);
		console.log("this.k4: " + this.k4);
		console.log("this.t: " + this.t);
	}
}