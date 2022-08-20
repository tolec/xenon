import { Position } from '../position';

export interface PathFollow {
    update(delta: number): void;
    getPosition(): Position;
    isFinish(): boolean;
    draw(ctx: CanvasRenderingContext2D): void;
}
