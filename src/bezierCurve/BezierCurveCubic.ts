import { BezierCurve } from './BezierCurve';
import { Vector } from '../Vector';

export class BezierCurveCubic extends BezierCurve {
    private v1: Vector;
    private v2: Vector;
    private v3: Vector;

    constructor(private A: Vector, private B: Vector, private C: Vector, private D: Vector) {
        super();

        this.v1 = A.multiply(-3).addSelf(B.multiply(9)).subtractSelf(C.multiply(9)).addSelf(D.multiply(3));
        this.v2 = A.multiply(6).subtractSelf(B.multiply(12)).addSelf(C.multiply(6));
        this.v3 = A.multiply(-3).addSelf(B.multiply(3));
    }

    getStartPoint(): Vector {
        return this.A;
    }

    getEndPoint(): Vector {
        return this.D;
    }

    calcPosition(t: number): Vector {
        const x = this.formula(t, this.A.x, this.B.x, this.C.x, this.D.x);
        const y = this.formula(t, this.A.y, this.B.y, this.C.y, this.D.y);

        return new Vector(x, y);
    }

    formula(t: number, p0: number, p1: number, p2: number, p3: number) {
        return (
            Math.pow(1 - t, 3) * p0 +
            3 * Math.pow(1 - t, 2) * t * p1 +
            3 * (1 - t) * Math.pow(t, 2) * p2 +
            Math.pow(t, 3) * p3
        );
    }

    calcLinearDeltaTime(t: number, len: number) {
        return (
            len /
            this.v1
                .multiply(t * t)
                .addSelf(this.v2.multiply(t))
                .addSelf(this.v3)
                .length()
        );
    }
}
