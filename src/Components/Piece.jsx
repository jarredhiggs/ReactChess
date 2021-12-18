import React from 'react'

class Piece extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            icon: props.icon,
        }
    }

    render() {
        return (
            <div className="piece">
                {<img src={this.state.icon}></img>}
            </div>
        )
    }
}

export default Piece