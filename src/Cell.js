import React from 'react';
import {coordinatesToPosition} from './lib';
import './Cell.css';

function Cell(props) {
    return (
        <div className={`cell ${props.handleCellState(coordinatesToPosition(props.coordinates, props.size))}`}></div>
    );
}

export default Cell;