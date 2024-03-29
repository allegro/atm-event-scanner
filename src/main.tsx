import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from "./App";
import { MantineProvider } from '@mantine/core';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <MantineProvider withGlobalStyles withNormalizeCSS>
        <App/>
    </MantineProvider>
)
