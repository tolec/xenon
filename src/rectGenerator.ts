export default class RectGenerator {
    private container: HTMLElement;
    private isDragStarted: boolean;
    private isDragging: boolean;
    private startX: number;
    private startY: number;
    private currentX: number;
    private currentY: number;
    private rectList: Rect[];

    constructor(container: HTMLElement) {
        this.container = container;
        this.rectList = [];
        this.listen();
    }

    listen() {
        document.addEventListener('keydown', this.onKeydown.bind(this));
        this.container.addEventListener('click', this.onClick.bind(this));
        this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.container.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onClick() {

    }

    onKeydown() {

    }

    onMouseDown(event: DragEvent) {
        const x = event.offsetX;
        const y = event.offsetY;
        const rect = this.findRect(x, y);

        if (rect) {
            this.selectRect(rect);
            return;
        }

        this.isDragStarted = true;
        this.isDragging = false;
        this.startX = x;
        this.startY = y;
    }

    onMouseMove(event: DragEvent) {
        if (this.isDragStarted) {
            this.isDragging = true;
            this.currentX = event.offsetX;
            this.currentY = event.offsetY;
        }
    }

    onMouseUp(event: DragEvent) {
        if (this.isDragging) {
            this.finishRect();
        }

        this.isDragStarted = false;
        this.isDragging = false;
    }

    findRect(x: number, y: number) {
        return this.rectList.find(rect => rect.hasPoint(x, y));
    }

    finishRect() {
        const {x, y, w, h} = this.getCurrentRect();

        if (w > 0 || h > 0) {
            this.rectList.push(new Rect(x, y, w, h));
        }
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
        this.drawCurrentRect(ctx);
    }

    drawRectList(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'rgb(14, 209, 255, .4)';

        this.rectList.forEach(({x, y, w, h}) => {
            ctx.fillRect(x, y, w, h);
        });
    }

    drawCurrentRect(ctx: CanvasRenderingContext2D) {
        if (!this.isDragging) {
            return;
        }

        const {x, y, w, h} = this.getCurrentRect();

        ctx.fillStyle = 'rgb(255, 239, 34, .4)';
        ctx.fillRect(x, y, w, h);
    }

    selectRect(rect: Rect) {
        console.log(rect);
    }
}

class Rect {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    hasPoint(x: number, y: number) {
        return (
            x >= this.x && x <= this.x + this.w &&
            y >= this.y && y <= this.y + this.h
        );
    }
}
