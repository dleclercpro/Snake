import React from 'react';
import './Scores.css';

function Scores(props) {
    return (
        <table className="scores">
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Score</td>
                </tr>
            </thead>
            <tbody>
            {props.values.map((value, index) => (
                <tr>
                    <td>{value[0]}</td>
                    <td>{value[1]}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default Scores;
