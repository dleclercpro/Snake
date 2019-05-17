import React from 'react';
import './Cell.css';

function Cell({index}) {
    return (
        <div className="cell" key={index}></div>
    );
}

export default Cell;