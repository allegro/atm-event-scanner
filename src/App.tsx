import { Alert, Container, MantineTheme, Stack, Title, useMantineTheme } from "@mantine/core";
import { Synth } from "tone";
import { useTimeout } from "@mantine/hooks";
import React, { useState } from "react";
import Scanner from "./Scanner";

type TicketState = 'valid' | 'invalid' | undefined;

export default function App() {
    const theme = useMantineTheme();
    const [state, setState] = useState<TicketState>();
    const { start, clear } = useTimeout(() => setState(undefined), 1000);

    return (
        <Container>
            <Stack>
                <Container mt="lg">
                    <Title>ATM Tickets</Title>
                </Container>
                <div style={{
                    border: getBorderColor(state, theme),
                    boxSizing: 'border-box',
                    transition: 'border 0.2s ease-out'
                }}>
                    <Scanner
                        qrCodeErrorCallback={(_, __) => undefined}
                        qrCodeSuccessCallback={(result) => handleScan(result, clear, setState, start)}
                    />
                </div>
                <ScanningResult state={state}/>
            </Stack>
        </Container>
    )
}

function handleScan(text: string,
                    clear: () => void,
                    setState: React.Dispatch<React.SetStateAction<TicketState>>,
                    start: () => void) {
    if (!!text) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 500);
        const target = new URL('https://us-central1-atm2021-76ccb.cloudfunctions.net/ticketVerfication2022');
        target.searchParams.append('ticket', text);
        fetch(target, { signal: controller.signal }).then(response => {
            clearTimeout(timeoutId);
            if (response.status === 200) {
                clear();
                setState('valid');
                playSuccessSound();
                start();
            } else {
                clear();
                setState('invalid');
                playErrorSound();
                start();
            }
        });
    }
}

function ScanningResult({ state }: { state: TicketState }) {
    switch (state) {
        case 'valid': {
            return (
                <Alert title="Miodzio!" color="green">
                    Można wchodzic!
                </Alert>
            )
        }
        case 'invalid': {
            return (
                <Alert title="Ups!" color="red">
                    Bilet niepoprawny.
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

function getBorderColor(state: "valid" | "invalid" | undefined, theme: MantineTheme) {
    switch (state) {
        case 'valid': {
            return `10px solid ${theme.colors.green[5]}`;
        }
        case 'invalid': {
            return `10px solid ${theme.colors.red[5]}`;
        }
        default:
            return `10px solid ${theme.colors.gray[5]}`;
    }
}

function playSound(tone: string, length: string) {
    const synth = new Synth().toDestination();
    synth.triggerAttackRelease(tone, length);
}

export function playSuccessSound() {
    playSound('C6', '32n');
}

export function playErrorSound() {
    playSound('G3', '16n');
}

