import React from "react";

import { Positive, Negative } from "./ui/icons";
import { Button } from "./ui/buttons";
import { playErrorSound, playSuccessSound } from "./sounds";

import './scan-result.css';
import ScanError from "./scan-error";

function CheckResult({ name, result }) {
    if (result === undefined) {
        return <div>{name} check pending...</div>;
    }

    if (result === null) {
        return <div>{name} check not executed</div>;
    }

    return <div className="result-row">
        <div className="result-icon">{result.isValid ? <Positive /> : <Negative />}</div>
        <div>
            {name} check:<br />
            {result.text}
        </div>
    </div>;
}

export default class ScanResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checks: [...this.props.result.checks.entries()]
        };
    }

    componentDidMount() {
        if (this.props.result) {
            playSuccessSound();
        } else {
            playErrorSound();
        }
        this.props.result.on('update', this.handleUpdate);
    }

    componentWillUnmount() {
        this.props.result.off('update', this.handleUpdate);
    }

    handleUpdate = () => {
        this.setState({ checks: [...this.props.result.checks.entries()] });
        playSuccessSound();
    };

    render() {
        const { ticketData, error } = this.props.result;

        if (error) {
            return <ScanError error={error} onReset={this.props.onReset} />;
        }

        const results = this.state.checks.map(([name, result]) =>
            <CheckResult key={name} name={name} result={result} />);

        return (
            <div className="scan-result-container">
                <div className="ticket-data">
                    👱 {ticketData.name}<br />
                    {ticketData.tshirt ? `👕 ${ticketData.tshirt}` : null}
                </div>

                {results}
                <Button onClick={this.props.onReset}>↺ scan again</Button>
            </div>
        )
    }
}
