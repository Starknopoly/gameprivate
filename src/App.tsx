
import './App.css';
import { useEffect } from 'react';
import { useNetworkLayer } from './hooks/useNetworkLayer';
import { PhaserLayer } from './phaser/phaserLayer';
import { store } from "./store/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UI from './ui';

function App() {
  const networkLayer = useNetworkLayer();
  useEffect(() => {
    if (!networkLayer) return;

    console.log("Setting network layer");

    store.setState({ networkLayer });

  }, [networkLayer]);


  return (
    <div>
      <PhaserLayer networkLayer={networkLayer} />
      <UI />
      <ToastContainer />
    </div>
  );
}

export default App;
