import React from 'react'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import './ChessBoard.css'
import { boardDefaultProps, startPieces } from './chessboard-constants'

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
            top: '50px',
            pieces: startPieces,
            squares: [],
            highlighted: props.highlighted
        };

        this.handleTileInteract = this.handleTileInteract.bind(this)
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
            <DndProvider backend={HTML5Backend}>
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
            </DndProvider>
        );
    }

    createTiles() {
        let squares = []
        let size = this.state.squareSize
        let pieces = this.state.pieces
        let colorParity = 0
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                let position = {
                    x: file * size,
                    y: rank * size
                }

                let piece
                if (pieces[file + (rank * 8)]) {
                    piece = <Piece
                        id={file + (rank * 8)}
                        icon={pieces[file + (rank * 8)]}
                        boardCallback={this.handleTileInteract}
                    />
                } else {
                    piece = null
                }

                squares.push(
                    <Tile
                        key={'tile' + colorParity}
                        id={file + (rank * 8)}
                        color={(this.state.highlighted == file + (rank * 8)) ?
                            'rgb(70,70,200)' : this.state.colors[colorParity % 2]}
                        size={size}
                        position={position}
                        piece={piece}
                        clickCallback={this.handleTileInteract}
                    />
                );
                colorParity++;
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

    handleTileInteract(tileId, isDragging = false) {
        this.handleTileClick(tileId)
    }

    handleTileClick(tileId) {
        if (!this.state.highlighted &&
            this.state.highlighted !== 0) {
            if (this.state.pieces[tileId] === null) {
                return
            }
            this.setState({ highlighted: tileId },
                () => {
                    this.createTiles()
                })
        } else {
            this.movePiece(this.state.highlighted, tileId)
        }

    }

    movePiece(fromTileId, toTileId) {
        let pieces = this.state.pieces
        let fromPiece = pieces[fromTileId]
        pieces[fromTileId] = null
        pieces[toTileId] = fromPiece

        this.setState({ highlighted: null, pieces: pieces },
            () => {
                this.createTiles()
            })
    }
}

ChessBoard.defaultProps = boardDefaultProps

export default ChessBoard