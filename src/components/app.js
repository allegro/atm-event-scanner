import React from 'react';
import logo from '../scanner.svg';
import './app.css';

import Scanner from './scanner';
import ScanResult from './scan-result';
import ScanError from './scan-error';

export default class App extends React.Component {
    state = {
        error: null,
        result: null
    };

    handleScan = async (data) => {
        // no QR code is found
        if (!data) return this.continueScanning();

        try {
            // QR code found, validate its data against external service
            const result = this.props.validator.check(data);
            this.setState({ result });
        } catch (error) {
            this.setState({ error: `invalidTicketFormat: ${data}`});
        }
    };

    handleError = error => {
        this.setState({ error: `scannerError: ${error}` });
    };

    continueScanning = () => {
        this.setState({ result: null, error: null });
    };

    renderContent() {
        const { result, error } = this.state;

        if (result) {
            return <ScanResult result={result} onReset={this.continueScanning} />;
        }

        if (error) {
            return <ScanError error={error} onReset={this.continueScanning} />
        }

        return <Scanner onError={this.handleError} onScan={this.handleScan} />;
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    ATM Ticket Scanner
                </header>
                <main className="App-main">{this.renderContent()}</main>
            </div>
        );
    }
}
