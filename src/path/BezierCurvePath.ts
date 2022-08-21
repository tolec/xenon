import { Vector } from '../primitive/Vector';
import { PathFollow } from '../types/types';
import { BezierCurve } from '../bezierCurve/BezierCurve';

const SPEED = 200;

export class BezierCurvePath implements PathFollow {
    private t = 0;
    private currCurveIndex = 0;
    private isFinished = false;
    private position: Vector;

    constructor(private bezierCurveList: BezierCurve[]) {
        this.position = bezierCurveList[bezierCurveList.length - 1].getStartPoint();
    }

    update(delta: number): void {
        const curveDt = this.bezierCurveList[this.currCurveIndex].calcLinearDeltaTime(this.t, delta * SPEED);

        this.t += curveDt;

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
