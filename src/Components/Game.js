import { startPosition, coordsToNotation, Icons } from "./chessboard-constants"

export default class Game {

    constructor() {
        this.position = startPosition
        this.history = [startPosition]

        this.kingPositions = {
            'w': { row: 7, col: 4 },
            'b': { row: 0, col: 4 }
        }

        this.canMove = this.canMove.bind(this)
        this.pieceAt = this.pieceAt.bind(this)

        this.promotionSquare = null

        this.winner = null
        this.stalemate = false
    }

    getBoard(position = this.position) {
        return position.board
    }

    pieceAt(coord, board = this.getBoard(this.position)) {
        if (typeof coord === 'string') {
            coord = this.notationToCoords(coord)
        }
        return board[coord.row][coord.col] ?? null
    }

    setPiece(coord, value, board = this.getBoard(this.position)) {
        if (typeof coord === 'string') {
            coord = this.notationToCoords(coord)
        }
        board[coord.row][coord.col] = value
    }

    playerToMove(position = this.position) {
        return position.toMove
    }

    toggleActivePlayer(position = this.position) {
        position.toMove = (position.toMove === 'w') ? 'b' : 'w'
    }

    enPassantSquare(position = this.position) {
        return position.enPassantSquare
    }

    promote(promotionSquare, promoteTo, position = this.position) {
        let promotingPawn = this.pieceAt(promotionSquare, this.getBoard(position))
        let board = this.getBoard(position)

        this.setPiece(promotionSquare, {
            type: promoteTo,
            icon: (promotingPawn.color === 'w' ? Icons[promoteTo] : Icons[promoteTo + "2"]),
            color: promotingPawn.color
        }, board)

        this.promotionSquare = null
    }

    move(fromSquare, toSquare, position = this.position) {

        if (this.promotionSquare !== null ||
            this.winner !== null ||
            this.stalemate !== false) {
            return
        }

        let board = this.getBoard(position)
        let f = fromSquare
        if (typeof f === 'string') {
            f = this.notationToCoords(fromSquare)
        }
        let t = toSquare
        if (typeof t === 'string') {
            t = this.notationToCoords(toSquare)
        }

        if (this.playerToMove() === this.pieceAt(f, board).color) {

            let canMove = this.canMove(f, t, position)

            if (canMove.valid) {

                position.enPassantSquare = null

                this.toggleActivePlayer(position)

                let piece = this.pieceAt(f, board)
                this.setPiece(f, null, board)
                this.setPiece(t, piece, board)

                let backRow = (piece.color === 'w') ? 7 : 0

                if (f.row === backRow) {
                    if (f.col === 7) {
                        this.position.castleRights[piece.color].kingSide = false
                    } else if (f.col === 0) {
                        this.position.castleRights[piece.color].queenSide = false
                    } else if (f.col === 4) {
                        this.position.castleRights[piece.color].kingSide = false
                        this.position.castleRights[piece.color].queenSide = false
                    }
                }

                if (canMove.special !== null) {
                    let rookFrom
                    let rookTo
                    let rookPiece
                    let pawnForward = (piece.color === 'w') ? -1 : 1
                    switch (canMove.special.type) {
                        case 'castle_king':
                            rookFrom = { row: backRow, col: 7 }
                            rookTo = { row: backRow, col: 5 }
                            rookPiece = this.pieceAt(rookFrom, board)
                            this.setPiece(rookFrom, null, board)
                            this.setPiece(rookTo, rookPiece, board)
                            break;
                        case 'castle_queen':
                            rookFrom = { row: backRow, col: 0 }
                            rookTo = { row: backRow, col: 3 }
                            rookPiece = this.pieceAt(rookFrom, board)
                            this.setPiece(rookFrom, null, board)
                            this.setPiece(rookTo, rookPiece, board)
                            break;
                        case 'pawn_twosquare':
                            position.enPassantSquare = {
                                row: t.row - (1 * pawnForward),
                                col: t.col,
                                color: piece.color
                            }
                            break;
                        case 'en_passant':
                            this.setPiece({ row: t.row - (1 * pawnForward), col: t.col }, null)
                            break;
                        case 'promotion':
                            this.promotionSquare = t
                            break;
                        default:
                            console.log(canMove.special)
                            break;
                    }
                }

                if (piece.type === "king") {
                    this.kingPositions[piece.color] = t
                }

                this.history.push({
                    //create new position w/ deep copy... maybe save as FEN notation?
                })

                this.updateGameStatus(position)
            }
        }
    }

    canMove(fromSquare, toSquare, position = this.position) {
        let f = fromSquare
        if (typeof f === 'string') {
            f.this.notationToCoords(f)
        }
        let t = toSquare
        if (typeof t === 'string') {
            t.this.notationToCoords(t)
        }

        let special = null
        return {
            valid: this.validMoves(f, position, false, false).some(move => {
                special = move.special
                return (move.row === t.row) && (move.col === t.col)
            }),
            special: special || null
        }
    }

    /**
     * Returns array of squares that represent valid for the given square.
     */
    validMoves(fromSquare, position = this.position, inAlgebraicNotation = true,
        validatingChecks = false) {

        if (this.winner !== null || this.stalemate) {
            return
        }

        let board = this.getBoard(position)

        let f = fromSquare
        if (typeof f === 'string') {
            f = this.notationToCoords(f)
        }

        let piece = this.pieceAt(f, board)

        let moves
        switch (piece.type) {
            case "pawn":
                moves = this.pawnValidate(f, position)
                break;
            case "knight":
                moves = this.knightValidate(f, position)
                break;
            case "bishop":
                moves = this.bishopValidate(f, position)
                break;
            case "rook":
                moves = this.rookValidate(f, position)
                break;
            case "queen":
                moves = this.queenValidate(f, position)
                break;
            case "king":
                moves = this.kingValidate(f, position)
                break;
            default:
                console.log("Piece does not match in Game.validateMove.")
        }

        if (!validatingChecks) {
            moves = moves.filter((move) => {
                let kingPosition = this.kingPositions[piece.color]
                if (move.special != null) {
                    if (move.special.type === "castle_king" &&
                        (this.inCheckValidate(kingPosition, piece.color, position)) ||
                        (this.inCheckValidate({ row: kingPosition.row, col: kingPosition.col + 1 }, piece.color, position))) {
                        return false

                    } else if (move.special.type === "castle_queen" &&
                        (this.inCheckValidate(kingPosition, piece.color, position)) ||
                        (this.inCheckValidate({ row: kingPosition.row, col: kingPosition.col - 1 }, piece.color, position))) {
                        return false
                    }
                }

                let positionCopy = JSON.parse(JSON.stringify(position))

                this.setPiece(move, piece, this.getBoard(positionCopy))
                this.setPiece(f, null, this.getBoard(positionCopy))

                if (piece.type == "king") {
                    kingPosition = move
                }

                return !this.inCheckValidate(
                    kingPosition, piece.color, positionCopy
                )
            })
        }

        if (inAlgebraicNotation) {
            for (let i = 0; i < moves.length; i++) {
                moves[i] = coordsToNotation(moves[i])
            }
        }

        return moves
    }

    pawnValidate(fromCoord, position = this.position) {
        let p = this.pieceAt
        let f = fromCoord
        let b = this.getBoard(position)
        let moves = []
        let temp = {}

        let forward = (p(f, b).color === 'b') ? 1 : -1

        //Move 1 square
        let toRow = f.row + (1 * forward)
        let special = null
        if (toRow === 0 || toRow === 7) {
            special = {
                color: p(f, b).color, type: "promotion"
            }
        }
        temp = { row: toRow, col: f.col, special: special }
        if (p(temp, b) === null) {
            moves.push(temp)

            //Move 2 squares
            if (f.row === parseInt(3.5 - (2.5 * forward))) {
                temp = {
                    row: f.row + (2 * forward), col: f.col, special: {
                        color: p(f, b).color, type: "pawn_twosquare"
                    }
                }
                if (p(temp, b) === null) {
                    moves.push(temp)
                }
            }
        }
        //Capture Left
        if (f.col - 1 >= 0) {
            temp = { row: f.row + (1 * forward), col: f.col - 1, special: special }
            if (p(temp, b) !== null &&
                p(temp, b).color !== p(f, b).color) {
                moves.push(temp)
            }
        }
        //Capture Right
        if (f.col + 1 < 8) {
            temp = { row: f.row + (1 * forward), col: f.col + 1, special: special }
            if (p(temp, b) !== null &&
                p(temp, b).color !== p(f, b).color) {
                moves.push(temp)
            }
        }

        //En Passant
        let enPassantSquare = this.enPassantSquare(this.position)

        if (enPassantSquare !== null) {
            if (enPassantSquare.row === f.row + (1 * forward) &&
                enPassantSquare.color !== p(f, b).color && (
                    enPassantSquare.col === f.col - 1 ||
                    enPassantSquare.col === f.col + 1)) {
                moves.push({
                    row: enPassantSquare.row, col: enPassantSquare.col, special: {
                        color: p(f, b).color, type: "en_passant"
                    }
                })
            }
        }

        return moves
    }

    knightValidate(fromCoord, position) {
        let p = this.pieceAt
        let board = this.getBoard(position)
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
                if (p(coord, board) === null ||
                    p(coord, board).color !== p(f, board).color) {
                    moves.push(coord)
                }
            }
        })

        return moves
    }

    bishopValidate(fromCoord, position) {
        let board = this.getBoard(position)
        let moves = []
        moves = moves.concat(this.lineValidate(-1, 1, fromCoord, board))
        moves = moves.concat(this.lineValidate(-1, -1, fromCoord, board))
        moves = moves.concat(this.lineValidate(1, -1, fromCoord, board))
        moves = moves.concat(this.lineValidate(1, 1, fromCoord, board))
        return moves
    }

    rookValidate(fromCoord, position) {
        let board = this.getBoard(position)
        let moves = []
        moves = moves.concat(this.lineValidate(0, 1, fromCoord, board))
        moves = moves.concat(this.lineValidate(0, -1, fromCoord, board))
        moves = moves.concat(this.lineValidate(1, 0, fromCoord, board))
        moves = moves.concat(this.lineValidate(-1, 0, fromCoord, board))
        return moves
    }
    queenValidate(fromCoord, position) {
        let moves = []
        moves = moves.concat(this.bishopValidate(fromCoord, position))
        moves = moves.concat(this.rookValidate(fromCoord, position))
        return moves
    }

    kingValidate(fromCoord, position) {
        let moves = []
        let p = this.pieceAt
        let board = this.getBoard(position)
        let f = fromCoord

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
                if (p(coord, board) === null || p(coord, board).color !== p(f, board).color) {
                    moves.push(coord)
                }
            }
        })

        moves = moves.concat(this.castlingValidate(p(f, board).color))

        return moves
    }

    castlingValidate(color, position = this.position) {
        let castleRights = position.castleRights[color]
        let board = this.getBoard(position)
        let backRow = (color === 'w') ? 7 : 0
        let castleMoves = []

        if (castleRights.kingSide &&
            this.pieceAt({ row: backRow, col: 5 }, board) === null &&
            this.pieceAt({ row: backRow, col: 6 }, board) === null) {
            castleMoves.push({
                row: backRow, col: 6, special: {
                    color: color, type: "castle_king"
                }
            })
        }
        if (castleRights.queenSide &&
            this.pieceAt({ row: backRow, col: 3 }) === null &&
            this.pieceAt({ row: backRow, col: 2 }) === null &&
            this.pieceAt({ row: backRow, col: 1 }) === null) {
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
        let f = fromCoord
        let moves = []
        let temp = {}

        temp = { row: f.row + h, col: f.col + v }
        while (temp.row >= 0 && temp.row < 8 && temp.col >= 0 && temp.col < 8) {
            if (p(temp, board) === null) {
                moves.push(temp)
                temp = { row: temp.row + h, col: temp.col + v }
                continue
            } else if (p(temp, board).color !== p(f, board).color) {
                moves.push(temp)
                break
            } else {
                break
            }
        }
        return moves
    }

    // Refactor to keep track of all pieces throughout game to allow for more efficient check checks
    inCheckValidate(defendingKingCoord, kingColor, position = this.position) {
        let board = this.getBoard(position)
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let attackPiece = this.pieceAt({ row: row, col: col }, board)
                if (attackPiece !== null && attackPiece.color !== kingColor) {
                    let pieceMoves = this.validMoves({ row: row, col: col }, position, false, true)
                    let isInCheck = pieceMoves.some(move => {
                        return move.row === defendingKingCoord.row &&
                            move.col === defendingKingCoord.col
                    });
                    if (isInCheck) {
                        return true
                    }
                }
            }
        }
        return false
    }

    updateGameStatus(position) {
        let board = position.board

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {

                let coord = { row: row, col: col }
                let piece = this.pieceAt(coord, board)

                if (piece !== null && piece.color === this.playerToMove()) {
                    if (this.validMoves(coord, position, false, false).length > 0) {
                        return
                    }
                }
            }
        }

        if (this.inCheckValidate(
            this.kingPositions[this.playerToMove()],
            this.playerToMove, position)) {
            this.winner = (this.playerToMove() == 'w') ? 'b' : 'w'
            console.log(`CHECKMATE. WINNER : ${this.winner}`)
        } else {
            console.log("STALEMATE")
            this.stalemate = true
        }
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