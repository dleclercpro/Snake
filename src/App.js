import React from 'react';
import Grid from './Grid';
import Scores from './Scores';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scores: [['-', 0]],
        };
    }

    render() {
        return (
            <React.Fragment>
                <Grid />
                <Scores values={this.state.scores} />
            </React.Fragment>
        );
    }
}

export default App;
