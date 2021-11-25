import React from "react";

export default function Page2() {
  return (
    <div>
      {[...Array(1000)].map((item, index) => {
        return <p key={index}>哈哈哈哈哈{index}</p>;
      })}
    </div>
  );
}
