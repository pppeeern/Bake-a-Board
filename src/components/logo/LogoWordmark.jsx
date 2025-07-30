import { useNavigate } from "react-router-dom";
import "./Logo.css";

function LogoWordmark() {
  const navigate = useNavigate();

  return (
    <div className="wordmark" onClick={() => navigate("/")}>
      BAKE-A<br></br>BOARD
    </div>
  );
}

export default LogoWordmark;
