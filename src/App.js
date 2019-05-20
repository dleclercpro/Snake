import React from 'react';
import Grid from './components/Grid';
import ScoreBoard from './components/ScoreBoard';
import lib from './lib';
import _ from 'lodash';

const INIT_STATE = {
    status: '',
    score: 3,
    snake: lib.getRange(3),
    food: [],
    speed: 300,
    direction: 'Right',
    lastDirection: '',
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.size = 40;
        this.nScores = 5;
        this.minSpeed = 50;
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
        this.timerID = setInterval(this.moveSnake, this.state.speed);
    }

    stopTimer = () => {
        clearInterval(this.timerID);
    }

    restartTimer = () => {
        this.stopTimer();
        this.startTimer();
    }

    startGame = () => {
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

    restartGame = () => {
        this.stopGame();
        this.setState(_.cloneDeep(INIT_STATE), () => {
            this.startGame();
        });
    }

    moveSnake = () => {

        // Get useful info
        const [dx, dy] = Grid.directions[this.state.direction];
        const head = lib.positionToCoordinates(this.state.snake[this.state.snake.length - 1], this.size);
        const newHead = [head[0] + dy, head[1] + dx];

        // Check if move is allowed
        if (!this.isMoveValid(newHead)) {

            // Stop game
            this.stopGame();

            // Exit
            return;
        }

        // Update snake
        this.setState((state, props) => {

            // Get old snake
            const newSnake = state.snake;

            // Snake will eat food
            if (this.willEatFood(newHead)) {

                // Do it
                this.eatFood(newHead);

                // Add new food to grid
                this.spawnFood();

                // Speed game up
                this.updateSpeed();
            }

            // Otherwise
            else {

                // Remove tail
                newSnake.shift();
            }

            // Move head
            newSnake.push(lib.coordinatesToPosition(newHead, this.size));

            // Update snake
            return {
                snake: newSnake,
                lastDirection: state.direction,
            };
        });
    }

    isMoveValid = (head) => {
        return !this.state.snake.includes(lib.coordinatesToPosition(head, this.size)) &&
            0 <= head[0] && head[0] < this.size &&
            0 <= head[1] && head[1] < this.size;
    }

    willEatFood = (head) => {
        return this.state.food.includes(lib.coordinatesToPosition(head, this.size));
    }

    eatFood = (food) => {

        // Eat something
        this.setState((state, props) => {

            // Get old food array
            const newFood = state.food;

            // Remove eaten food
            newFood.splice(newFood.indexOf(food), 1);

            // Update food array
            return {
                food: newFood,
            };
        });

        // Update score
        this.updateScore();
    }

    spawnFood = () => {

        // Replenish food
        while (true) {

            // Generate new food
            const food = lib.getRandomInt(Math.pow(this.size, 2));

            // New food cannot be spawn where snake is
            if (!this.state.snake.includes(food)) {

                // Add food
                this.setState((state, props) => {

                    // Get old food array
                    const newFood = state.food;

                    // Add new food to it
                    newFood.push(food);

                    // Update food array
                    return {
                        food: newFood,
                    };
                });

                // Exit
                return;
            }
        }
    }

    updateSpeed = (factor = 0.9) => {

        // Define new speed using factpr
        this.setState((state, props) => ({
            speed: Math.max(this.minSpeed, Math.floor(state.speed * factor)),
        }));

        // Restart timer
        this.restartTimer();
    }

    updateScore = (increment = 1) => {

        // Increment current score
        this.setState((state, props) => ({
            score: state.score + increment,
        }));
    }

    addScore = (name, score) => {

        // Update score board
        this.setState((state, props) => {

            // Define new entry
            const newEntry = [name, score];

            // Define new scores
            let newScores = [...state.scores, newEntry];

            // Keep best
            if (newScores.length > this.nScores) {

                // Get score values
                const scores = newScores.map((entry) => {
                    return entry[1];
                });

                // Remove it
                newScores.splice(scores.indexOf(Math.min(...scores)), 1);
            }

            // Redefine scores
            return {
                scores: newScores,
            };
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
                    restartGame={this.restartGame}
                />
            </div>
        );
    }
}

export default App;
