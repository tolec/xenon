import { BezierCurve } from './BezierCurve';
import { Vector } from '../Vector';

export class BezierCurveLinear extends BezierCurve {
    constructor(private A: Vector, private B: Vector) {
        super();
    }

    getStartPoint(): Vector {
        return this.A;
    }

    getEndPoint(): Vector {
        return this.B;
    }

    calcPosition(t: number): Vector {
        const x = this.formula(t, this.A.x, this.B.x);
        const y = this.formula(t, this.A.y, this.B.y);

        return new Vector(x, y);
    }

    formula(t: number, p0: number, p1: number) {
        return (1 - t) * p0 + t * p1;
    }

    calcLinearDeltaTime(t: number, len: number) {
        const v = this.B.subtract(this.A);

        return len / v.length();
    }
}
