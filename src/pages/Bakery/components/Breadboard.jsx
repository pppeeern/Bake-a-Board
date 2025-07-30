import { useEffect, useState } from "react";
import Battery from "./Battery";

function Breadboard({ clear, zoom, setTip }) {
  const [selecting, setSelecting] = useState(null);
  const [connects, setConnects] = useState([]);

  const isSelect = (id) => selecting === id;
  const isConnected = (id) =>
    connects.some((c) => c.from === id || c.to === id);

  const handleConnect = (id) => {
    if (selecting) {
      const newConnect = {
        from: selecting,
        to: id,
      };

      if (!isConnected(newConnect)) {
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

  useEffect(() => {
    if (clear) clear.current = handleClear;
  }, [clear]);

  const getPinType = (id) => {
    for (let conn of connects) {
      if (conn.from === "VCC" && conn.to === id) return "vcc";
      if (conn.from === "GND" && conn.to === id) return "gnd";
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
      <Battery
        onSelect={handleSelect}
        isSelect={isSelect}
        isConnected={isConnected}
      />
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
