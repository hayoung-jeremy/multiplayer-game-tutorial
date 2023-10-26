import { Canvas } from "@react-three/fiber";

import { Experience } from "./components/three";
import { SocketManager } from "./components/socket";
import { Navigator } from "./components/ui";

function App() {
  return (
    <main className="w-screen h-screen">
      <SocketManager />
      <Canvas shadows camera={{ position: [6, 6, 6], fov: 30 }}>
        <Experience />
      </Canvas>
      <Navigator />
    </main>
  );
}

export default App;
