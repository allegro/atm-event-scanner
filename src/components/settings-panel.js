import React, { useEffect, useState } from 'react';

import './settings-panel.css';

function ConnectionStatus(props) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOffline = () => setIsOnline(false);
        const handleOnline = () => setIsOnline(true);

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    return (
        <div className={`${props.className} is-online is-online-${isOnline ? 'true' : 'false'}`}>
            <label>network</label>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
        </div>
    );
}

function StorageStatus(props) {
    const { hashStorage } = props;
    const [hashesCount, setHashesCount] = useState(0);

    useEffect(() => {
        const { hashes } = hashStorage.getValue();
        setHashesCount(hashes.length);

        const handleUpdate = data => setHashesCount(data.hashes.length);

        hashStorage.on('update', handleUpdate);
        return () => hashStorage.off('update', handleUpdate);
    }, [hashStorage]);

    return (
        <div className={`${props.className} memory`}>
            <label>tickets</label>
            {hashesCount}
        </div>
    );
}

function SyncStatus(props) {
    const { hashStorage } = props;
    const [updatedAt, setUpdatedAt] = useState(0);

    useEffect(() => {
        const { updatedAt } = hashStorage.getValue();
        setUpdatedAt(updatedAt);
        hashStorage.update();

        const handleUpdate = data => setUpdatedAt(data.updatedAt);

        hashStorage.on('update', handleUpdate);
        return () => hashStorage.off('update', handleUpdate);
    }, [hashStorage]);

    const lastSyncText = updatedAt
        ? `${((Date.now() - updatedAt) / 1000 / 60).toFixed(0)}min`
        : 'never';

    return (
        <div className={`${props.className} sync`}>
            <label>sync</label>
            {lastSyncText}
        </div>
    );
}

function ModeStatus(props) {
    const { modeStorage } = props;
    const [mode, setMode] = useState(0);

    useEffect(() => {
        const mode = modeStorage.getValue();
        const handleUpdate = mode => setMode(mode);

        setMode(mode);
        modeStorage.on('update', handleUpdate);
        return () => modeStorage.off('update', handleUpdate);
    }, [modeStorage]);

    return (
        <div className={`${props.className} sync`} onClick={() => window.confirm('Change mode?') && modeStorage.toggle()}>
            <label>mode</label>
            {mode}
        </div>
    );
}

export default function SettingsPanel(props) {
    return (
        <div className="settings-panel">
            <ConnectionStatus className="settings-panel-item" />
            <StorageStatus className="settings-panel-item" hashStorage={props.hashStorage} />
            <SyncStatus className="settings-panel-item" hashStorage={props.hashStorage} />
            <ModeStatus className="settings-panel-item" modeStorage={props.modeStorage} />
        </div>
    );
};