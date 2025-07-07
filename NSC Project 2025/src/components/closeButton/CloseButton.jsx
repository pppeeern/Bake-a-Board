function CloseButton() {
  return (
    <button
      onClick={() => history.back()}
      style={{
        position: "absolute",
        top: "50px",
        right: "50px",
        borderRadius: "8px",
        border: "none",
        padding: "0.6em 1.2em",
        fontSize: "1em",
      }}
    >
      X
    </button>
  );
}

export default CloseButton;
