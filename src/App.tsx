
import './App.css';
import { useEffect } from 'react';
import { useNetworkLayer } from './hooks/useNetworkLayer';
import { PhaserLayer } from './phaser/phaserLayer';
import { store } from "./store/store";
import NamesUI from './ui/names';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UI from './ui';
import BuildingTip from './ui/buildingtip';

function App() {
  const networkLayer = useNetworkLayer();
  const { tooltip } = store();
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
      <div>
        {tooltip.show && (
          <div
            className="tooltip"
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
          >
            {
              tooltip.content
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
