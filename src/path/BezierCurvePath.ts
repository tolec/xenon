import { Vector } from '../vector';
import { PathFollow } from '../types/types';

const SPEED = 0.5;

export class BezierCurvePath implements PathFollow {
    private t = 0;
    private currCurveIndex = 0;
    private isFinished = false;
    private position: Vector;

    constructor(private bezierCurveList: BezierCurve[]) {
        this.position = bezierCurveList[bezierCurveList.length - 1].getStartPoint();
    }

    update(delta: number): void {
        this.t += delta * SPEED;

        if (this.t > 1) {
            this.currCurveIndex += 1;
            this.t -= 1;
        }

        if (this.currCurveIndex > this.bezierCurveList.length - 1) {
            this.isFinished = true;
            this.position = this.bezierCurveList[this.bezierCurveList.length - 1].getEndPoint();
        } else {
            this.position = this.bezierCurveList[this.currCurveIndex].calcPosition(this.t);
        }
    }

    getPosition(): Vector {
        return this.position;
    }

    isFinish() {
        return this.isFinished;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.bezierCurveList.length === 0) {
            return;
        }

        ctx.fillStyle = 'red';
        ctx.beginPath();

        for (const curve of this.bezierCurveList) {
            for (let t = 0; t < 1; t += 0.1) {
                const point = curve.calcPosition(t);

                ctx.moveTo(point.x, point.y);
                ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
            }
        }

        ctx.fill();
    }
}

export abstract class BezierCurve {
    abstract getStartPoint(): Vector;
    abstract getEndPoint(): Vector;
    abstract calcPosition(t: number): Vector;
}

export class BezierCurveLinear extends BezierCurve {
    constructor(private p0: Vector, private p1: Vector) {
        super();
    }

    getStartPoint(): Vector {
        return this.p0;
    }

    getEndPoint(): Vector {
        return this.p1;
    }

    calcPosition(t: number): Vector {
        const x = this.formula(t, this.p0.x, this.p1.x);
        const y = this.formula(t, this.p0.y, this.p1.y);

        return new Vector(x, y);
    }

    formula(t: number, p0: number, p1: number) {
        return (1 - t) * p0 + t * p1;
    }
}

export class BezierCurveQuadratic extends BezierCurve {
    constructor(private p0: Vector, private p1: Vector, private p2: Vector) {
        super();
    }

    getStartPoint(): Vector {
        return this.p0;
    }

    getEndPoint(): Vector {
        return this.p2;
    }

    calcPosition(t: number): Vector {
        const x = this.formula(t, this.p0.x, this.p1.x, this.p2.x);
        const y = this.formula(t, this.p0.y, this.p1.y, this.p2.y);

        return new Vector(x, y);
    }

    formula(t: number, p0: number, p1: number, p2: number) {
        return Math.pow(1 - t, 2) * p0 + 2 * (1 - t) * t * p1 + Math.pow(t, 2) * p2;
    }
}

export class BezierCurveCubic extends BezierCurve {
    constructor(private p0: Vector, private p1: Vector, private p2: Vector, private p3: Vector) {
        super();
    }

    getStartPoint(): Vector {
        return this.p0;
    }

    getEndPoint(): Vector {
        return this.p3;
    }

    calcPosition(t: number): Vector {
        const x = this.formula(t, this.p0.x, this.p1.x, this.p2.x, this.p3.x);
        const y = this.formula(t, this.p0.y, this.p1.y, this.p2.y, this.p3.y);

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
}
