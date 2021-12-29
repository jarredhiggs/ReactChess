import React from "react"

import { DropTarget } from "react-dnd"

import { pieceDragType } from "./chessboard-constants"

class Tile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            size: props.size,
            position: props.position,
            color: props.color,
            piece: props.piece,
        }
    }

    componentDidUpdate(prevProps) {
    }


    render() {
        const { canDrop, isOver, connectDropTarget } = this.props

        let style = {
            'left': this.state.position.x,
            'top': this.state.position.y,
            'backgroundColor': this.state.color
        }

        return connectDropTarget(
            <div className="tile" style={style}>
                {this.state.piece}
            </div>
        );
    }
}

const tileDropTargetContract = {
    canDrop(props, monitor) {
        return true
    }
}

const tileDropCollect = (collect, monitor) => {
    return {
        connectDropTarget: collect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType()
    }
}

export default DropTarget(pieceDragType, tileDropTargetContract, tileDropCollect)(Tile);