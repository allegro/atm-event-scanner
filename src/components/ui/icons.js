import React from 'react';

export function Positive() {
    return <svg enableBackground="new 0 0 50 50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="25" fill="#25AE88" />
        <path fill="none" stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M38 15L22 33 12 25" />
    </svg>
}

export function Negative() {
    return <svg enableBackground="new 0 0 50 50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="25" fill="#D75A4A" />
        <path fill="none" stroke="#FFF" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" d="M16 34L25 25 34 16" />
        <path fill="none" stroke="#FFF" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" d="M16 16L25 25 34 34" />
    </svg>;
}