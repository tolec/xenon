import Game from './game';

const STAR_MAX_SIZE = 4;

export default class StarrySky {
    private game: Game;
    private skySpeed: number;
    private starsPer100x100: number;
    public stars: Star[];

    constructor(game: Game) {
        this.game = game;
        this.skySpeed = 12;
        this.starsPer100x100 = 5;
        this.stars = [];

        this.generateNewStars(this.game.height);
    }

    update(delta: number) {
        const dy = this.skySpeed * delta;

        this.generateNewStars(dy);

        this.stars = this.stars.filter(star => star.y < this.game.height);
        this.stars.forEach(star => (star.y += dy));
    }

    generateNewStars(height: number) {
        const area = height * this.game.width;
        const starsNumber = (area / (100 * 100)) * this.starsPer100x100;

        for (let i = 1; i < starsNumber; i++) {
            this.stars.push(this.generateStar(height));
        }

        if (Math.random() < starsNumber % 1) {
            this.stars.push(this.generateStar(height));
        }
    }

    generateStar(areaHeight: number) {
        const x = Math.random() * this.game.width;
        const y = Math.random() * areaHeight;
        const size = Math.random() * STAR_MAX_SIZE;
        const opacity = 0.5 + Math.random() * 0.5;

        return new Star(x, y, size, opacity);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.stars.forEach(star => {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity.toFixed(1)})`;
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }
}

class Star {
    public x: number;
    public y: number;
    public size: number;
    public opacity: number;

    constructor(x: number, y: number, size: number, opacity: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.opacity = opacity;
    }
}
