import { Canvas } from "@react-three/fiber";

import { Experience } from "./components/three";
import { SocketManager } from "./components/socket";
import { Navigator } from "./components/ui";
import { ScrollControls } from "@react-three/drei";

function App() {
  return (
    <main className="w-screen h-screen">
      <SocketManager />
      <Canvas shadows camera={{ position: [6, 6, 6], fov: 30 }}>
        <ScrollControls pages={4}>
          <Experience />
        </ScrollControls>
      </Canvas>
      <Navigator />
    </main>
  );
}

export default App;
