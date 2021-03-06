import {Vector} from "./vector";

export class Position {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Position(this.x, this.y);
    }

    add(vector: Vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    toString() {
        return `[${this.x.toFixed(1)}, ${this.y.toFixed(1)}}`;
    }

    toInteger() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }
}
