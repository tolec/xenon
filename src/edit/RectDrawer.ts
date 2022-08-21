import { EditableRect } from './EditableRect';
import Game from '../Game';
import Wall from '../units/Wall';
import RectStorage from '../help/RectStorage';

export default class RectDrawer {
    private game: Game;
    private container: HTMLElement;
    private wall: Wall;
    private rectStorage: RectStorage;
    private isDrawStarted: boolean;
    private isDrawing: boolean;
    private startX: number;
    private startY: number;
    private currentX: number;
    private currentY: number;
    private rectList: EditableRect[] = [];
    private isMoving: boolean;
    private currHoverRect: EditableRect | null;
    private currEditRect: EditableRect | null;
    private movingRectDeltaX: number;
    private movingRectDeltaY: number;

    constructor(game: Game, container: HTMLElement) {
        this.game = game;
        this.container = container;
        this.wall = new Wall(game);
        this.rectStorage = new RectStorage();

        this.onKeydown = this.onKeydown.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.restoreRectList();
        this.listen();
    }

    destroy() {
        this.unListen();
    }

    storeRectList() {
        this.rectStorage.setRectList(this.getOrigImageRectList());
    }

    restoreRectList() {
        this.rectList = this.mapOrigToGameRectList(this.rectStorage.getRectList());
    }

    getOrigImageRectList() {
        const image = this.wall.getImage();
        const scale = this.game.width / image.width;

        return this.rectList.map(rect => {
            const x = rect.x / scale;
            const y = rect.y / scale + this.wall.position;
            const w = rect.w / scale;
            const h = rect.h / scale;

            return { x, y, w, h };
        });
    }

    mapOrigToGameRectList(storageRectList: Array<{ x: number; y: number; w: number; h: number }>) {
        const image = this.wall.getImage();
        const scale = this.game.width / image.width;

        return storageRectList.map(rect => {
            const x = Math.round(rect.x * scale);
            const y = Math.round((rect.y - this.wall.position) * scale);
            const w = Math.round(rect.w * scale);
            const h = Math.round(rect.h * scale);

            return new EditableRect({
                x,
                y,
                w,
                h,
                container: this.container,
                onChange: this.onRectChange.bind(this),
            });
        });
    }

    onRectChange() {
        this.storeRectList();
    }

    listen() {
        document.addEventListener('keydown', this.onKeydown);
        this.container.addEventListener('mousedown', this.onMouseDown);
        this.container.addEventListener('mousemove', this.onMouseMove);
        this.container.addEventListener('mouseup', this.onMouseUp);
    }

    unListen() {
        document.removeEventListener('keydown', this.onKeydown);
        this.container.removeEventListener('mousedown', this.onMouseDown);
        this.container.removeEventListener('mousemove', this.onMouseMove);
        this.container.removeEventListener('mouseup', this.onMouseUp);
    }

    onKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Backspace':
            case 'Delete':
                return this.onPressDelete();
            case 'Escape':
                return this.stopEdit();
        }
    }

    onMouseDown(event: MouseEvent) {
        const x = event.offsetX;
        const y = event.offsetY;

        this.startX = x;
        this.startY = y;

        if (this.currEditRect?.isResizing(x, y)) {
            return;
        }

        if (this.currEditRect?.hasPoint(x, y)) {
            this.isMoving = true;
            this.movingRectDeltaX = x - this.currEditRect.x;
            this.movingRectDeltaY = y - this.currEditRect.y;
        } else {
            this.isDrawStarted = true;
            this.isDrawing = false;
        }
    }

    onMouseMove(event: MouseEvent) {
        const x = event.offsetX;
        const y = event.offsetY;

        if (this.isMoving) {
            this.moveRect(x, y);
        } else if (this.isDrawStarted) {
            this.isDrawing = true;
            this.currentX = x;
            this.currentY = y;
            this.stopEdit();
        } else {
            this.processHover(x, y);
        }
    }

    onMouseUp(event: MouseEvent) {
        if (this.isDrawing) {
            this.finishDrawRect();
        } else {
            const x = event.offsetX;
            const y = event.offsetY;

            if (x === this.startX && y === this.startY) {
                this.onClickPoint(x, y);
            }
        }

        this.isDrawStarted = false;
        this.isDrawing = false;
        this.isMoving = false;
    }

    onClickPoint(x: number, y: number) {
        if (this.currEditRect?.hasPoint(x, y)) {
            return;
        }

        const rect = this.findRect(x, y);

        if (rect) {
            this.startEdit(rect);
        } else {
            this.stopEdit();
        }
    }

    onPressDelete() {
        if (this.currEditRect) {
            this.deleteRect(this.currEditRect);
            this.currEditRect = null;
        }
    }

    moveRect(x: number, y: number) {
        this.currEditRect?.setPosition(x - this.movingRectDeltaX, y - this.movingRectDeltaY);
        this.storeRectList();
    }

    processHover(x: number, y: number) {
        const rectToHover = this.findHoverableRect(x, y);

        if (this.currHoverRect && this.currHoverRect !== rectToHover) {
            this.currHoverRect.setHover(false);
        }

        if (rectToHover) {
            this.currHoverRect = rectToHover;
            rectToHover.setHover(true);
        } else {
            this.currHoverRect = null;
        }
    }

    findHoverableRect(x: number, y: number): EditableRect | undefined {
        if (this.currEditRect?.hasPoint(x, y)) {
            return this.currEditRect;
        }

        return this.findRect(x, y);
    }

    findRect(x: number, y: number) {
        return this.rectList.find(rect => rect.hasPoint(x, y));
    }

    finishDrawRect() {
        const { x, y, w, h } = this.getCurrentRect();

        if (w > 0 || h > 0) {
            this.addRect(
                new EditableRect({
                    x,
                    y,
                    w,
                    h,
                    container: this.container,
                    onChange: this.onRectChange.bind(this),
                }),
            );
            this.startEdit(this.rectList[this.rectList.length - 1]);
        }
    }

    addRect(rect: EditableRect) {
        this.rectList.push(rect);
        this.storeRectList();
    }

    deleteRect(rect: EditableRect) {
        const index = this.rectList.indexOf(rect);

        if (index >= 0) {
            this.rectList.splice(index, 1);
            this.storeRectList();
        }
    }

    startEdit(rect: EditableRect) {
        if (rect === this.currEditRect) {
            return;
        }

        this.currEditRect?.setIsEditing(false);
        this.currEditRect = rect;
        this.currEditRect.setIsEditing(true);
    }

    stopEdit() {
        this.currEditRect?.setIsEditing(false);
        this.currEditRect = null;
    }

    getCurrentRect() {
        const x = Math.min(this.startX, this.currentX);
        const y = Math.min(this.startY, this.currentY);
        const w = Math.abs(this.startX - this.currentX);
        const h = Math.abs(this.startY - this.currentY);

        return { x, y, w, h };
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.wall.draw(ctx);
        this.drawRectList(ctx);
        this.drawCurrentDrawRect(ctx);
    }

    drawRectList(ctx: CanvasRenderingContext2D) {
        this.rectList.forEach(rect => {
            rect.draw(ctx);
        });
    }

    drawCurrentDrawRect(ctx: CanvasRenderingContext2D) {
        if (!this.isDrawing) {
            return;
        }

        const { x, y, w, h } = this.getCurrentRect();

        ctx.fillStyle = 'rgb(255, 239, 34, .4)';
        ctx.fillRect(x, y, w, h);
    }
}
