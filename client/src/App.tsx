import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/three";
import { SocketManager } from "./components/socket";

function App() {
  return (
    <main className="w-screen h-screen">
      <SocketManager />
      <Canvas shadows camera={{ position: [0, 0, 10] }}>
        <Experience />
      </Canvas>
    </main>
  );
}

export default App;
