import React from "react";

import styles from "../../styles/App.module.css";
import logo from "../../image/logo.png";

export default function SiderLogo() {
  return (
    <div className={styles.siderLogoContent}>
      <img src={logo} className={styles.siderLogo} alt="" />
      React-Admin
    </div>
  );
}
