import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/three";
import { SocketManager } from "./components/socket";

function App() {
  return (
    <main className="w-screen h-screen">
      <SocketManager />
      <Canvas shadows camera={{ position: [6, 6, 6], fov: 30 }}>
        <Experience />
      </Canvas>
    </main>
  );
}

export default App;
