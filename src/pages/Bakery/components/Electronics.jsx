import "./Electronics.css";
import { components } from "./bakeryComponents";

export function Battery5V({ onSelect, isSelect, isConnected, children }) {
  const VCC = "Battery 5V (VCC)";
  const GND = "Battery 5V (GND)";

  return (
    <div className="comp battery">
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 53.06 81.75"
        width={200}
        height={320}
      >
        <defs>
          <clipPath id="clip-path" transform="translate(-23.47 -9.37)">
            <path
              className="cls-1"
              d="M68.53,57.24l-5.94-1.53-3-3.53-6.44-.71L48.27,54l-6.68-3.85-4.35,2.23-5-3.76L25,47.94V86.31a3.06,3.06,0,0,0,3.06,3.06H71.94A3.06,3.06,0,0,0,75,86.31V55.24Z"
            />
          </clipPath>
        </defs>
        <g className="cls-2">
          <g id="Bar">
            <polygon
              className="cls-3"
              points="14.03 45 1.53 60 1.53 30 14.03 45"
            />
            <polygon
              className="cls-4"
              points="26.53 30 14.03 45 1.53 30 26.53 30"
            />
            <polygon
              className="cls-5"
              points="26.53 30 26.53 60 14.03 45 26.53 30"
            />
            <polygon
              className="cls-3"
              points="26.53 60 1.53 60 14.03 45 26.53 60"
            />
            <rect
              className="cls-6"
              x="27.3"
              y="45.86"
              width="20.39"
              height="17"
              transform="translate(68.39 7.49) rotate(90)"
            />
            <polygon
              className="cls-3"
              points="39.03 45 26.53 60 26.53 30 39.03 45"
            />
            <polygon
              className="cls-4"
              points="51.53 30 39.03 45 26.53 30 51.53 30"
            />
            <polygon
              className="cls-5"
              points="51.53 30 51.53 60 39.03 45 51.53 30"
            />
            <polygon
              className="cls-3"
              points="51.53 60 26.53 60 39.03 45 51.53 60"
            />
            <rect
              className="cls-6"
              x="52.3"
              y="45.86"
              width="20.39"
              height="17"
              transform="translate(93.39 -17.51) rotate(90)"
            />
            <path
              className="cls-7"
              d="M68.53,57.24l-5.94-1.53-3-3.53-6.44-.71L48.27,54l-6.68-3.85-4.35,2.23-5-3.76L25,47.94V86.31a3.06,3.06,0,0,0,3.06,3.06H71.94A3.06,3.06,0,0,0,75,86.31V55.24Z"
              transform="translate(-23.47 -9.37)"
            />
            <path
              className="cls-8"
              d="M71.82,59.94l-4.7-.82-2.71,2.23-2.35-4-2.47,2.59-.71-5.57-3.29,1.69-2.94-1.8-3.3,4.27-7.29-5.27-6.35,3.27-3-4.35L25,50V86.31a3.06,3.06,0,0,0,3.06,3.06H71.94A3.06,3.06,0,0,0,75,86.31V57.71Z"
              transform="translate(-23.47 -9.37)"
            />
            <g className="cls-9">
              <g className="cls-10">
                <rect className="cls-3" y="37.1" width="5.53" height="44.65" />
                <rect
                  className="cls-3"
                  x="47.53"
                  y="37.1"
                  width="5.53"
                  height="44.65"
                />
              </g>
            </g>
            <rect
              className="cls-7"
              x="9.71"
              y="57.04"
              width="33.65"
              height="15"
              rx="7.5"
            />
            <path
              className="cls-8"
              d="M49,79.22a2.78,2.78,0,0,1-2-.78,3.25,3.25,0,0,1-.91-2.19H48a1.46,1.46,0,0,0,.33.85,1.06,1.06,0,0,0,1.5,0,1.39,1.39,0,0,0,.27-.91v-.83a1.49,1.49,0,0,0-.24-.91.82.82,0,0,0-.69-.32,1.1,1.1,0,0,0-.68.21,1.12,1.12,0,0,0-.4.57H46.29V69.18h5.34V71H48.17v1.76a1.47,1.47,0,0,1,.58-.33,2.27,2.27,0,0,1,.72-.12,2.2,2.2,0,0,1,1.81.8,3.49,3.49,0,0,1,.64,2.25v.83a3.12,3.12,0,0,1-.77,2.25A2.86,2.86,0,0,1,49,79.22Z"
              transform="translate(-23.47 -9.37)"
            />
            <path
              className="cls-8"
              d="M55.76,79.12l-3.3-9.94h1.92l2.12,6.63,2.11-6.63h1.93l-3.31,9.94Z"
              transform="translate(-23.47 -9.37)"
            />
            <path
              className="cls-8"
              d="M43.64,73.65a.44.44,0,0,0-.39-.23H41.81l1-2.84a.44.44,0,0,0-.23-.55.45.45,0,0,0-.57.17l-2.51,4.19a.32.32,0,0,0-.06.17.49.49,0,0,0,.06.29.45.45,0,0,0,.38.22h1.45l-1,2.83a.45.45,0,0,0,.23.56.65.65,0,0,0,.19,0,.43.43,0,0,0,.38-.22l2.51-4.18a.32.32,0,0,0,.06-.18A.37.37,0,0,0,43.64,73.65Z"
              transform="translate(-23.47 -9.37)"
            />
          </g>
          <g
            id="VCC_Bar"
            className={`${isSelect(VCC) || isConnected(VCC) ? "active" : ""}`}
            onClick={() => onSelect(VCC)}
          >
            <polygon
              className="cls-3"
              points="14.03 15 1.53 30 1.53 0 14.03 15"
            />
            <polygon
              className="cls-4"
              points="26.53 0 14.03 15 1.53 0 26.53 0"
            />
            <polygon
              className="cls-5"
              points="26.53 0 26.53 30 14.03 15 26.53 0"
            />
            <polygon
              className="cls-3"
              points="26.53 30 1.53 30 14.03 15 26.53 30"
            />
            <rect
              className="cls-6"
              x="27.3"
              y="15.87"
              width="20.39"
              height="17"
              transform="translate(38.4 -22.5) rotate(90)"
            />
            <polygon
              className="cls-7"
              points="18.17 13.22 15.28 13.22 15.28 10.48 12.68 10.48 12.68 13.22 9.79 13.22 9.79 15.72 12.68 15.72 12.68 18.47 15.28 18.47 15.28 15.72 18.17 15.72 18.17 13.22"
            />
          </g>
          <g
            id="GND_Bar"
            className={`${isSelect(GND) || isConnected(GND) ? "active" : ""}`}
            onClick={() => onSelect(GND)}
          >
            <polygon
              className="cls-3"
              points="39.03 15 26.53 30 26.53 0 39.03 15"
            />
            <polygon
              className="cls-4"
              points="51.53 0 39.03 15 26.53 0 51.53 0"
            />
            <polygon
              className="cls-5"
              points="51.53 0 51.53 30 39.03 15 51.53 0"
            />
            <polygon
              className="cls-3"
              points="51.53 30 26.53 30 39.03 15 51.53 30"
            />
            <rect
              className="cls-6"
              x="52.31"
              y="15.87"
              width="20.38"
              height="17"
              transform="translate(63.4 -47.5) rotate(90)"
            />
            <path
              className="cls-7"
              d="M59,23.07h7v2.6H59Z"
              transform="translate(-23.47 -9.37)"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function LED({ onSelect, isSelect, isConnected, isPowered, getPinType, children }) {
  const Anode = "LED (Anode)";
  const Cathode = "LED (Cathode)";

  // Determine pin types (VCC/GND) if connected
  const anodeType = getPinType ? getPinType(Anode) : null;
  const cathodeType = getPinType ? getPinType(Cathode) : null;

  return (
    <div className="comp led">
      {children}
      <svg width="60" height="150" viewBox="0 0 60 150">
        <g
          className={`led-pin anode ${anodeType || ""} ${isSelect(Anode) || isConnected(Anode) ? "active" : ""}`}
          onClick={() => onSelect(Anode)}
        >
          {/* Visual Leg */}
          <rect x="35" y="60" width="4" height="90" className="leg" />
          {/* Interaction Zone */}
          <rect x="33" y="60" width="8" height="90" fill="transparent" />
        </g>

        <g
          className={`led-pin cathode ${cathodeType || ""} ${isSelect(Cathode) || isConnected(Cathode) ? "active" : ""}`}
          onClick={() => onSelect(Cathode)}
        >
          {/* Visual Leg */}
          <rect x="21" y="60" width="4" height="70" className="leg" />
          {/* Interaction Zone */}
          <rect x="19" y="60" width="8" height="70" fill="transparent" />
        </g>

        <path
          d="M15,60 L45,60 L45,30 A15,15 0 0,0 15,30 Z"
          fill={isPowered ? "#FF0000" : "#550000"}
          stroke={isPowered ? "#FF4444" : "#330000"}
          strokeWidth="2"
          style={{ filter: isPowered ? "drop-shadow(0 0 10px #FF0000)" : "none" }}
        />
        <ellipse
          cx="25"
          cy="25"
          rx="5"
          ry="8"
          fill="rgba(255,255,255,0.4)"
          transform="rotate(-30 25 25)"
        />
      </svg>
    </div>
  );
}
