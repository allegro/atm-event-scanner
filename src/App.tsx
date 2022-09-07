import { QrReader } from "react-qr-reader";
import { Alert, Button, Container, MantineTheme, Stack, Title, useMantineTheme } from "@mantine/core";
import { Synth } from "tone";
import { useTimeout } from "@mantine/hooks";
import { useState } from "react";

type TicketState = 'valid' | 'invalid' | undefined;

export default function App() {
    const theme = useMantineTheme();
    const [state, setState] = useState<TicketState>();
    const { start, clear } = useTimeout(() => setState(undefined), 1000);
    getBorderColor(state, theme);
    return (
        <Container>
            <Stack>
                <Container mt="lg">
                    <Title>ATM Tickets</Title>
                </Container>
                <QrReader
                    scanDelay={300}
                    containerStyle={{
                        border: getBorderColor(state, theme),
                        minWidth: '100%',
                        boxSizing: 'border-box',
                        transition: 'border 0.2s ease-out'
                    }}
                    videoStyle={{ width: 'auto' }}
                    constraints={{ facingMode: 'environment' }}
                    onResult={(result, error) => {
                        if (!!result) {
                            const text = result.getText();
                            if (text.match(/[0-9a-f]+;(Poznań|Warszaw|Kraków)/)) {
                                console.log(text);
                            }
                        }
                    }}
                />
                <ScanningResult state={state}/>
                <Button onClick={() => {
                    clear();
                    setState('valid');
                    playSuccessSound();
                    start();
                }}>OK!
                </Button>
                <Button color="red" onClick={() => {
                    clear();
                    setState('invalid');
                    playErrorSound();
                    start();
                }}>ERROR!</Button>

            </Stack>
        </Container>
    )
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

