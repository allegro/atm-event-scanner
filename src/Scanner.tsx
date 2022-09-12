import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import { QrcodeErrorCallback, QrcodeSuccessCallback, QrDimensionFunction } from "html5-qrcode/core";
import { Html5QrcodeSupportedFormats } from "html5-qrcode/esm/core";

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
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            fps: undefined,
            qrbox: undefined,
            rememberLastUsedCamera: true,
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


