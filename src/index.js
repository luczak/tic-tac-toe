import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square({ value, winning, onClick }) {
    let className = "square";
    if (winning) { className += " winning-square"; }
    return (
        <button className={className} onClick={onClick}>
            {value}
        </button>
    );
}

class Board extends React.Component {
    render() {
        const rows = [];
        for (let i = 0; i < 3; i++) {
            rows.push(this.renderRow(i));
        }
        return <div>{rows}</div>;
    }

    renderRow(i) {
        const squares = [];
        for (let j = 0; j < 3; j++) {
            squares.push(this.renderSquare(i + j * 3));
        }
        return <div key={i} className="board-row">{squares}</div>;
    }

    renderSquare(i) {
        const winning = this.props.winner?.includes(i);
        return (
            <Square
                key={i}
                winning={winning}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            ascending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) { return; }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const position = {
            x: i % 3 + 1,
            y: Math.floor(i / 3) + 1,
        };
        this.setState({
            history: history.concat({ squares, position }),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    handleJump(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    handleToggleOrder() {
        this.setState(prevState => ({ ascending: !prevState.ascending }));
    }

    render() {
        const { history } = this.state;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
            status = `Winner: ${current.squares[winner[0]]}`;
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        const moves = history.map((step, move) => {
            let desc = `Go to ${move ? `move #${move} (${step.position.x}, ${step.position.y})` : 'game start'}`;
            if (move === this.state.stepNumber) {
                desc = <b>{desc}</b>;
            }
            return (
                <li key={move}>
                    <button onClick={() => this.handleJump(move)}>{desc}</button>
                </li>
            );
        });
        if (!this.state.ascending) { moves.reverse(); }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        winner={winner}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.handleToggleOrder()}>
                        Order - {this.state.ascending ? 'ASC' : 'DESC'}
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return line;
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
