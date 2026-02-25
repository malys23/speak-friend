import { Canvas } from '@react-three/fiber';
import { PointerLockControls, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import './App.css'
//import EntranceCanvas from './pages/EntranceCanvas.jsx';
import { useEffect } from 'react';
import api from './services/api';

import DummyMessenger from './components/Messenger/DummyMessenger';

const App = () => {

    useEffect(() => {
      const testConnection = async () => {
        try{
          const response = await api.get('/api/test');
          console.log(response.data);
        } catch (err){
          console.error('Connection failed:', err);
        }
      };
      testConnection();   
  }, []);
  
  return (
    <div>
      <DummyMessenger currentUserId={1}/>
    </div>
  );
  
};

export default App;
