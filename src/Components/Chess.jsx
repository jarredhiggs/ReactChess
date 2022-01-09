import React, { useEffect, useRef, useState } from "react"
import ChessBoard from "./ChessBoard"

import Game from "./Game"
import { ChessContext } from "./chessboard-constants"

const game = new Game()

const Chess = (props) => {

    const myRef = useRef(null)

    function handleContextMenu(event) {
        if (myRef.current && myRef.current.contains(event.target)) {
            event.preventDefault();
        }
    }

    useEffect(() => {
        document.addEventListener("contextmenu", handleContextMenu)

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu)
        }
    })

    return (
        <div onDragOver={onDragOver} ref={myRef}>
            <ChessContext.Provider value={{ game: game }}>
                <ChessBoard />
            </ChessContext.Provider>
        </div>
    )
}

function onDragOver(e) {
    e.preventDefault();
}

export default Chess