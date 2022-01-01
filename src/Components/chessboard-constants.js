import React from "react"
import {
    king, queen, bishop, rook, knight, pawn,
    king2, queen2, bishop2, rook2, knight2, pawn2
} from "../res/"

export const ChessContext = React.createContext('context');

export const PieceData = {
    Pawn: { icon: pawn, color: 'w' },
    Pawn2: { icon: pawn2, color: 'b' },
    Knight: { icon: knight, color: 'w' },
    Knight2: { icon: knight2, color: 'b' },
    Bishop: { icon: bishop, color: 'w' },
    Bishop2: { icon: bishop2, color: 'b' },
    Rook: { icon: rook, color: 'w' },
    Rook2: { icon: rook2, color: 'b' },
    Queen: { icon: queen, color: 'w' },
    Queen2: { icon: queen2, color: 'b' },
    King: { icon: king, color: 'w' },
    King2: { icon: king2, color: 'b' }
}

const p = PieceData
export const startPieces = [
    [p.Rook2, p.Knight2, p.Bishop2, p.Queen2, p.King2, p.Bishop2, p.Knight2, p.Rook2],
    [p.Pawn2, p.Pawn2, p.Pawn2, p.Pawn2, p.Pawn2, p.Pawn2, p.Pawn2, p.Pawn2],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [p.Pawn, p.Pawn, p.Pawn, p.Pawn, p.Pawn, p.Pawn, p.Pawn, p.Pawn],
    [p.Rook, p.Knight, p.Bishop, p.Queen, p.King, p.Bishop, p.Knight, p.Rook]
]

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
    squareSize: 100,
    left: '50px',
    top: '50px',
    highlightColor: 'rgb(70, 70, 200)',
    validHighlightColor: 'rgb(255, 255, 0)',
    validHighlighted: [],
    pieces: startPieces
}

export const tileDefaultProps = {
    width: '100px',
    height: '100px'
}

export const pieceDragType = "piece"
