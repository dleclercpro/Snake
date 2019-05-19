import React from 'react';
import Row from './Row';
import _ from 'lodash';
import {getRange, getRandomInt, keyToDirection} from './lib';
import './Grid.css';

const INITIAL_STATE = {
    status: '',
    snake: getRange(3),
    food: [],
    speed: 300,
    direction: 'Right',
    last: '',
};

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.size = 40;
        this.center = Math.ceil(this.size / 2) - 1;
        this.range = getRange(this.size);
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
        };
        this.state = _.cloneDeep(INITIAL_STATE);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown, false);
        this.startGame();
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown, false);
        this.stopGame();
    }

    startTimer() {
        this.timerID = setInterval(() => this.moveSnake(), this.state.speed);
    }

    stopTimer() {
        clearInterval(this.timerID);
    }

    restartTimer() {
        this.stopTimer();
        this.startTimer();
    }

    startGame() {
        this.addFood();
        this.startTimer();
    }

    stopGame() {
        this.stopTimer();
        this.setState({
            status: 'lost',
        });
    }

    restartGame() {
        this.stopGame();
        this.setState(_.cloneDeep(INITIAL_STATE));
        this.startGame();
    }

    moveSnake() {
        const [dx, dy] = this.directions[this.state.direction];
        const newSnake = this.state.snake;
        const head = this.positionToCoordinates(newSnake[newSnake.length - 1]);
        let newHead;

        // Determine new snake head coordinates
        newHead = [head[0] + dy, head[1] + dx];

        // Check if move is allowed
        if (!this.isMoveValid(newHead)) {
            this.stopGame();
            return;
        }

        // Check if snake will eat food
        if (this.willEatFood(newHead)) {

            // Do it
            this.eatFood(newHead);

            // Replenish food
            this.addFood();

            // Speed up!
            this.updateSpeed(0.9);
        }
        else {
            newSnake.shift();
        }

        // Add head
        newSnake.push(this.coordinatesToPosition(newHead));

        this.setState({
            snake: newSnake,
            last: this.state.direction,
        });
    }

    isMoveValid(head) {
        return !this.state.snake.includes(this.coordinatesToPosition(head)) &&
            0 <= head[0] && head[0] < this.size &&
            0 <= head[1] && head[1] < this.size;
    }

    willEatFood(head) {
        return this.state.food.includes(this.coordinatesToPosition(head));
    }

    eatFood(food) {

        // Get food
        const newFood = this.state.food;

        // Eat something
        newFood.splice(newFood.indexOf(food), 1);

        this.setState({
            food: newFood,
        })
    }

    addFood() {

        // Get food
        const newFood = this.state.food;

        // Replenish food
        while (true) {

            // Generate new food
            const food = getRandomInt(this.size * this.size);

            // New food cannot be spawn where snake is
            if (!this.state.snake.includes(food)) {

                // Spawn new food
                newFood.push(food);

                this.setState({
                    food: newFood,
                });

                // Exit
                return;
            }
        }
    }

    updateSpeed(factor) {
        const newSpeed = Math.max(50, Math.floor(this.state.speed * factor));

        this.setState({
            speed: newSpeed,
        });

        this.restartTimer();
    }

    handleKeyDown = (e) => {

        // Restart
        if (e.code === 'Enter' || e.code === 'Space') {
            this.restartGame();
        }

        // Get direction
        const direction = keyToDirection(e.code);

        // No arrow key pressed
        // Same direction
        // Opposite direction to last move
        if (!direction ||
            (direction === this.state.direction) ||
            (this.state.last && direction === this.opposites[this.state.last])) {
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
            <div className={`grid ${this.state.status}`}>
                {this.range.map((value, index) => (
                    <Row key={index} index={index} size={this.size} handleCellState={this.handleCellState} />
                ))}
            </div>
        );
    }
}

export default Grid;
