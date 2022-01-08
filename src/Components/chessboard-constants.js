import React from "react"
import {
    king, queen, bishop, rook, knight, pawn,
    king2, queen2, bishop2, rook2, knight2, pawn2
} from "../res/"

export const ChessContext = React.createContext('context');

// Add others as needed
export const Icons = {
    queen: queen,
    queen2: queen2,
    bishop: bishop,
    bishop2: bishop2,
    rook: rook,
    rook2: rook2,
    knight: knight,
    knight2: knight2
}

const Piece = (type, icon, color) => {
    return {
        type: type,
        icon: icon,
        color: color
    }
}

let Pieces = {
    pawn_w: Piece("pawn", pawn, 'w'),
    knight_w: Piece("knight", knight, 'w'),
    bishop_w: Piece("bishop", bishop, 'w'),
    rook_w: Piece("rook", rook, 'w'),
    queen_w: Piece("queen", queen, 'w'),
    king_w: Piece("king", king, 'w'),

    pawn_b: Piece("pawn", pawn2, 'b'),
    knight_b: Piece("knight", knight2, 'b'),
    bishop_b: Piece("bishop", bishop2, 'b'),
    rook_b: Piece("rook", rook2, 'b'),
    queen_b: Piece("queen", queen2, 'b'),
    king_b: Piece("king", king2, 'b')
}

const p = Pieces

export const startPosition = {
    board: [
        [p.rook_b, p.knight_b, p.bishop_b, p.queen_b, p.king_b, p.bishop_b, p.knight_b, p.rook_b],
        [p.pawn_b, p.pawn_b, p.pawn_b, p.pawn_b, p.pawn_b, p.pawn_b, p.pawn_b, p.pawn_b],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [p.pawn_w, p.pawn_w, p.pawn_w, p.pawn_w, p.pawn_w, p.pawn_w, p.pawn_w, p.pawn_w],
        [p.rook_w, p.knight_w, p.bishop_w, p.queen_w, p.king_w, p.bishop_w, p.knight_w, p.rook_w]
    ],
    toMove: 'w',
    enPassantSquare: null,
    castleRights: {
        'w': {
            kingSide: true,
            queenSide: true
        },
        'b': {
            kingSide: true,
            queenSide: true
        }
    }
}

export const notation = [
    ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'],
    ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
    ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
    ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
    ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
    ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
    ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
    ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']
]

export const coordsToNotation = (coord) => {
    if (coord == null || coord.col == null || coord.row == null) {
        return null
    }

    return notation[coord.row][coord.col]
}

export const boardDefaultProps = {
    lightColor: 'rgb(240, 200, 200)',
    darkColor: 'rgb(70, 20, 20)',
    highlightColor: 'rgb(70, 70, 200)',
    validHighlightColorLight: 'rgb(240, 240, 0)',
    validHighlightColorDark: 'rgb(150, 150, 0)',
    squareSize: 100,
    left: '50px',
    top: '50px',
    validHighlighted: [],
    pieces: startPosition
}

export const tileDefaultProps = {
    width: '100px',
    height: '100px'
}

export const pieceDragType = "piece"
