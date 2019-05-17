import React from 'react';
import Cell from './Cell';
import './Row.css';

function Row({index, size}) {
    const indices = [...Array(size).keys()];

    return (
        <div className="row" key={index}>
            {indices.map((v, i) => (
                <Cell index={i} />
            ))}        
        </div>
    );
}

export default Row;