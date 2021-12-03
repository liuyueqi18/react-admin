import React from "react";
import style from "../../styles/NotFound.module.css";
import NotFoundImage from "../../image/404.png";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  function goHome() {
    navigate("/home");
  }

  return (
    <div className={style.content}>
      <img className={style.image} src={NotFoundImage} alt="" />
      <Button size="large" onClick={goHome} type="primary">
        回到首页
      </Button>
    </div>
  );
}
