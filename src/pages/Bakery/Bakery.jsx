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
import { components as compData } from "./components/bakeryComponents";
import { category } from "./components/bakeryComponents";
import * as bakeryAsset from "./components/assets";

function Bakery() {
  const clearRef = useRef(null);
  const __bb_scale__ = 0.9;
  const [zoom, setZoom] = useState(__bb_scale__);
  const [tip, setTip] = useState(null);
  const [expand, setExpand] = useState(false);
  const [components, setComponents] = useState([]);

  const handleExpand = () => {
    setExpand((prev) => !prev);
  };

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
              setComponents([]);
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

  const [cat, setCat] = useState(null);
  const [search, setSearch] = useState(null);
  const [showName, setShowName] = useState(false);
  const bakingFilterComponent = () => {
    return (
      <div className="baking_filter_container flex-col">
        <div className="baking_filter">
          <Search size={20} />
          <input
            id="baking_search"
            type="text"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </div>
        <div className="baking_filter">
          <LayoutDashboard size={20} />
          <select
            name="baking_cat"
            id="baking_cat"
            onChange={(e) => {
              const selectCat = e.target.value;
              if (selectCat != "no") setCat(selectCat);
              else setCat(null);
            }}
          >
            {category.map((c) => (
              <option value={c.value}>{c.cat}</option>
            ))}
          </select>
        </div>
        <div className="baking_filter checkbox_container">
          <input
            className="checkbox"
            type="checkbox"
            id="show_name"
            onChange={(e) => setShowName(e.target.checked)}
          />
          <label htmlFor="show_name">Show name</label>
        </div>
      </div>
    );
  };

  const bakeryBaking = () => {
    return (
      <div className={`bakery_baking_container ${expand ? "expand" : ""}`}>
        <button className="expand_button" onClick={handleExpand}>
          {expand ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
        {bakingFilterComponent()}
        <div className="baking_items_container">
          {compData
            .filter(
              (e) =>
                (!cat || e.category === cat) &&
                (!search || e.name.toLowerCase().includes(search))
            )
            .map((e) => (
              <div
                key={e.id}
                title={e.name}
                className="baking_item"
                onClick={() => {
                  setComponents([...components, e]);
                  setTip(`Placed: ${e.name}`);
                }}
              >
                <div className="baking_item_img">
                  <img src={bakeryAsset[e.img]} alt={e.name} />
                </div>
                {showName ? (
                  <div className="baking_item_label">{e.name}</div>
                ) : null}
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="wrapper-m">
      {bakeryRibbon()}
      <Breadboard
        clear={clearRef}
        zoom={zoom}
        setTip={setTip}
        components={components}
        setComponents={setComponents}
      />
      {bakeryBaking()}
    </div>
  );
}

export default Bakery;
