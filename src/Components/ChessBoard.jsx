import React from 'react'
import './ChessBoard.css'
import { boardDefaultProps } from './chessboard-defaults'

import {
    king, queen, bishop, rook, knight, pawn,
    king2, queen2, bishop2, rook2, knight2, pawn2
} from "../res/"

import Piece from "./Piece"
import Tile from './Tile'

class ChessBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            colors: [props.lightColor, props.darkColor],
            squareSize: props.squareSize,
            boardSize: [props.squareSize * 8, props.squareSize * 8],
            left: '50px',
            top: '50px'
        };
    }

    componentDidMount() {
        this.createTiles()

        document.addEventListener("contextmenu", (event) => {
            if (this.eventIsOverBoard(event)) {
                event.preventDefault();
            }
        });
    }

    onDragOver(e) {
        e.preventDefault();
    }

    render() {
        return (
            <div id="chessboard"
                onDragOver={(e) => this.onDragOver(e)}
                style={
                    {
                        'left': this.state.left,
                        'top': this.state.top,
                        'width': this.state.boardSize[0],
                        'height': this.state.boardSize[1]
                    }
                }>
                {this.state.squares}
            </div>
        );
    }

    createTiles() {
        let squares = []
        let size = this.state.squareSize;
        let pieces = [
            rook2, knight2, bishop2, queen2, king2, bishop2, knight2, rook2,
            pawn2, pawn2, pawn2, pawn2, pawn2, pawn2, pawn2, pawn2,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
            rook, knight, bishop, queen, king, bishop, knight, rook
        ]
        let pieceIndex = 0
        let colorParity = 0
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                let position = {
                    x: file * size,
                    y: rank * size
                }

                let piece
                if (pieces[pieceIndex]) {
                    piece = <Piece icon={pieces[pieceIndex]} />
                } else {
                    piece = null
                }

                squares.push(
                    <Tile
                        key={'tile' + colorParity}
                        color={this.state.colors[colorParity % 2]}
                        size={size}
                        position={position}
                        piece={piece}
                    />
                );
                colorParity++;
                pieceIndex++;
            }
            colorParity++;
        }
        this.setState({ squares: squares },
            () => console.log("createTiles() complete"));
    }

    eventIsOverBoard(event) {
        return (event.pageX > 50 &&
            event.pageX < (50 + (this.state.boardSize[0])) &&
            event.pageY > 50 &&
            event.pageY < (50 + (this.state.boardSize[1])))
    }
}

ChessBoard.defaultProps = boardDefaultProps

export default ChessBoard;