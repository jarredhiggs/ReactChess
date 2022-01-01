import React from "react"
import ChessBoard from "./ChessBoard"

import Game from "./Game"
import { ChessContext } from "./chessboard-constants"

const game = new Game()

const Chess = (props) => {
    return(
        <ChessContext.Provider value={{game: game}}>
            <ChessBoard/>
        </ChessContext.Provider>
    )
}

export default Chess