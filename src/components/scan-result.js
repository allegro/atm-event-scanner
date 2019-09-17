import React from "react";

import { Positive, Negative } from "./ui/icons";
import { Button } from "./ui/buttons";
import { playErrorSound, playSuccessSound } from "./sounds";

import './scan-result.css';
import ScanError from "./scan-error";

function CheckResult({ name, result }) {
    if (result === undefined) {
        return <div>{name} pending...</div>;
    }

    if (result === null) {
        return <div>{name} not executed</div>;
    }

    return <div className="result-row">
        <div className="result-icon">{result.isValid ? <Positive /> : <Negative />}</div>
        <div>
            {
                Array.isArray(result.text)
                    ? result.text.map(row => <div key={row}>{row}</div>)
                    : result.text
            }
        </div>
    </div>;
}

function BandType({ type }) {
    const availableTypes = {
        STAFF: '#5f2799',
        SPEAKER: '#5f2799',
        REGULAR: '#a7168f'
    };
    const typeToShow = availableTypes.hasOwnProperty(type) ? type : 'REGULAR';
    const color = availableTypes[typeToShow];

    return <div className="ticket-type" style={{ background: color }}>{typeToShow}</div>;
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
                    <div className="ticket-data-name">{ticketData.name}</div>
                    <BandType type={ticketData.type} />
                </div>
                {results}
                <Button onClick={this.props.onReset}>scan again</Button>
            </div>
        )
    }
}
