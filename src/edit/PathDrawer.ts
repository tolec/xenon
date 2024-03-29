export default class PathDrawer {
    private container: HTMLElement;
    private points: RectPoint[];
    private currentPoint: number;

    constructor(container: HTMLElement) {
        this.container = container;
        this.points = [];
        this.currentPoint = -1;

        this.onClick = this.onClick.bind(this);
        this.onKeydown = this.onKeydown.bind(this);

        this.listen();
    }

    destroy() {
        this.unListen();
    }

    listen() {
        this.container.addEventListener('click', this.onClick);
        document.addEventListener('keydown', this.onKeydown);
    }

    unListen() {
        this.container.removeEventListener('click', this.onClick);
        document.removeEventListener('keydown', this.onKeydown);
    }

    onClick(event: MouseEvent) {
        const { offsetX, offsetY } = event;
        const pointIndex = this.findPointIndex(offsetX, offsetY);

        if (pointIndex !== -1) {
            this.currentPoint = pointIndex;
        } else if (this.currentPoint !== -1) {
            this.currentPoint = -1;
        } else {
            this.points.push(new RectPoint(offsetX, offsetY));
            this.print();
        }
    }

    onKeydown(event: KeyboardEvent) {
        if ((event.code === 'Backspace' || event.code === 'Delete') && this.currentPoint !== -1) {
            this.points.splice(this.currentPoint, 1);
            this.print();

            this.currentPoint = -1;
        }
    }

    findPointIndex(x: number, y: number) {
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].hasPosition(x, y)) {
                return i;
            }
        }

        return -1;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.points.length === 0) {
            return;
        }

        ctx.strokeStyle = 'yellow';

        this.points.forEach((point, index) => {
            if (index === 0) {
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }

            ctx.fillStyle = index === this.currentPoint ? 'green' : 'yellow';
            ctx.fillRect(point.x - point.width / 2, point.y - point.height / 2, point.width, point.height);
        });

        ctx.stroke();
    }

    print() {
        // console.log(this.points.map(({x, y}) => ({x, y})));
    }
}

class RectPoint {
    x: number;
    y: number;
    width: number = 12;
    height: number = 12;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    hasPosition(x: number, y: number) {
        return (
            x >= this.x - this.width / 2 &&
            x < this.x + this.width / 2 &&
            y >= this.y - this.height / 2 &&
            y < this.y + this.height / 2
        );
    }
}
