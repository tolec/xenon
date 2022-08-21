import { PathFollow } from '../types/types';
import { Position } from '../primitive/Position';
import { BezierCurvePath } from './BezierCurvePath';
import { Vector } from '../primitive/Vector';
import { BezierCurveLinear } from '../bezierCurve/BezierCurveLinear';
import { BezierCurveQuadratic } from '../bezierCurve/BezierCurveQuadratic';
import { BezierCurveCubic } from '../bezierCurve/BezierCurveCubic';

export class EnemyPath implements PathFollow {
    private path: BezierCurvePath;

    constructor() {
        const bezierCurveList = [
            new BezierCurveLinear(new Vector(-100, -100), new Vector(100, 100)),
            new BezierCurveLinear(new Vector(100, 100), new Vector(200, 200)),
            new BezierCurveQuadratic(new Vector(200, 200), new Vector(300, 300), new Vector(400, 200)),
            new BezierCurveCubic(
                new Vector(400, 200),
                new Vector(500, 100),
                new Vector(500, 300),
                new Vector(400, 400),
            ),
        ];

        this.path = new BezierCurvePath(bezierCurveList);
    }

    update(delta: number) {
        this.path.update(delta);
    }

    getPosition(): Position {
        return this.path.getPosition();
    }

    isFinish() {
        return this.path.isFinish();
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.path.draw(ctx);

        const point = this.getPosition();

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}
