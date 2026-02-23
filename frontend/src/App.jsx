import { Canvas } from '@react-three/fiber';
import { PointerLockControls, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import './App.css'
import EntranceCanvas from './pages/EntranceCanvas.jsx';

const App = () => {

  return (
    <EntranceCanvas/>
  );
}

export default App;
