export const range = (x) => {
    return [...Array(x).keys()];
};

export const positionToCoordinates = (position, size) => {
    return [Math.floor(position / size), position % size];
}

export const coordinatesToPosition = (coordinates, size) => {
    return size * coordinates[0] + coordinates[1];
}