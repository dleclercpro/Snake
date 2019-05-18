import React from 'react';
import Cell from './Cell';
import {getRange} from './lib';
import './Row.css';

function Row(props) {
    return (
        <div className="row">
            {getRange(props.size).map((value, index) => (
                <Cell key={index} index={index} size={props.size} coordinates={[props.index, index]} handleCellState={props.handleCellState} />
            ))}
        </div>
    );
}

export default Row;
