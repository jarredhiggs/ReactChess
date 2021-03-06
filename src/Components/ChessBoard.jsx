import React from 'react'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import './ChessBoard.css'
import { boardDefaultProps, ChessContext, coordsToNotation } from './chessboard-constants'

import Piece from "./Piece"
import Tile from './Tile'
import PromotionSelector from './PromotionSelector'
import ResultsWindow from './ResultsWindow'

class ChessBoard extends React.Component {

    static contextType = ChessContext

    constructor(props) {
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
        this.navigateHistory = this.navigateHistory.bind(this)
    }

    componentDidMount() {
        this.createTiles(this.context.game.getBoard())
        document.addEventListener("keydown", this.navigateHistory, false)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.navigateHistory, false)
    }

    render() {
        let game = this.context.game

        let boardRender = (
            <div id="chessboard"
                ref={(node) => this.node = node}
                style={
                    {
                        'left': this.state.left,
                        'top': this.state.top,
                        'width': this.state.boardSize[0],
                        'height': this.state.boardSize[1]
                    }
                }>
                {this.createTiles(game.getBoard())}
            </div>
        )

        return (
            <DndProvider backend={HTML5Backend} >
                {boardRender}

                {(game.promotionSquare !== null) ?
                    <PromotionSelector
                        color={game.pieceAt(game.promotionSquare).color}
                        callback={(type) => {
                            game.promote(game.promotionSquare, type, game.position)
                            this.forceUpdate()
                        }} />
                    : null}

                {(game.winner !== null || game.stalemate) ?
                    <ResultsWindow
                        winner={game.winner}
                        stalemate={game.stalemate}
                    />
                    : null}
                {this.props.children}
            </DndProvider>
        )
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
                if (this.state.highlighted === notation) {
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
                validHighlighted: this.context.game.validMoves(notation) ?? []
            })

            // If square is already highlighted
        } else {
            //If user is clicking the same square
            if (this.state.highlighted !== notation) {
                this.movePiece(this.state.highlighted, notation)
            }
            this.setState({
                highlighted: null,
                validHighlighted: []
            })
        }
    }

    navigateHistory(keyEvent) {
        switch (keyEvent.key) {
            case "ArrowLeft":
                console.log("left")
                break
            case "ArrowRight":
                console.log("right")
                break
            default:
                console.log(keyEvent.key)
                break
        }
    }

    movePiece(fromCoords, toCoords) {
        this.context.game.move(fromCoords, toCoords)
        this.forceUpdate()
    }
}

ChessBoard.defaultProps = boardDefaultProps

export default ChessBoard