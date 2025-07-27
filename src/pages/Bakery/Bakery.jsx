import { useRef } from "react";
import "./Bakery.css";
import Breadboard from "./components/Breadboard";

function Bakery() {
  const clearRef = useRef(null);

  return (
    <div className="wrapper-m">
      <Breadboard clear={clearRef} />
      <br />
      <button onClick={() => clearRef.current?.()}>Clear</button>
    </div>
  );
}

export default Bakery;
