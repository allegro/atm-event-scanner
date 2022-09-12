import { Alert, Container, MantineTheme, Stack, Title, useMantineTheme } from "@mantine/core";
import { Synth } from "tone";
import React, { useState } from "react";
import Scanner from "./Scanner";

const synth = new Synth().toDestination();

enum ScannerState {
    'idle', 'loading', 'valid', 'invalid', 'error'
}

let scannerState = ScannerState.idle;

export default function App() {
    const theme = useMantineTheme();
    const [borderState, setBorderState] = useState<ScannerState>(ScannerState.idle);
    return (
        <Container>
            <Stack>
                <Container mt="lg">
                    <Title>ATM Tickets</Title>
                </Container>
                <div style={{
                    border: getBorderColor(borderState, theme),
                    boxSizing: 'border-box',
                    transition: 'border 0.2s ease-out'
                }}>
                    <Scanner
                        qrCodeErrorCallback={(_, __) => undefined}
                        qrCodeSuccessCallback={(result) => handleScan(result, scannerState, setBorderState)}
                    />
                </div>
                <ScanningResult state={borderState}/>
            </Stack>
        </Container>
    )
}

function handleScan(text: string,
                    state: ScannerState | undefined,
                    setBorderState: React.Dispatch<React.SetStateAction<ScannerState>>
) {
    if (state === ScannerState.idle && !!text) {
        scannerState = ScannerState.loading;
        setBorderState(ScannerState.loading)
        const target = new URL('https://us-central1-atm2021-76ccb.cloudfunctions.net/ticketVerfication2022');
        target.searchParams.append('ticket', text);
        fetch(target)
            .then(response => response.json())
            .then(result => {
                if (result.verified) {
                    setBorderState(ScannerState.valid);
                    playSuccessSound();
                } else {
                    setBorderState(ScannerState.invalid);
                    playErrorSound();
                }
            })
            .catch((error) => {
                console.error(error);
                setBorderState(ScannerState.error);
            })
            .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
            .finally(() => {
                scannerState = ScannerState.idle;
                setBorderState(ScannerState.idle);
            });
    }
}

function ScanningResult({ state }: { state: ScannerState | undefined }) {
    switch (state) {
        case ScannerState.valid: {
            return (
                <Alert title="Miodzio!" color="green">
                    Można wchodzic!
                </Alert>
            )
        }
        case ScannerState.invalid: {
            return (
                <Alert title="Ups!" color="red">
                    Bilet niepoprawny.
                </Alert>
            )
        }
        case ScannerState.error: {
            return (
                <Alert title="Ups!" color="red">
                    Nie udało się sprawdzić biletu.
                    Prosimy o kontakt z organizatorem.
                </Alert>
            )
        }
        case ScannerState.loading: {
            return (
                <Alert title="Ups!" color="yellow">
                    Sprawdzanie....
                </Alert>
            )
        }
        default:
            return (
                <Alert title="Czekam...." color="blue">
                    Zeskanuj bilet
                </Alert>
            );
    }
}

function getBorderColor(state: ScannerState | undefined, theme: MantineTheme) {
    switch (state) {
        case ScannerState.valid: {
            return `10px solid ${theme.colors.green[5]}`;
        }
        case ScannerState.invalid: {
            return `10px solid ${theme.colors.red[5]}`;
        }
        case ScannerState.loading: {
            return `10px solid ${theme.colors.yellow[5]}`;
        }
        case ScannerState.error: {
            return `10px solid ${theme.colors.red[9]}`;
        }
        case ScannerState.idle: {
            return `10px solid ${theme.colors.gray[5]}`;
        }
    }
}

function playSound(tone: string, length: string) {
    synth.triggerAttackRelease(tone, length);
}

export function playSuccessSound() {
    playSound('C6', '32n');
}

export function playErrorSound() {
    playSound('G3', '16n');
}

