import React from 'react';
import './Cell.css';

function Cell(props) {
    return (
        <div className={`cell ${props.handleCellState(props.coordinates)}`}></div>
    );
}

export default Cell;
