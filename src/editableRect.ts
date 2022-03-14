import {Rect} from "./rect";

type ResizeSide = 'n' | 'e' | 's' | 'w' | 'ne' | 'se' | 'sw' | 'nw';

interface EditableRectProps {
    x: number;
    y: number;
    w: number;
    h: number;
    container: HTMLElement;
    onChange: () => {};
}

export class EditableRect extends Rect {
    private isEditing?: boolean;
    private smallRectList: Rect[] | null = null;
    private isHover?: boolean;
    private container: HTMLElement;
    private cursor: string;
    private resizeSide: ResizeSide | null = null;
    private resizePosition: { x: number; y: number } | null = null;
    private onChange: () => {};

    constructor({x, y, w, h, container, onChange}: EditableRectProps) {
        super({x, y, w, h});
        this.container = container;
        this.onChange = onChange;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    setPosition(x: number, y: number, reCreateSmallRectList?: boolean) {
        super.setPosition(x, y);

        if (this.isEditing) {
            this.reCreateSmallRectList();
        }
    }

    setIsEditing(isEditing: boolean) {
        if (isEditing === this.isEditing) {
            return;
        }

        this.isEditing = isEditing;

        if (this.isEditing) {
            this.reCreateSmallRectList();
            this.startListen();
        } else {
            this.stopListen();
        }
    }

    startListen() {
        this.container.addEventListener('mousedown', this.onMouseDown);
        this.container.addEventListener('mousemove', this.onMouseMove);
        this.container.addEventListener('mouseup', this.onMouseUp);
    }

    stopListen() {
        this.container.removeEventListener('mousedown', this.onMouseDown);
        this.container.removeEventListener('mousemove', this.onMouseMove);
        this.container.removeEventListener('mouseup', this.onMouseUp);
    }

    onMouseDown(event: MouseEvent) {
        const x = event.offsetX;
        const y = event.offsetY;

        const smallRect = this.findSmallRect(x, y);

        if (smallRect) {
            this.startResize(smallRect, x, y);
        }
    }

    onMouseMove(event: MouseEvent) {
        const x = event.offsetX;
        const y = event.offsetY;

        if (this.resizeSide) {
            this.resize(x, y);
        }

        const smallRect = this.findSmallRect(x, y);

        this.processSmallRect(smallRect);
    }

    onMouseUp(event: MouseEvent) {
        this.stopResize();
    }

    startResize(smallRect: Rect, x: number, y: number) {
        const index = this.smallRectList?.indexOf(smallRect);

        if (index === undefined || index === -1) {
            return;
        }

        const mapIndexToSide = {
            0: 'nw', 1: 'ne', 2: 'se', 3: 'sw',
            4: 'n', 5: 'e', 6: 's', 7: 'w',
        };

        const resizeSide: ResizeSide = mapIndexToSide[index];

        if (resizeSide) {
            this.resizeSide = resizeSide;
            this.resizePosition = {x, y};
        }
    }

    resize(x: number, y: number) {
        if (!this.resizeSide || !this.resizePosition) {
            return;
        }

        for (const side of this.resizeSide.split('')) {
            switch (side) {
                case 'w': {
                    const maxX = this.x + this.w - 1;
                    const newX = x > maxX ? maxX : x;
                    const newW = this.x + this.w - newX;
                    this.setPosition(newX, this.y, false);
                    this.setSize(newW, this.h);
                    break;
                }
                case 'n': {
                    const maxY = this.y + this.h - 1;
                    const newY = y > maxY ? maxY : y;
                    const newW = this.y + this.h - newY;
                    this.setPosition(this.x, newY, false);
                    this.setSize(this.w, newW);
                    break;
                }
                case 'e': {
                    let w = x - this.x;
                    w < 1 && (w = 1);
                    this.setSize(w, this.h);
                    break;
                }
                case 's': {
                    let h = y - this.y;
                    h < 1 && (h = 1);
                    this.setSize(this.w, h);
                    break;
                }
            }
        }

        this.reCreateSmallRectList();
        this.onChange();
    }

    stopResize() {
        this.resizeSide = null;
        this.resizePosition = null;
    }

    isResizing(x: number, y: number) {
        return Boolean(this.resizeSide || this.findSmallRect(x, y));
    }

    setHover(isHover: boolean) {
        this.isHover = isHover;
    }

    findSmallRect(x: number, y: number) {
        return this.smallRectList?.find(rect => rect.hasPoint(x, y));
    }

    processSmallRect(rect?: Rect) {
        if (rect) {
            const index = this.smallRectList?.indexOf(rect);

            if (index === 0 || index === 2) {
                this.cursor = 'nwse-resize';
            } else if (index === 1 || index === 3) {
                this.cursor = 'nesw-resize';
            } else if (index === 4 || index === 6) {
                this.cursor = 'ns-resize';
            } else if (index === 5 || index === 7) {
                this.cursor = 'ew-resize';
            }
        } else {
            this.cursor = 'auto';
        }
    }

    reCreateSmallRectList() {
        const {x, y, w, h} = this;

        this.smallRectList = [
            this.createSmallRect(x, y),
            this.createSmallRect(x + w, y),
            this.createSmallRect(x + w, y + h),
            this.createSmallRect(x, y + h),

            this.createSmallRect(x + w / 2, y),
            this.createSmallRect(x + w, y + h / 2),
            this.createSmallRect(x + w / 2, y + h),
            this.createSmallRect(x, y + h / 2),
        ];
    }

    createSmallRect(x, y) {
        const size = 6;
        return new Rect({x: x - size / 2, y: y - size / 2, w: size, h: size});
    }

    draw(ctx: CanvasRenderingContext2D) {
        const {x, y, w, h} = this;

        if (this.isEditing) {
            if (this.isHover) {
                ctx.fillStyle = 'rgb(14, 209, 255, .7)';
            } else {
                ctx.fillStyle = 'rgb(14, 209, 255, .6)';
            }
        } else {
            if (this.isHover) {
                ctx.fillStyle = 'rgb(14, 209, 255, .5)';
            } else {
                ctx.fillStyle = 'rgb(14, 209, 255, .4)';
            }
        }

        ctx.fillRect(x, y, w, h);

        if (this.isEditing) {
            this.drawSmallRectList(ctx);
        }

        const canvas = document.getElementById('game') as HTMLCanvasElement;

        canvas.style.cursor = this.cursor;
    }

    drawSmallRectList(ctx: CanvasRenderingContext2D) {
        if (!this.smallRectList) {
            return;
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.smallRectList.forEach(({x, y, w, h}) => {
            ctx.fillRect(x, y, w, h);
        });
    }
}
