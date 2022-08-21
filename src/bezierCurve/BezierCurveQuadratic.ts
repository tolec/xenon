import { BezierCurve } from './BezierCurve';
import { Vector } from '../Vector';

export class BezierCurveQuadratic extends BezierCurve {
    private v1: Vector;
    private v2: Vector;

    constructor(private A: Vector, private B: Vector, private C: Vector) {
        super();

        this.v1 = A.multiply(2).subtractSelf(B.multiply(4)).addSelf(C.multiply(2));
        this.v2 = A.multiply(-2).addSelf(B.multiply(2));
    }

    getStartPoint(): Vector {
        return this.A;
    }

    getEndPoint(): Vector {
        return this.C;
    }

    calcPosition(t: number): Vector {
        const x = this.formula(t, this.A.x, this.B.x, this.C.x);
        const y = this.formula(t, this.A.y, this.B.y, this.C.y);

        return new Vector(x, y);
    }

    formula(t: number, p0: number, p1: number, p2: number) {
        return Math.pow(1 - t, 2) * p0 + 2 * (1 - t) * t * p1 + Math.pow(t, 2) * p2;
    }

    calcLinearDeltaTime(t: number, len: number) {
        return len / this.v1.multiply(t).addSelf(this.v2).length();
    }
}
