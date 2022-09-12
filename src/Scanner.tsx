import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import { QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode/core";

const id = 'scanner';

export default function Scanner({
                                    qrCodeSuccessCallback,
                                    qrCodeErrorCallback
                                }: { qrCodeSuccessCallback: QrcodeSuccessCallback, qrCodeErrorCallback: QrcodeErrorCallback }) {
    useEffect(() => {
        const html5QrcodeScanner = new Html5QrcodeScanner(id, {
            aspectRatio: undefined,
            disableFlip: undefined,
            experimentalFeatures: undefined,
            formatsToSupport: undefined,
            fps: 2,
            qrbox: undefined,
            rememberLastUsedCamera: undefined,
            supportedScanTypes: [],
            videoConstraints: undefined
        }, true);

        html5QrcodeScanner.render(
            qrCodeSuccessCallback,
            qrCodeErrorCallback
        );
    }, []);
    return (
        <div id={id}/>
    );
}


