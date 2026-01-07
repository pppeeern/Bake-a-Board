import { useEffect, useState, useMemo } from "react";
import * as Electronics from "./Electronics.jsx";
import { checkCircuit, buildNets } from "./circuitLogic";

function Breadboard({ clear, zoom, setTip, components, setComponents }) {
  const [selecting, setSelecting] = useState(null);
  const [connects, setConnects] = useState([]);

  // Calculate net connectivity
  const netHelper = useMemo(() => {
    return buildNets(connects);
  }, [connects]);

  // Calculate circuit state
  const circuitState = useMemo(() => {
    return checkCircuit(components, connects);
  }, [components, connects]);

  const isSelect = (id) => selecting === id;
  const isConnected = (id) =>
    connects.some((c) => c.from?.includes(id) || c.to?.includes(id));

  const handleConnect = (id) => {
    if (selecting) {
      const newConnect = {
        from: selecting,
        to: id,
      };

      if (!isConnected(selecting) && !isConnected(id)) {
        setConnects([...connects, newConnect]);
        setTip(`Connected: ${newConnect.from} → ${newConnect.to}`);
      } else {
        setTip("Already Connected!");
      }
      setTimeout(() => {
        setSelecting(null);
      }, 300);
    }
  };

  const handleDisconnect = (e) => {
    setTip(
      `Disconnected: ${connects
        .filter((c) => c.to === e)
        .map((c) => c.from)} → ${e}`
    );
    const newConnects = connects.filter((c) => c.from !== e && c.to !== e);
    setConnects(newConnects);
  };

  const handleSelect = (e) => {
    if (!selecting && isConnected(e)) {
      handleDisconnect(e);
    } else {
      if (selecting != e) {
        setSelecting(e);
        setTip(`Selecting: ${e}`);
      } else {
        setSelecting(null);
        setTip(null);
      }
    }
  };

  const handleClear = () => {
    setSelecting(null);
    setConnects([]);
    setTip(null);
  };

  const handleComponentClearPin = (com) => {
    setConnects((prev) =>
      prev.filter((c) => !c.from?.includes(com) && !c.to?.includes(com))
    );
    setTip(`Cleared pins from: ${com}`);
  };
  const handleComponentRemove = (com) => {
    handleComponentClearPin(com);
    setComponents((prev) => prev.filter((c) => !c.name.includes(com)));
    setTip(`Removed: ${com}`);
  };

  useEffect(() => {
    if (clear) clear.current = handleClear;
  }, [clear]);

  const getPinType = (id) => {
    for (let conn of connects) {
      if (conn.from?.includes("VCC") && conn.to === id) return "vcc";
      if (conn.from?.includes("GND") && conn.to === id) return "gnd";
    }
    return null;
  };

  const pin = (id) => {
    return (
      <button
        key={id}
        title={id}
        className={`bb_pin ${getPinType(id)}`}
        onClick={() => {
          if (isConnected(id)) handleDisconnect(id);
          else handleConnect(id);
        }}
      />
    );
  };

  return (
    <div
      style={{
        transform: `scale(${zoom})`,
        transition: "transform 0.2s ease-out",
      }}
    >
      {components.map((component, i) => {
        const nameKey = component?.name?.replace(/\s+/g, "");
        const Comp = Electronics[nameKey];
        const { id, name } = component;
        return Comp ? (
          <Comp
            key={`${i}-${id}`}
            onSelect={handleSelect}
            isSelect={isSelect}
            isConnected={isConnected}
            isPowered={circuitState[id]?.isPowered}
            getPinType={getPinType}
          >
            <div className="comp_hover">
              <div className="comp_hover_name">{name}</div>
              <button
                className={`${!connects.some(
                  (c) => c.from?.includes(name) || c.to?.includes(name)
                )
                  ? "disable"
                  : ""
                  }`}
                onClick={() => handleComponentClearPin(name)}
              >
                Clear Pins
              </button>
              <button onClick={() => handleComponentRemove(name)}>
                Remove
              </button>
            </div>
          </Comp>
        ) : null;
      })}
      <div className="bb_body">
        <div className="bb_vol">
          <div style={{ width: "100%", borderTop: "0.15rem solid red" }} />
          {["+", "-"].map((row) => (
            <div key={row} className="bb_part_sec">
              <div className="bb_part_pin_label">{row}</div>
              <div
                className="bb_part_pin_container"
                style={{ gap: "2rem", padding: "0 1rem" }}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="bb_part_pin_container">
                    {Array.from({ length: 5 }, (_, col) => {
                      const pinId = `${row}${i * 5 + col + 1}`;
                      return pin(pinId);
                    })}
                  </div>
                ))}
              </div>
              <div className="bb_part_pin_label">{row}</div>
            </div>
          ))}
          <div style={{ width: "100%", borderBottom: "0.15rem solid blue" }} />
        </div>
        {/* <div className="bb_break" /> */}
        <div className="bb_part top">
          <table>
            <tbody>
              <tr className="bb_part_sec">
                <th></th>
                {Array.from({ length: 30 }, (_, i) => (
                  <th key={i} className="bb_part_pin_label">
                    {i + 1}
                  </th>
                ))}
                <th></th>
              </tr>
              {["A", "B", "C", "D", "E"].map((row) => (
                <tr key={row} className="bb_part_sec">
                  <th className="bb_part_pin_label">{row}</th>
                  <td className="bb_part_pin_container">
                    {Array.from({ length: 30 }, (_, col) => {
                      const pinId = `${row}${col + 1}`;
                      return pin(pinId);
                    })}
                  </td>
                  <th className="bb_part_pin_label">{row}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bb_break" />
        <div className="bb_part bot">
          <table>
            <tbody>
              {["F", "G", "H", "I", "J"].map((row) => (
                <tr key={row} className="bb_part_sec">
                  <th className="bb_part_pin_label">{row}</th>
                  <td className="bb_part_pin_container">
                    {Array.from({ length: 30 }, (_, col) => {
                      const pinId = `${row}${col + 1}`;
                      return pin(pinId);
                    })}
                  </td>
                  <th className="bb_part_pin_label">{row}</th>
                </tr>
              ))}
              <tr className="bb_part_sec">
                <th></th>
                {Array.from({ length: 30 }, (_, i) => (
                  <th key={i} className="bb_part_pin_label">
                    {i + 1}
                  </th>
                ))}
                <th></th>
              </tr>
            </tbody>
          </table>
        </div>
        {/* <div className="bb_break" /> */}
        <div className="bb_vol">
          <div style={{ width: "100%", borderTop: "0.15rem solid red" }} />
          {["+", "-"].map((row) => (
            <div key={row} className="bb_part_sec">
              <div className="bb_part_pin_label">{row}</div>
              <div
                className="bb_part_pin_container"
                style={{ gap: "2rem", padding: "0 1rem" }}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="bb_part_pin_container">
                    {Array.from({ length: 5 }, (_, col) => {
                      const pinId = `${row}${i * 5 + col + 26}`;
                      return pin(pinId);
                    })}
                  </div>
                ))}
              </div>
              <div className="bb_part_pin_label">{row}</div>
            </div>
          ))}
          <div style={{ width: "100%", borderBottom: "0.15rem solid blue" }} />
        </div>
      </div>
    </div>
  );
}

export default Breadboard;
