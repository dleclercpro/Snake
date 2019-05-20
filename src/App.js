import React from 'react';
import Grid from './components/Grid';
import ScoreBoard from './components/ScoreBoard';
import lib from './lib';
import _ from 'lodash';

const INIT_STATE = {
    status: '',
    score: 3,
    snake: lib.getRange(3),
    food: -1,
    speed: 300,
    direction: 'Right',
    lastDirection: '',
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.size = 40;
        this.nScores = 5;
        this.state = {
            ..._.cloneDeep(INIT_STATE),
            scores: [],
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown, false);
        this.startGame();
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown, false);
        this.stopGame();
    }

    startTimer = () => {
        this.timerID = setInterval(() => this.moveSnake(), this.state.speed);
    }

    stopTimer = () => {
        clearInterval(this.timerID);
    }

    restartTimer = () => {
        this.stopTimer();
        this.startTimer();
    }

    startGame = () => {
        this.setState(_.cloneDeep(INIT_STATE));
        this.spawnFood();
        this.startTimer();
    }

    stopGame = () => {
        this.stopTimer();
        this.setState({
            status: 'lost',
        });
        this.refs.scoreBoard.refs.newScoreInput.focus();
    }

    moveSnake = () => {
        const newSnake = this.state.snake;
        const [dx, dy] = Grid.directions[this.state.direction];
        const head = lib.positionToCoordinates(newSnake[newSnake.length - 1], this.size);
        const newHead = [head[0] + dy, head[1] + dx];

        // Check if move is allowed
        if (!this.isMoveValid(newHead)) {

            // Stop game
            this.stopGame();

            // Exit
            return;
        }

        // Snake will eat food
        if (this.willEatFood(newHead)) {

            // Do it
            this.eatFood();

            // Add new food to grid
            this.spawnFood();

            // Speed game up
            this.updateSpeed(0.9);
        }

        // Otherwise
        else {

            // Remove tail
            newSnake.shift();
        }

        // Move head
        newSnake.push(lib.coordinatesToPosition(newHead, this.size));

        // Update game state
        this.setState({
            snake: newSnake,
            lastDirection: this.state.direction,
        });
    }

    isMoveValid = (head) => {
        return !this.state.snake.includes(lib.coordinatesToPosition(head, this.size)) &&
            0 <= head[0] && head[0] < this.size &&
            0 <= head[1] && head[1] < this.size;
    }

    willEatFood = (head) => {
        return this.state.food === lib.coordinatesToPosition(head, this.size);
    }

    eatFood = () => {

        // Remove food
        this.setState({
            food: -1,
        });

        // Update score
        this.updateScore();
    }

    spawnFood = () => {

        // Replenish food
        while (true) {

            // Generate new food
            const newFood = lib.getRandomInt(Math.pow(this.size, 2));

            // New food cannot be spawn where snake is
            if (!this.state.snake.includes(newFood)) {

                // Add food
                this.setState({
                    food: newFood,
                });

                // Exit
                return;
            }
        }
    }

    updateSpeed = (factor) => {

        // Define new speed using factpr
        const newSpeed = Math.max(50, Math.floor(this.state.speed * factor));

        // Update game state
        this.setState({
            speed: newSpeed,
        });

        // Restart timer
        this.restartTimer();
    }

    updateScore = () => {

        // Increment current score
        const newScore = this.state.score + 1;

        // Store it
        this.setState({
            score: newScore,
        });
    }

    addScore = (name, score) => {

        // Add new score
        let newScores = [...this.state.scores, [name, score]];

        // Keep 5 best
        if (newScores.length > this.nScores) {

            // Get score values
            const scores = newScores.map((entry) => {
                return entry[1];
            });

            // Get worst score
            const worstScore = Math.min(...scores);

            // Remove it
            newScores.splice(scores.indexOf(worstScore), 1);
        }

        // Update score board
        this.setState({
            scores: newScores,
        });
    }

    handleKeyDown = (e) => {

        // Get direction
        const newDirection = lib.keyToDirection(e.code);

        // No arrow key pressed
        // Same direction
        // Opposite direction to last move
        if (!newDirection ||
            (newDirection === this.state.direction) ||
            (this.state.lastDirection && newDirection === Grid.oppositeDirections[this.state.lastDirection])) {
            return;
        }

        // Update direction
        this.setState({
            direction: newDirection,
        });
    }

    render() {
        return (
            <div className={`game ${this.state.status}`}>
                <Grid
                    size={this.size}
                    snake={this.state.snake}
                    food={this.state.food}
                />
                <ScoreBoard
                    ref="scoreBoard"
                    score={this.state.score}
                    scores={this.state.scores}
                    addScore={this.addScore}
                    startGame={this.startGame}
                />
            </div>
        );
    }
}

export default App;
