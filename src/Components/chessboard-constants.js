import PropTypes from "prop-types";

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