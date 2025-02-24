const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }
  if (error === false) {
    return (
      <div className="notification">
        {message}
      </div>
    )
  } else {
    return (
      <div className="error">
        {message}
      </div>
    )
  }

}

export default Notification