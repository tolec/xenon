type StorageRect = { x: number, y: number, w: number, h: number };

export default class RectStorage {
    setRectList(recList: StorageRect[]) {
        localStorage.setItem('rectList', JSON.stringify(recList));
    }

    getRectList(): StorageRect[] {
        const rectListStr = localStorage.getItem('rectList');

        if (rectListStr === null) {
            return [];
        }

        try {
            const rectList = JSON.parse(rectListStr);

            if (Array.isArray(rectList)) {
                return rectList;
            } else {
                throw new Error();
            }
        } catch (e) {
            alert('error parsing rectList');
        }

        return [];
    }
}
