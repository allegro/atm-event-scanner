import React from "react";

import { Negative } from "./ui/icons";
import { Button } from "./ui/buttons";
import { playErrorSound } from "./sounds";

import "./scan-error.css";

export default class ScanError extends React.Component {
    componentDidMount() {
        playErrorSound();
    }

    render() {
        const { error, onReset } = this.props;

        return <div className="scan-error-container">
            <Negative />
            <div className="scan-error-msg">{error}</div>
            <Button onClick={onReset}>scan again</Button>
        </div>;
    }
}
