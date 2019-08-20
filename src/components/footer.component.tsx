import React from "react";

class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <p>
          Love from <img src="img/logo.png" className="logo" /> &{" "}
          <img src="img/soundcloud.png" className="soundcloud" />
        </p>
      </div>
    );
  }
}

export default Footer;
