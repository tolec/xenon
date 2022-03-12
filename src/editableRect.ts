import {Rect} from "./rect";

export class EditableRect extends Rect {
    private isEditing: boolean;
    private smallRectList: null | Rect[] = null;
    private isHover: boolean;

    setPosition(x: number, y: number) {
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
        }
    }

    setHover(isHover: boolean) {
        this.isHover = isHover;
    }

    reCreateSmallRectList() {
        const {x, y, w, h} = this;

        this.smallRectList = [
            this.createSmallRect(x, y),
            this.createSmallRect(x + w, y),
            this.createSmallRect(x, y + h),
            this.createSmallRect(x + w, y + h),

            this.createSmallRect(x + w / 2, y),
            this.createSmallRect(x + w, y + h / 2),
            this.createSmallRect(x + w / 2, y + h),
            this.createSmallRect(x, y + h / 2),
        ];
    }

    createSmallRect(x, y) {
        const size = 6;
        return new Rect(x - size / 2, y - size / 2, size, size);
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
    }

    drawSmallRectList(ctx: CanvasRenderingContext2D) {
        if (!this.smallRectList) {
            return;
        }

        ctx.fillStyle = 'white';
        this.smallRectList.forEach(({x, y, w, h}) => {
            ctx.fillRect(x, y, w, h);
        });
    }
}
