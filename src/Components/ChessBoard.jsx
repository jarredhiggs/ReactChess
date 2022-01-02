import React from 'react'

import ConsoleLog from '../util/ConsoleLog'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import './ChessBoard.css'
import { boardDefaultProps, ChessContext, coordsToNotation } from './chessboard-constants'

import Piece from "./Piece"
import Tile from './Tile'

class ChessBoard extends React.Component {

    static contextType = ChessContext

    constructor(props, context) {
        super(props);

        this.state = {
            colors: [props.lightColor, props.darkColor],
            squareSize: props.squareSize,
            boardSize: [props.squareSize * 8, props.squareSize * 8],
            left: props.left,
            top: props.top,
            highlighted: props.highlighted,
            highlightColor: props.highlightColor,
            validHighlighted: props.validHighlighted,
            validHighlightColors: [
                props.validHighlightColorLight,
                props.validHighlightColorDark
            ]

        };

        this.handleTileInteract = this.handleTileInteract.bind(this)
    }

    componentDidMount() {
        this.createTiles(this.context.game.getBoard())

        document.addEventListener("contextmenu", (event) => {
            if (this.node.contains(event.target)) {
                event.preventDefault();
            }
        });
    }

    onDragOver(e) {
        e.preventDefault();
    }

    render() {
        return (
            <DndProvider backend={HTML5Backend} >
                <div id="chessboard"
                    onDragOver={(e) => this.onDragOver(e)}
                    ref={(node) => this.node = node}
                    style={
                        {
                            'left': this.state.left,
                            'top': this.state.top,
                            'width': this.state.boardSize[0],
                            'height': this.state.boardSize[1]
                        }
                    }>
                    {this.createTiles(this.context.game.getBoard())}
                </div>
            </DndProvider>
        );
    }

    createTiles(pieces) {
        let squares = []
        let size = this.state.squareSize
        let colorParity = 0
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                let position = {
                    x: file * size,
                    y: rank * size
                }

                let notation = coordsToNotation({ row: rank, col: file })

                let piece = pieces[rank][file]

                if (piece !== null) {
                    piece = <Piece
                        id={notation}
                        icon={piece.icon}
                        boardCallback={this.handleTileInteract}
                    />
                } else {
                    piece = null
                }

                let currentColor
                if (this.state.highlighted == notation) {
                    currentColor = this.state.highlightColor
                } else if (this.state.validHighlighted.includes(notation)) {
                    currentColor = this.state.validHighlightColors[colorParity % 2]
                } else {
                    currentColor = this.state.colors[colorParity % 2]
                }

                squares.push(
                    <Tile
                        key={'tile' + notation}
                        id={notation}
                        color={currentColor}
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
        return squares
    }

    handleTileInteract(notation) {
        this.handleSquareClick(notation)
    }

    handleSquareClick(notation) {
        // If no square is highlighted
        if (!this.state.highlighted) {
            // If user has clicked empty square
            if (this.context.game.pieceAt(notation) === null) {
                return
            }
            //TODO: Change so that only highlighted tile is rerendered, rather than entire board
            //Sets highlighted square and re-render
            this.setState({
                highlighted: notation,
                validHighlighted: this.context.game.validMoves(notation)
            })

            // If square is already highlighted
        } else {
            //If user is clicking the same square
            if (this.state.highlighted != notation) {
                this.movePiece(this.state.highlighted, notation)
            }
            this.setState({
                highlighted: null,
                validHighlighted: []
            })
        }
    }

    movePiece(fromCoords, toCoords) {
        this.context.game.move(fromCoords, toCoords)
        this.forceUpdate()
    }
}

ChessBoard.defaultProps = boardDefaultProps

export default ChessBoard