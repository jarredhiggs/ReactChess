import React from "react";

import { Icons } from "./chessboard-constants";

const PromotionSelector = (props) => {
    let isW = props.color === 'w'

    return (
        <div style={{
            position: "absolute",
            left: props.left ?? 255,
            top: props.top ?? 400,
            backgroundColor: isW ? "black" : "white"
        }}>
            <div>
                <img alt="" src={isW ? Icons.queen : Icons.queen2}
                    onClick={() => props.callback("queen")}></img>
                <img alt="" src={isW ? Icons.knight : Icons.knight2}
                    onClick={() => props.callback("knight")}></img>
                <img alt="" src={isW ? Icons.bishop : Icons.bishop2}
                    onClick={() => props.callback("bishop")}></img>
                <img alt="" src={isW ? Icons.rook : Icons.rook2}
                    onClick={() => props.callback("rook")}></img>
            </div>
        </div>
    )
}

export default PromotionSelector