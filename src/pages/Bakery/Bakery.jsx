import { useRef, useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  Trash2,
  ChevronUp,
  ChevronDown,
  Search,
  LayoutDashboard,
} from "lucide-react";
import "./Bakery.css";
import Breadboard from "./components/Breadboard";
import CloseButton from "../../components/closeButton/CloseButton";
import LogoWordmark from "../../components/logo/LogoWordmark";

function Bakery() {
  const clearRef = useRef(null);
  const __bb_scale__ = 0.9;
  const [zoom, setZoom] = useState(__bb_scale__);
  const [tip, setTip] = useState(null);
  const [expand, setExpand] = useState(false);

  const bakeryRibbon = () => {
    return (
      <div id="bakery_ribbon" className="ribbon">
        <CloseButton target={"/"} />
        <div className="logo_container">
          <LogoWordmark />
        </div>
        <div className="bakery_logo">Bakery</div>
        <div className="bakery_tip">{tip ? tip : "Welcome to Bakery!"}</div>
        <div className="bakery_toolbar flex-row">
          <button
            title="Clear"
            className="square"
            onClick={() => {
              clearRef.current?.();
              setZoom(__bb_scale__);
            }}
          >
            <Trash2 size={20} />
          </button>
          <button
            title="Zoom Out"
            className="square"
            onClick={() => setZoom(Math.max(__bb_scale__ - 0.4, zoom - 0.1))}
          >
            <ZoomOut size={20} />
          </button>
          <button
            title="Zoom In"
            className="square"
            onClick={() => setZoom(Math.min(__bb_scale__ + 0.4, zoom + 0.1))}
          >
            <ZoomIn size={20} />
          </button>
        </div>
      </div>
    );
  };

  const handleExpand = () => {
    setExpand((prev) => !prev);
  };

  const bakingCat = [
    { cat: "Not selected", value: "no" },
    { cat: "Power", value: "pow" },
    { cat: "Input", value: "in" },
    { cat: "Output", value: "out" },
  ];

  const bakeryBaking = () => {
    return (
      <div className={`bakery_baking_container ${expand ? "expand" : ""}`}>
        <button className="expand_button" onClick={handleExpand}>
          {expand ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
        <div className="baking_filter_container flex-col">
          <div className="baking_filter">
            <Search size={20} />
            <input id="baking_search" type="text" />
          </div>
          <div className="baking_filter">
            <LayoutDashboard size={20} />
            <select name="baking_cat" id="baking_cat">
              {bakingCat.map((c) => (
                <option value={c.value}>{c.cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="baking_items_container">
          <div className="baking_item"></div>
          <div className="baking_item"></div>
          <div className="baking_item"></div>
          <div className="baking_item"></div>
          <div className="baking_item"></div>
          <div className="baking_item"></div>
          <div className="baking_item"></div>
          <div className="baking_item"></div>
          <div className="baking_item"></div>
          <div className="baking_item"></div>
          <div className="baking_item"></div>
          <div className="baking_item"></div>
          <div className="baking_item"></div>
          <div className="baking_item"></div>
          <div className="baking_item"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="wrapper-m">
      {bakeryRibbon()}
      <Breadboard clear={clearRef} zoom={zoom} setTip={setTip} />
      {bakeryBaking()}
    </div>
  );
}

export default Bakery;
