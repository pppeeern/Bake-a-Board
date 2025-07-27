import { useEffect, useState } from "react";

function Breadboard({ clear }) {
  const [selectedPin, setSelectedPin] = useState(null);
  const [connects, setConnects] = useState([]);

  const pin = (id) => {
    return (
      <button
        key={id}
        title={id}
        className={`bb_pin ${selectedPin === id ? "selected" : ""} ${
          connects.some((c) => c.from === id || c.to === id) ? "connected" : ""
        }`}
        onClick={() => handlePinSelect(id)}
      />
    );
  };

  const handlePinSelect = (id) => {
    if (!selectedPin) setSelectedPin(id);
    else if (selectedPin === id) setSelectedPin(null);
    else {
      const newConnect = {
        from: selectedPin,
        to: id,
      };
      setConnects([...connects, newConnect]);
      setTimeout(() => {
        setSelectedPin(null);
      }, 200);
    }
  };

  const handleClear = () => {
    setConnects([]);
    setSelectedPin(null);
  };

  useEffect(() => {
    if (clear) clear.current = handleClear;
  }, [clear]);

  return (
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
  );
}

export default Breadboard;
