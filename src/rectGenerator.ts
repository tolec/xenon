import {EditableRect} from "./editableRect";

export default class RectGenerator {
    private container: HTMLElement;
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

    constructor(container: HTMLElement) {
        this.container = container;
        this.listen();
    }

    listen() {
        document.addEventListener('keydown', this.onKeydown.bind(this));
        this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.container.addEventListener('mouseup', this.onMouseUp.bind(this));
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
            const index = this.rectList.indexOf(this.currEditRect);

            this.rectList.splice(index, 1);
        }
    }

    moveRect(x: number, y: number) {
        this.currEditRect?.setPosition(
            x - this.movingRectDeltaX,
            y - this.movingRectDeltaY
        );
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
        const {x, y, w, h} = this.getCurrentRect();

        if (w > 0 || h > 0) {
            this.rectList.push(new EditableRect(x, y, w, h));
            this.startEdit(this.rectList[this.rectList.length - 1]);
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

        return {x, y, w, h};
    }

    draw(ctx: CanvasRenderingContext2D) {
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

        const {x, y, w, h} = this.getCurrentRect();

        ctx.fillStyle = 'rgb(255, 239, 34, .4)';
        ctx.fillRect(x, y, w, h);
    }
}
