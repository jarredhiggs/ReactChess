import ConsoleLog from "../util/ConsoleLog"
import { startPosition, PieceData, coordsToNotation } from "./chessboard-constants"

export default class Game {

    constructor() {
        this.position = startPosition
        this.history = [startPosition.board]

        this.canMove = this.canMove.bind(this)
        this.pieceAt = this.pieceAt.bind(this)
    }

    getBoard(position = this.position) {
        return position.board
    }

    pieceAt(coord, board = this.getBoard(this.position)) {
        if (typeof coord == 'string') {
            coord = this.notationToCoords(coord)
        }
        return board[coord.row][coord.col]
    }

    setPiece(coord, value, board = this.getBoard(this.position)) {
        if (typeof coord == 'string') {
            coord = this.notationToCoords(coord)
        }
        board[coord.row][coord.col] = value
    }

    /**
     * Returns current player's turn. 0 -> white, 1 -> black
     */
    playerNextMove(position = this.position) {
        return position.toMove
    }

    toggleActivePlayer(position = this.position) {
        position.toMove = (position.toMove == 'w') ? 'b' : 'w'
    }

    move(fromSquare, toSquare, board = this.getBoard()) {
        let f = fromSquare
        if (typeof f == 'string') {
            f = this.notationToCoords(fromSquare)
        }
        let t = toSquare
        if (typeof t == 'string') {
            t = this.notationToCoords(toSquare)
        }

        if (this.playerNextMove() == this.pieceAt(f, board).color) {

            let canMove = this.canMove(f, t, board)
            if (canMove.valid) {
                this.toggleActivePlayer()

                let piece = this.pieceAt(f, board)
                this.setPiece(f, null, board)
                this.setPiece(t, piece, board)

                let backRow = (piece.color == 'w') ? 7 : 0

                if (f.row == backRow) {
                    if (f.col == 7) {
                        this.position.castleRights[piece.color].kingSide = false
                    } else if (f.col == 0) {
                        this.position.castleRights[piece.color].queenSide = false
                    } else if (f.col == 4) {
                        this.position.castleRights[piece.color].kingSide = false
                        this.position.castleRights[piece.color].queenSide = false
                    }
                }


                if (canMove.special != null) {
                    switch (canMove.special.type) {
                        case 'castle_king':
                            f = { row: backRow, col: 7 }
                            t = { row: backRow, col: 5 }
                            piece = this.pieceAt(f, board)
                            this.setPiece(f, null, board)
                            this.setPiece(t, piece, board)
                            break;
                        case 'castle_queen':
                            f = { row: backRow, col: 0 }
                            t = { row: backRow, col: 3 }
                            piece = this.pieceAt(f, board)
                            this.setPiece(f, null, board)
                            this.setPiece(t, piece, board)
                            break;
                    }
                }

                this.history.push(board)
            }
        }
    }

    canMove(fromSquare, toSquare, board = this.getBoard()) {
        let f = fromSquare
        if (typeof f == 'string') {
            f.this.notationToCoords(f)
        }
        let t = toSquare
        if (typeof t == 'string') {
            t.this.notationToCoords(t)
        }

        let special = null
        return {
            valid: this.validMoves(f, board, false).some(move => {
                special = move.special
                return move.row == t.row && move.col == t.col
            }),
            special: special
        }
    }

    /**
     * Returns array of squares that represent valid for the given square.
     */
    validMoves(fromSquare, board = this.getBoard(), inAlgebraicNotation = true) {

        let f = fromSquare
        if (typeof f == 'string') {
            f = this.notationToCoords(f)
        }

        let moves
        switch (this.pieceAt(f, board)) {
            case PieceData.Pawn:
            case PieceData.Pawn2:
                moves = this.pawnValidate(f, board)
                break;
            case PieceData.Knight:
            case PieceData.Knight2:
                moves = this.knightValidate(f, board)
                break;
            case PieceData.Bishop:
            case PieceData.Bishop2:
                moves = this.bishopValidate(f, board)
                break;
            case PieceData.Rook:
            case PieceData.Rook2:
                moves = this.rookValidate(f, board)
                break;
            case PieceData.Queen:
            case PieceData.Queen2:
                moves = this.bishopValidate(f, board)
                moves = moves.concat(this.rookValidate(f, board))
                break;
            case PieceData.King:
            case PieceData.King2:
                moves = this.kingValidate(f, board)
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
        let b = board
        let moves = []
        let temp = {}

        let forward = (p(f, b).color == 'b') ? 1 : -1

        //Move 1 square
        temp = { row: f.row + (1 * forward), col: f.col }
        if (p(temp, b) === null) {
            moves.push(temp)

            //Move 2 squares
            if (f.row == parseInt(3.5 - (2.5 * forward))) {
                temp = { row: f.row + (2 * forward), col: f.col }
                if (p(temp, b) === null) {
                    moves.push(temp)
                }
            }
        }
        //Capture Left
        if (f.col - 1 >= 0) {
            temp = { row: f.row + (1 * forward), col: f.col - 1 }
            if (p(temp, b) != null &&
                p(temp, b).color != p(f, b).color) {
                moves.push(temp)
            }
        }
        //Capture Right
        if (f.col + 1 < 8) {
            temp = { row: f.row + (1 * forward), col: f.col + 1 }
            if (p(temp, b) != null &&
                p(temp, b).color != p(f, b).color) {
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

        let possible = [
            { row: f.row - 2, col: f.col - 1 },
            { row: f.row - 2, col: f.col + 1 },
            { row: f.row + 2, col: f.col - 1 },
            { row: f.row + 2, col: f.col + 1 },
            { row: f.row - 1, col: f.col - 2 },
            { row: f.row - 1, col: f.col + 2 },
            { row: f.row + 1, col: f.col - 2 },
            { row: f.row + 1, col: f.col + 2 }
        ]

        possible.forEach(function (coord) {
            if (coord.row >= 0 && coord.row < 8 && coord.col >= 0 && coord.col < 8) {
                if (p(coord, board) == null ||
                    p(coord, board).color != p(f, board).color) {
                    moves.push(coord)
                }
            }
        })

        return moves
    }

    bishopValidate(fromCoord, board) {
        let moves = []
        moves = moves.concat(this.lineValidate(-1, 1, fromCoord, board))
        moves = moves.concat(this.lineValidate(-1, -1, fromCoord, board))
        moves = moves.concat(this.lineValidate(1, -1, fromCoord, board))
        moves = moves.concat(this.lineValidate(1, 1, fromCoord, board))
        return moves
    }

    rookValidate(fromCoord, board) {
        let moves = []
        moves = moves.concat(this.lineValidate(0, 1, fromCoord, board))
        moves = moves.concat(this.lineValidate(0, -1, fromCoord, board))
        moves = moves.concat(this.lineValidate(1, 0, fromCoord, board))
        moves = moves.concat(this.lineValidate(-1, 0, fromCoord, board))
        return moves
    }
    queenValidate(fromCoord, board) {
        let moves = []
        moves = moves.concat(this.bishopValidate(fromCoord, board))
        moves = moves.concat(this.rookValidate(fromCoord, board))
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
                if (p(coord, board) == null || p(coord, board).color != p(f, board).color) {
                    moves.push(coord)
                }
            }
        })

        moves = moves.concat(this.castlingValidate(p(f, board).color))

        return moves
    }

    castlingValidate(color, position = this.position) {
        let castleRights = position.castleRights[color]

        let backRow = (color == 'w') ? 7 : 0
        let castleMoves = []
        //TODO: Prevent Castling Out of Check or Through Check
        if (castleRights.kingSide &&
            this.pieceAt({ row: backRow, col: 5 }) == null &&
            this.pieceAt({ row: backRow, col: 6 }) == null) {
            castleMoves.push({
                row: backRow, col: 6, special: {
                    color: color, type: "castle_king"
                }
            })
        }
        if (castleRights.queenSide && this.pieceAt({ row: backRow, col: 3 }) == null &&
            this.pieceAt({ row: backRow, col: 2 }) == null &&
            this.pieceAt({ row: backRow, col: 1 }) == null) {
            castleMoves.push({
                row: backRow, col: 2, special: {
                    color: color, type: "castle_queen"
                }
            })
        }

        return castleMoves
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
        let b = board
        let f = fromCoord
        let moves = []
        let temp = {}

        temp = { row: f.row + h, col: f.col + v }
        while (temp.row >= 0 && temp.row < 8 && temp.col >= 0 && temp.col < 8) {
            if (p(temp, b) == null) {
                moves.push(temp)
                temp = { row: temp.row + h, col: temp.col + v }
                continue
            } else if (p(temp, b).color != p(f, b).color) {
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
     * return: {row: int, col: int } -> A coordinate to index board objects
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