import React from 'react';
import Row from './Row';
import {range, keyToDirection} from './lib';
import './Grid.css';

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.size = 25;
        this.center = Math.ceil(this.size / 2) - 1;
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
            snake: range(3),
            food: [this.coordinatesToPosition([this.center, this.center])],
            speed: 100,
            direction: 'Right',
        };
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown, false);
        this.timerID = setInterval(() => this.moveSnake(), this.state.speed);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown, false);
        clearInterval(this.timerID);
    }

    moveSnake() {
        const [dx, dy] = this.directions[this.state.direction];
        const size = this.size;
        const newSnake = this.state.snake;
        const headCoordinates = this.positionToCoordinates(newSnake[newSnake.length - 1], size);
        let newHeadCoordinates;

        // Determine new snake head coordinates
        newHeadCoordinates = [
            (headCoordinates[0] + size + dy) % size,
            (headCoordinates[1] + size + dx) % size
        ];

        // Rewrite snake position
        newSnake.shift();
        newSnake.push(this.coordinatesToPosition(newHeadCoordinates, size));

        this.setState({
            snake: newSnake,
        });
    }

    handleKeyDown = (e) => {

        // Get direction
        const direction = keyToDirection(e.code);

        // No arrow key pressed
        // Same direction
        // Opposite direction
        if (!direction ||
            direction === this.state.direction ||
            direction === this.opposites[this.state.direction]) {
            return;
        }

        this.setState({
            direction: direction,
        });
    }

    handleCellState = (coordinates) => {

        // Get position
        const position = this.coordinatesToPosition(coordinates);

        // Snake
        if (this.state.snake.includes(position)) {
            return 'snake';
        }

        // Food
        if (this.state.food.includes(position)) {
            return 'food';
        }

        // Empty
        return '';
    }

    positionToCoordinates(position) {
        return [Math.floor(position / this.size), position % this.size];
    }

    coordinatesToPosition(coordinates) {
        return this.size * coordinates[0] + coordinates[1];
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
