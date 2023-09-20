import './App.css';
import { useEffect } from 'react';
import { useNetworkLayer } from './hooks/useNetworkLayer';
import { PhaserLayer } from './phaser/phaserLayer';
import { store } from "./store/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UI from './ui';
import ReactTooltip from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

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
      <Tooltip id="my-tooltip" />
    </div>
  );
}

export default App;
