import Tone from "tone";

function playSound(tone, length) {
    const synth = new Tone.Synth().toMaster();
    synth.triggerAttackRelease(tone, length);
}

export function playSuccessSound() {
    playSound('C6', '32n');
}

export function playErrorSound() {
    playSound('G3', '4n');
}
