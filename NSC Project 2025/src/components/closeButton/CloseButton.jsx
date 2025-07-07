function CloseButton() {
  return (
    <button
        onClick={() => history.back()}
        style={{
        position: 'absolute',
        top: '50px',
        right: '50px'
    }}>
    X
    </button>
  )
}

export default CloseButton