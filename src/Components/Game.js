import ConsoleLog from "../util/ConsoleLog"
import { startPieces, PieceData, coordsToNotation } from "./chessboard-constants"

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

        let f = fromSquare
        if (typeof f == 'string') {
            f = this.notationToCoords(f)
        }

        let moves
        switch (this.pieceAt(f)) {
            case PieceData.Pawn:
            case PieceData.Pawn2:
                moves = this.pawnValidate(f, this.board)
                break;
            case PieceData.Knight:
            case PieceData.Knight2:
                moves = this.knightValidate(f, this.board)
                break;
            case PieceData.Bishop:
            case PieceData.Bishop2:
                moves = this.bishopValidate(f, this.board)
                break;
            case PieceData.Rook:
            case PieceData.Rook2:
                moves = this.rookValidate(f, this.board)
                break;
            case PieceData.Queen:
            case PieceData.Queen2:
                moves = this.bishopValidate(f, this.board)
                moves = moves.concat(this.rookValidate(f, this.board))
                break;
            case PieceData.King:
            case PieceData.King2:
                moves = this.kingValidate(f, this.board)
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

    pawnValidate(fromCoord, board) {
        let p = this.pieceAt
        let f = fromCoord
        let moves = []
        let temp = {}

        let forward = (p(f).color == 'b') ? 1 : -1

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
        return moves
    }

    knightValidate(fromCoord, board) {
        let p = this.pieceAt
        let f = fromCoord
        let moves = []
        let temp = {}

        return moves
    }

    bishopValidate(fromCoord, board) {
        let moves = []
        moves = moves.concat(this.lineValidate(-1, 1, fromCoord))
        moves = moves.concat(this.lineValidate(-1, -1, fromCoord))
        moves = moves.concat(this.lineValidate(1, -1, fromCoord))
        moves = moves.concat(this.lineValidate(1, 1, fromCoord))
        return moves
    }

    rookValidate(fromCoord, board) {
        let moves = []
        moves = moves.concat(this.lineValidate(0, 1, fromCoord))
        moves = moves.concat(this.lineValidate(0, -1, fromCoord))
        moves = moves.concat(this.lineValidate(1, 0, fromCoord))
        moves = moves.concat(this.lineValidate(-1, 0, fromCoord))
        return moves
    }
    queenValidate(fromCoord, board) {
        let moves = []
        moves = moves.concat(this.bishopValidate(fromCoord))
        moves = moves.concat(this.rookValidate(fromCoord))
        return moves
    }

    kingValidate(fromCoord, board) {
        let p = this.pieceAt
        let f = fromCoord
        let moves = []

        let adjacent = [
            { row: f.row + 1, col: f.col },
            { row: f.row + 1, col: f.col + 1 },
            { row: f.row + 1, col: f.col - 1 },
            { row: f.row, col: f.col + 1 },
            { row: f.row, col: f.col - 1 },
            { row: f.row - 1, col: f.col },
            { row: f.row - 1, col: f.col + 1 },
            { row: f.row - 1, col: f.col - 1 }
        ]

        adjacent.forEach(function (coord) {
            if (coord.row >= 0 && coord.row < 8 && coord.col >= 0 && coord.row < 8) {
                if (p(coord) == null || p(coord).color != p(f).color) {
                    moves.push(coord)
                }
            }
        })

        return moves
    }

    /**
     * 
     * @param {int} v - Vertical direction. 0, 1, or -1
     * @param {int} h - Horizontal direction. 0, 1, or -1
     * @param {obj} fromCoord - {row: int, col: int}
     * @param {obj} board
     */
    lineValidate(v, h, fromCoord, board) {
        let p = this.pieceAt
        let f = fromCoord
        let moves = []
        let temp = {}

        temp = { row: f.row + h, col: f.col + v }
        while (temp.row >= 0 && temp.row < 8 && temp.col >= 0 && temp.col < 8) {
            if (p(temp) == null) {
                moves.push(temp)
                temp = { row: temp.row + h, col: temp.col + v }
                continue
            } else if (p(temp).color != p(f).color) {
                moves.push(temp)
                break
            } else {
                break
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