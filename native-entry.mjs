import {initializeNative} from './native-runtime.mjs';
await initializeNative();
await import('./main.jsx');
