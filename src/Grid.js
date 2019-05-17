import React from 'react';
import Row from './Row';
import './Grid.css';

const SIZE = 10;

function Grid() {
    const indices = [...Array(SIZE).keys()];

    return (
        <div className="grid">
            {indices.map((v, i) => (
                <Row index={i} size={SIZE} />
            ))}
        </div>
    );
}

export default Grid;