import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import AppTest from './AppTest.tsx';
import { PAUSE } from './config.ts';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

if (process.env.NODE_ENV === 'production') {
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
}

root.render(PAUSE?  <AppTest/>:<App/>);