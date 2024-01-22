import { useRef, useState } from "react";
import AudioRecord from "./components/AudioRecord";

function App() {
 
  return (
    <div className="w-screen h-screen flex items-start justify-center">
      <AudioRecord />
    </div>
  );
}

export default App;
