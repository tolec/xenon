import {Position} from "./position";

export class Vector extends Position {
    clone() {
        return new Vector(this.x, this.y);
    }

    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    multiply(value: number) {
        this.x *= value;
        this.y *= value;
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
