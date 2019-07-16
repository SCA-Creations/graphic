class Graphics {
	private _fill: boolean = true;
	private _stroke: boolean = true;
	context: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement) {
		this.context = canvas.getContext("2d");
	}

	paint(path: Path2D = null): void {
		if (path === null) {
			if (this._fill) this.context.fill();
			if (this._stroke) this.context.stroke();
		} else {
			if (this._fill) this.context.fill(path);
			if (this._stroke) this.context.stroke(path);
		}
	}

	noFill(): void {
		this._fill = false;
	}

	noStroke(): void {
		this._stroke = false;
	}

	private static color(R: string | number, G: any, B: any): string {
		if (G == undefined) G = R;
		if (B == undefined) B = R;
		if (typeof R == "number") {
			return `rgb(${R},${G},${B})`;
		} else if (typeof R == "string") {
			return R;
		}
	}

	fill(R?: any, G?: any, B?: any): void {
		if (R != undefined) this.context.fillStyle = Graphics.color(R, G, B);
		this._fill = true;
	}

	stroke(R?: any, G?: any, B?: any): void {
		if (R != undefined) this.context.strokeStyle = Graphics.color(R, G, B);
		this._stroke = true;
	}

	line(x1: number, y1: number, x2: number, y2: number) {
		this.context.beginPath();
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.closePath();
		this.paint();
	}

	ellipse(x: number, y: number, r1: number, r2: number) {
		this.context.beginPath();
		this.context.ellipse(x, y, r1, r2, 0, 0, Math.PI * 2);
		this.context.closePath();
		this.paint();
	}

	rect(x: number, y: number, w: number, h: number) {
		this.context.beginPath();
		this.context.rect(x, y, w, h);
		this.context.closePath();
		this.paint();
	}

	clear() {
		this.context.setTransform(1, 0, 0, 1, 0, 0);
		var width = this.context.canvas.width;
		var height = this.context.canvas.height;
		this.context.clearRect(0, 0, width, height);
		this.fill(0);
		this.stroke(0);
		this.strokeWidth(0);
	}

	translate(x: number, y: number) {
		this.context.translate(x, y);
	}

	strokeWidth(width: number) {
		this.context.lineWidth = width;
	}

	text(text: string, x: number, y: number) {
		if (this._fill) {
			this.context.fillText(text, x, y);
		}
		if (this._stroke) {
			this.context.strokeText(text, x, y);
		}
	}

	resetTransform() {
		this.context.setTransform(1, 0, 0, 1, 0, 0);
	}

	font(font: string) {
		this.context.font = font;
	}

	draw(shape: Shape) {
		this.context.save();
		shape.render(this.context, this._fill, this._stroke);
		this.context.restore();
		this.paint();
	}

}

class Point {
	x: number;
	y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	static distance(p1: Point, p2: Point): number {
		var dx = p1.x - p2.x;
		var dy = p1.y - p2.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	static to_points(...coordinates: number[]): Point[] {
		var data: Point[] = [];
		for (var i = 0; i < coordinates.length; i += 2) {
			data.push(new Point(coordinates[i], coordinates[i + 1]));
		}
		return data;
	}
}

class Rectangle implements Shape {
	rotate: number = 0;
	position: Point;
	width: number;
	height: number;
	origin: Point;

	constructor(position: Point, width: number, height: number) {
		this.height = height;
		this.width = width;
		this.position = position;
		this.origin = new Point(width / 2, height / 2);
	}


	render(context: CanvasRenderingContext2D, fill, stroke): void {
		context.beginPath();
		context.translate(this.position.x + this.origin.x, this.position.y + this.origin.y);
		context.rotate(this.rotate);
		context.rect(-this.origin.x, -this.origin.y, this.width, this.height);
	}

}

interface Shape {
	position: Point;

	render(context: CanvasRenderingContext2D, fill: boolean, stroke: boolean): void;
}

class Polygon implements Shape {
	rotate: number = 0;
	position: Point;
	points: Point[];
	fill = true;
	stroke = false;
	origin: Point = new Point();
	closePath: boolean = true;

	constructor(position?: Point, ...points: Point[]) {
		this.position = position;
		this.points = points;
	}

	render(context: CanvasRenderingContext2D, fill: boolean, stroke: boolean): void {
		context.beginPath();
		context.translate(this.position.x + this.origin.x, this.position.y + this.origin.y);
		context.rotate(this.rotate);
		var n = new Path2D();
		for (var point of this.points) {
			n.lineTo(point.x - this.origin.x, point.y - this.origin.y);
		}
		if (this.closePath) n.closePath();
		if (fill) context.fill(n);
		if (stroke) context.stroke(n);
	}
}