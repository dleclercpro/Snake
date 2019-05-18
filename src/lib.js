export const range = (x) => {
    return [...Array(x).keys()];
};

export const keyToDirection = (key) => {
    switch (key) {
        case 'ArrowUp':
            return 'Up';

        case 'ArrowRight':
            return 'Right';

        case 'ArrowDown':
            return 'Down';

        case 'ArrowLeft':
            return 'Left';

        default:
            return null;
    }
}
