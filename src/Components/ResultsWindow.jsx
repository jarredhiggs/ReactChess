import React from "react";
import { Icons } from "./chessboard-constants";

const ResultsWindow = (props) => {
    let isStalemate = props.stalemate
    let isW = props.winner === 'w'

    return (
        <div style={{
            position: "absolute",
            textAlign: "center",
            left: props.left ?? 315,
            top: props.top ?? 385,
            backgroundColor: isW ? "black" : "white",
            color: isW ? "white" : "black",
            padding: "10px 10px 0px 10px",
            border: "5px solid",
            borderColor: isW ? "white" : "black"
        }}>
            {!isStalemate ? (<div className="winnerWindow">
                GG
                <img src={isW ? Icons["king"] : Icons["king2"]}></img>
                EZ
                <div>
                    {isW ? "1-0" : "0-1"}
                </div>
            </div>) : (<div className="drawWindow">
                <img src={Icons.king}></img>
                <img src={Icons.king2}></img>
                <div>&nbsp;&nbsp;DRAW&nbsp;&nbsp;</div>
            </div>)}
        </div>
    )
}

export default ResultsWindow