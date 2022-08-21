import { Vector } from '../Vector';

export abstract class BezierCurve {
    abstract getStartPoint(): Vector;
    abstract getEndPoint(): Vector;
    abstract calcPosition(t: number): Vector;
    abstract calcLinearDeltaTime(t: number, len: number): number; // https://gamedev.stackexchange.com/a/27138/166559
}
