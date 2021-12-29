import React from 'react'

import { DragSource } from 'react-dnd'

import { pieceDragType } from './chessboard-constants'

class Piece extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id,
            icon: props.icon,
        }
    }

    render() {

        const { connectDragSource, isDragging } = this.props

        return connectDragSource(
            <div className="piece">
                {<img src={this.state.icon}></img>}
            </div>
        )
    }
}

const pieceDragContract = {

    beginDrag(props) {
        return { id: props.id }
    },

    endDrag(props, monitor, component) {
        //If dropped off the board
        if (!monitor.didDrop()) {
            return
        }
    }

}

/**
 * Specifies which props to inject into component
 */
function pieceCollect(connect, monitor) {
    return {
        // Call this inside render() to let react-dnd handle
        // drag events
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

export default DragSource(pieceDragType, pieceDragContract, pieceCollect)(Piece)