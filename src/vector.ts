import { Position } from './position';

export class Vector extends Position {
    clone() {
        return new Vector(this.x, this.y);
    }

    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    add(vector: Vector) {
        return this.clone().addSelf(vector);
    }

    multiply(value: number) {
        return this.clone().multiplySelf(value);
    }

    addSelf(vector: Vector) {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    multiplySelf(value: number) {
        this.x *= value;
        this.y *= value;

        return this;
    }

    normalize() {
        const length = this.length();

        if (length === 0) {
            return;
        }

        this.x /= length;
        this.y /= length;
    }

    truncate(maxLength: number) {
        const length = this.length();

        if (length > maxLength) {
            const ratio = maxLength / length;

            this.x *= ratio;
            this.y *= ratio;
        }
    }
}
