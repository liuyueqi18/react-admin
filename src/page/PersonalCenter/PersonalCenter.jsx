import React, { useEffect, useState } from "react";
import { getUserInfoById } from "../../service/utils";

function About() {
  const [state, setstate] = useState({
    username: "",
    email: "",
    emailVerified: true,
    birthTime: "",
    genderCode: null,
  });
  useEffect(() => {
    getUserInfo();
  }, []);
  const getUserInfo = () => {
    getUserInfoById(localStorage.getItem("RYMUSERID")).then((res) => {
      console.log("res :>> ", res.attributes);
      setstate({
        ...state,
        username: res.attributes.username,
        email: res.attributes.email,
        emailVerified: res.attributes.emailVerified,
        birthTime: res.attributes.birthTime,
        genderCode: res.attributes.gender,
      });
    });
  };

  return <div>个人中心</div>;
}

export default About;
