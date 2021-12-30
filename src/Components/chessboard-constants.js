import PropTypes from "prop-types";

import {
    king, queen, bishop, rook, knight, pawn,
    king2, queen2, bishop2, rook2, knight2, pawn2
} from "../res/"

export const boardPropTypes = {
    lightColor: PropTypes.string,
    darkColor: PropTypes.string,
    squareSize: PropTypes.number,
}

export const boardDefaultProps = {
    // Square/Tile properties
    lightColor: 'rgb(240, 200, 200)',
    darkColor: 'rgb(70, 20, 20)',
    squareSize: 100
}

export const pieceDragType = "drag_piece"

export const startPieces = [
    rook2, knight2, bishop2, queen2, king2, bishop2, knight2, rook2,
    pawn2, pawn2, pawn2, pawn2, pawn2, pawn2, pawn2, pawn2,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
]