function Account() {
  return (
    <div className="wrapper-m">
      <form id="register" method="post">
        <div className="flex-col">
          <div style={{ display: "flex", flexDirection: "column-reverse" }}>
            <input id="in_username" type="text" />
            <label htmlFor="in_username">Username</label>
          </div>
          <div style={{ display: "flex", flexDirection: "column-reverse" }}>
            <input id="in_email" type="email" />
            <label htmlFor="in_email">Email</label>
          </div>
          <div style={{ display: "flex", flexDirection: "column-reverse" }}>
            <input id="in_password" type="password" />
            <label htmlFor="in_password">Password</label>
          </div>
          <div style={{ display: "flex", flexDirection: "column-reverse" }}>
            <input id="in_conpassword" type="password" />
            <label htmlFor="in_conpassword">Confirm Password</label>
          </div>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Account;
