import React from "react";
import { queryRegion } from "../../service/utils";

export default function Home() {
  queryRegion().then((res1) => {
    console.log("res1 :>> ", res1);
    queryRegion("140000").then((res2) => {
      console.log("res2 :>> ", res2);
      queryRegion("140200").then((res3) => {
        console.log("res3 :>> ", res3);
      });
    });
  });
  return (
    <div>
      <p>这是基于React17构建的后台管理系统</p>
      <p>适合于新手上手</p>
    </div>
  );
}
