
import "./main.scss";

import React, { Component } from "react";
import { render } from "react-dom";


class Frame extends Component {
    state = {
    }

    componentDidMount() {
        this.conn = new WebSocket(window.location.toString().replace(/^http/, "ws") + "ws");

        document.addEventListener("keydown", (evt) => this.conn.send(JSON.stringify({ code: evt.keyCode, state: true })));
        document.addEventListener("keyup", (evt) => this.conn.send(JSON.stringify({ code: evt.keyCode, state: false })));

        this.conn.onmessage = (msg) => {
            this.setState(JSON.parse(msg.data));
        };
    }

    render() {
        if (!this.state.ready) {
            return null;
        }

        const player1Style = {
            left: this.state.player1Pos + "px",
        };
        const player2Style = {
            left: this.state.player2Pos + "px",
        };
        const ballStyle = {
            left: this.state.ballX + "px",
            top: this.state.ballY + "px",
        };

        return <div>
            <div className="playing-field"><div>
                <div className="player1" style={ player1Style }></div>
                <div className="player2" style={ player2Style }></div>
                <div className="ball" style={ ballStyle }></div>
            </div></div>
        </div>;
    }
}

render(<Frame />, document.getElementById("root"));
