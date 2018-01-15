class Ship {
	constructor(x, y, color) {
		this._x = x;
		this._y = y;
		this._color = color;
	}

	getX() {
		return this._x;
	}

	setX(x) {
		this._x = x;
	}

	getY() {
		return this._y;
	}

	setY(y) {
		this._y = y;
	}

	getColor() {
		return this._color;
	}
}