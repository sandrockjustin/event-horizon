import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './components/App.tsx'

const root = createRoot(document.getElementById('app'))

root.render( <App/>)