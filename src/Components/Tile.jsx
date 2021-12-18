import React from "react"

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

    render() {
        let style = {
            'left': this.state.position.x,
            'top': this.state.position.y,
            'backgroundColor': this.state.color
        }
        return (
            <div className="tile" style={style}>
                {this.state.piece}
            </div>
        );
    }
}

export default Tile;