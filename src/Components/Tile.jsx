import React from "react"

import { DropTarget } from "react-dnd"

import { pieceDragType } from "./chessboard-constants"

class Tile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id,
            size: props.size,
            position: props.position,
            color: props.color,
            piece: props.piece,
            boardClickCallback: props.clickCallback
        }

        console.log(this.props.color)
        this.handleClickEvent = this.handleClickEvent.bind(this)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            color: nextProps.color,
            piece: nextProps.piece
        }
    }

    render() {
        const { dropResult, connectDropTarget } = this.props

        let style = {
            'left': this.state.position.x,
            'top': this.state.position.y,
            'backgroundColor': this.state.color
        }

        return connectDropTarget(
            <div ref={this.ref}
                className="tile"
                style={style}
                onClick={this.handleClickEvent}>
                {this.state.piece}
            </div>
        );
    }

    handleClickEvent() {
        this.state.boardClickCallback(this.state.id, false)
    }
}

const tileDropTargetContract = {
    drop(props, monitor, component) {
        props.clickCallback(props.id)
    }
}

const tileDropCollect = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
    }
}

export default DropTarget(pieceDragType, tileDropTargetContract, tileDropCollect)(Tile);