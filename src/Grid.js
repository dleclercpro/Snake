import React from 'react';
import Row from './Row';
import {range, positionToCoordinates, coordinatesToPosition} from './lib';
import './Grid.css';

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.size = 25;
        this.range = range(this.size);
        this.state = {
            snake: [0, 1, 2],
            direction: 'right',
        };
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown, false);
        this.timerID = setInterval(() => this.moveSnake(), 250);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown, false);
        clearInterval(this.timerID);
    }

    moveSnake() {
        let dx, dy;
        const size = this.size;
        const newSnake = this.state.snake;

        switch (this.state.direction) {
            case 'up':
                dx = 0;
                dy = -1;
                break;

            case 'right':
                dx = 1;
                dy = 0;
                break;

            case 'down':
                dx = 0;
                dy = 1;
                break;

            case 'left':
                dx = -1;
                dy = 0;
                break;
        }

        this.setState({
            snake: newSnake.map((position) => {
                const [y, x] = positionToCoordinates(position, size);

                return coordinatesToPosition([(y + dy) % size, (x + dx) % size], size);
            }),
        });
    }

    handleKeyDown = (e) => {
        let direction;

        switch(e.code) {
            case 'ArrowUp':
                direction = 'up';
                break;

            case 'ArrowRight':
                direction = 'right';
                break;

            case 'ArrowDown':
                direction = 'down';
                break;

            case 'ArrowLeft':
                direction = 'left';
                break;
        }

        this.setState({
            direction: direction,
        })
    }

    handleCellState = (position) => {
        return this.state.snake.includes(position) ? 'snake' : '';
    }

    render() {
        return (
            <div className="grid">
                {this.range.map((value, index) => (
                    <Row key={index} index={index} size={this.size} handleCellState={this.handleCellState} />
                ))}
            </div>
        );
    }
}

export default Grid;