interface RectProps {
    x: number;
    y: number;
    w: number;
    h: number;
}

export class Rect {
    private _x: number;
    private _y: number;
    private _w: number;
    private _h: number;

    constructor({x, y, w, h}: RectProps) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get w() {
        return this._w;
    }

    get h() {
        return this._h;
    }

    setPosition(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    setSize(w: number, h: number) {
        this._w = w;
        this._h = h;
    }

    hasPoint(x: number, y: number) {
        return (
            x >= this._x && x <= this._x + this._w &&
            y >= this._y && y <= this._y + this._h
        );
    }
}
