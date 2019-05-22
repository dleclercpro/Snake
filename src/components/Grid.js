import React from 'react';
import Row from './Row';
import lib from '../lib';
import './Grid.css';

class Grid extends React.Component {
    static directions = {
        'Up': [0, -1],
        'Right': [1, 0],
        'Down': [0, 1],
        'Left': [-1, 0],
    };

    static oppositeDirections = {
        'Up': 'Down',
        'Right': 'Left',
        'Down': 'Up',
        'Left': 'Right',
    };

    handleCellState = (coordinates) => {

        // Get position
        const position = lib.coordinatesToPosition(coordinates, this.props.size);

        // Snake
        if (this.props.snake.includes(position)) {
            return 'snake';
        }

        // Food
        if (this.props.food.includes(position)) {
            return 'food';
        }

        // Empty
        return '';
    }

    render() {
        return (
            <div className='grid'>
                {lib.getRange(this.props.size).map((value, index) => (
                    <Row key={index} index={index} size={this.props.size} handleCellState={this.handleCellState} />
                ))}
            </div>
        );
    }
}

export default Grid;
