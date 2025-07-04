import { useState } from 'react';
import './Breadex.css';

const breadexMenu = [
  { text: "Electronics", path: '' },
  { text: "Tools", path: '' },
  { text: "Symbols", path: '' }
];

function Breadex() {
  const [selected, setSelected] = useState(0); // selected = variable, setSelected = function that set selected variable

  return (
    <div id="breadex_container">
      <div id="breadex_menu">
        {breadexMenu.map((menu, index) => (
          <div
            key = {index}
            className = {`breadex_menu ${selected === index ? 'active' : ''}`}
            onClick = {() => {
                setSelected(index)
                
            }}
          >
            {menu.text}
          </div>
        ))}
      </div>
      <div id="breadex_item">
        <div>{breadexMenu[selected].text}</div>
        <div>{breadexMenu[selected].text}</div>
        <div>{breadexMenu[selected].text}</div>
        <div>{breadexMenu[selected].text}</div>
        <div>{breadexMenu[selected].text}</div>
        <div>{breadexMenu[selected].text}</div>
        <div>{breadexMenu[selected].text}</div>
      </div>
    </div>
  );
}

export default Breadex;