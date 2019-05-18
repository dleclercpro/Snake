import React from 'react';
import Row from './Row';
import {range, positionToCoordinates, coordinatesToPosition, keyToDirection} from './lib';
import './Grid.css';

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.size = 25;
        this.speed = 100;
        this.range = range(this.size);
        this.directions = {
            'Up': [0, -1],
            'Right': [1, 0],
            'Down': [0, 1],
            'Left': [-1, 0],
        };
        this.opposites = {
            'Up': 'Down',
            'Right': 'Left',
            'Down': 'Up',
            'Left': 'Right',
        }
        this.state = {
            snake: [0, 1, 2],
            direction: 'Right',
        };
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown, false);
        this.timerID = setInterval(() => this.moveSnake(), this.speed);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown, false);
        clearInterval(this.timerID);
    }

    moveSnake() {
        const [dx, dy] = this.directions[this.state.direction];
        const size = this.size;
        const newSnake = this.state.snake;
        const headCoordinates = positionToCoordinates(newSnake[newSnake.length - 1], size);
        let newHeadCoordinates;

        // Determine new snake head coordinates
        newHeadCoordinates = [
            (headCoordinates[0] + size + dy) % size,
            (headCoordinates[1] + size + dx) % size
        ];

        // Rewrite snake position
        newSnake[0] = newSnake[1];
        newSnake[1] = newSnake[2];
        newSnake[2] = coordinatesToPosition(newHeadCoordinates, size);

        this.setState({
            snake: newSnake,
        });
    }

    handleKeyDown = (e) => {

        // Get direction
        const direction = keyToDirection(e.code);

        // No arrow key pressed or same direction
        if (!direction || direction === this.state.direction || direction === this.opposites[this.state.direction]) {
            return;
        }

        this.setState({
            direction: direction,
        });
    }

    handleCellState = (position) => {
        return this.state.snake.includes(position) ? 'snake' : '';
    }

    render() {
        return (
            <div className='grid'>
                {this.range.map((value, index) => (
                    <Row key={index} index={index} size={this.size} handleCellState={this.handleCellState} />
                ))}
            </div>
        );
    }
}

export default Grid;
