import "./CloseButton.css";

function CloseButton() {
  return (
    <button id="close_button" onClick={() => history.back()}>
      X
    </button>
  );
}

export default CloseButton;
