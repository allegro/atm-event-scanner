import React from 'react';
import QrReader from 'react-qr-reader';

export default function Scanner({ onError, onScan }) {
    return <QrReader
        delay={300}
        facingMode="environment"
        onError={onError}
        onScan={onScan}
        style={{ width: '100%' }}
    />;
}
