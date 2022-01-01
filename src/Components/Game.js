import ConsoleLog from "../util/ConsoleLog"
import { startPieces, PieceData, coordsToNotation, pieceDragType } from "./chessboard-constants"

export default class Game {

    constructor() {
        this.board = startPieces
        this.currentPlayer = 0

        this.canMove = this.canMove.bind(this)
        this.pieceAt = this.pieceAt.bind(this)
    }

    pieceAt(coord, board = this.board) {
        if (typeof coord == 'string') {
            coord = this.notationToCoords(coord)
        }
        return this.board[coord.row][coord.col]
    }
    
    setPiece(coord, value, board = this.board) {
        if (typeof coord == 'string') {
            coord = this.notationToCoords(coord)
        }
        board[coord.row][coord.col] = value
    }

    /**
     * Returns current player's turn. 0 -> white, 1 -> black
     */
    playerNextMove() {
        return this.currentPlayer
    }

    move(fromCoord, toCoord) {
        fromCoord = (typeof fromCoord == 'string') ?
            this.notationToCoords(fromCoord) : fromCoord
        toCoord = (typeof toCoord == 'string') ?
            this.notationToCoords(toCoord) : toCoord

        let piece = this.pieceAt(fromCoord)
        this.setPiece(fromCoord, null)
        this.setPiece(toCoord, piece)
    }

    canMove(board, fromSquare, toSquare) {
        return this.validMoves(board, fromSquare)
            .includes(toSquare)
    }

    /**
     * Returns array of squares that represent valid for the given square.
     */
    validMoves(fromSquare, inAlgebraicNotation = true, board = this.board) {
        let p = this.pieceAt
        let f = fromSquare
        if (typeof f == 'string') {
            f = this.notationToCoords(f)
        }

        let moves = []
        let forward = 1
        let temp = {}
        switch (p(f)) {
            case PieceData.Pawn:
                forward = -1
            case PieceData.Pawn2:
                //Move 1 square
                temp = { row: f.row + (1 * forward), col: f.col }
                if (p(temp) === null) {
                    moves.push(temp)

                    //Move 2 squares
                    if (f.row == parseInt(3.5 - (2.5 * forward))) {
                        temp = { row: f.row + (2 * forward), col: f.col }
                        if (p(temp) === null) {
                            moves.push(temp)
                        }
                    }
                }
                //Capture Left
                if (f.col - 1 >= 0) {
                    temp = { row: f.row + (1 * forward), col: f.col - 1 }
                    if (p(temp) != null &&
                        p(temp).color != p(f).color) {
                        moves.push(temp)
                    }
                }
                //Capture Right
                if (f.col + 1 < 8) {
                    temp = { row: f.row + (1 * forward), col: f.col + 1 }
                    if (p(temp) != null &&
                        p(temp).color != p(f).color) {
                        moves.push(temp)
                    }
                }

                //En passant
                //TODO
                break;

            case PieceData.Knight:
            case PieceData.Knight2:
                break;
            case PieceData.Bishop:
            case PieceData.Bishop2:
                break;
            case PieceData.Rook:
            case PieceData.Rook2:
                break;
            case PieceData.Queen:
            case PieceData.Queen2:
                break;
            case PieceData.King:
            case PieceData.King2:
                break;
            default:
                ConsoleLog("Piece does not match in Game.validateMove.")
        }

        if (inAlgebraicNotation) {
            for (let i = 0; i < moves.length; i++) {
                moves[i] = coordsToNotation(moves[i])
            }
        }
        return moves
    }

    /**
     * arg: String -> A chess square, written in algebraic notation
     * return: {row: int, col: int } -> A representation to use with this.board
     * col = file
     * row = rank
     */
    notationToCoords = (note) => {
        return {
            row: parseInt(8 - note.charAt(1)),
            col: note.charCodeAt(0) - 97
        }
    }
}