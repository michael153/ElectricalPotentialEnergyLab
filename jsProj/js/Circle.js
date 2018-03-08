class Circle {
	constructor(selected, radius, start_x, start_y) {
		this.hit = selected;
		this.r = radius;
		this.cx = (start_x + this.r/2);
		this.cy = (start_y - this.r/2);
		this.sx = start_x;
		this.sy = start_y;
	}
}