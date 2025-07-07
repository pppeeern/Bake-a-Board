import "./BreadexInfo.css";
import CloseButton from "../../components/closeButton/CloseButton";

function BreadexInfo() {
  return (
    <div className="wrapper-m">
      <CloseButton />
      <div id="info_container" className="flex-row">
        <div id="info_img"></div>
        <div id="info_text_container" className="flex-col">
          <div className="flex-row" style={{ gap: "10px" }}>
            <div style={{ flex: 1, fontSize: "1.4rem" }}>Name</div>
            <div>...</div>
          </div>
          <div className="dashed"></div>
          <div>Des</div>
        </div>
      </div>
    </div>
  );
}

export default BreadexInfo;
