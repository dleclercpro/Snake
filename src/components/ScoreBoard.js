import React from 'react';
import './ScoreBoard.css';

class ScoreBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        };
    }

    handleNameChange = (e) => {
        this.setState({
            name: e.target.value,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.addScore(this.state.name, this.props.score);
        this.props.restartGame();
    }

    render() {
        return (
            <React.Fragment>
                <form className='newScore' onSubmit={this.handleSubmit}>
                    <label>
                        <p>Enter your name:</p>
                        <input type='text' value={this.state.name} ref="newScoreInput" onChange={this.handleNameChange} required />
                    </label>
                    <input type='submit' value="SUBMIT" />
                </form>

                <p className='score'>Score: {this.props.score}</p>

                <table className='scoreBoard'>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Score</td>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.scores.map((value, index) => (
                        <tr key={index}>
                            <td>{value[0]}</td>
                            <td>{value[1]}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

export default ScoreBoard;
