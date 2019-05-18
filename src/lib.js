export const getRange = (x) => {
    return [...Array(x).keys()];
};

export const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

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
