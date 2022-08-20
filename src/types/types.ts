import { Position } from '../Position';

export interface PathFollow {
    update(delta: number): void;
    getPosition(): Position;
    isFinish(): boolean;
    draw(ctx: CanvasRenderingContext2D): void;
}
