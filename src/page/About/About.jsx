import React, { useEffect, useState } from "react";

function About() {
  const [state, setstate] = useState({
    //
  });
  const getUserInfo = () => {
    setstate({
      ...state,
      username: JSON.parse(localStorage.getItem("USERINFO"))?.username,
    });
  };

  return <div>111</div>;
}

export default About;
