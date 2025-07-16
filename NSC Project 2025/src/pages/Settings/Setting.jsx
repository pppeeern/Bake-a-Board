function Setting() {
  return (
    <div className="wrapper">
      <div>Account</div>
      <div>
        <label htmlFor="username">Username</label>
        <input type="text" placeholder="Username" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="text" placeholder="Email@email.com" />
      </div>
      <div>
        <label htmlFor="curpas">Current Password</label>
        <input type="text" placeholder="Current Password" />
      </div>
      <div>
        <label htmlFor="newpas">New Password</label>
        <input type="text" placeholder="New Password" />
      </div>
      <button type="submit">Save Changes</button>
      <button>Explode account</button>
    </div>
  );
}

export default Setting;
