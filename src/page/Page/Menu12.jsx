import React, { useEffect, useState } from "react";

export default function Menu12() {
  const [state, setstate] = useState({
    name: "",
  });
  useEffect(() => {
    setTimeout(() => {
      setstate({
        name: "/menu/menu1/menu1-2",
      });
    }, 500);
    return () => {
      setstate(false);
    };
  }, []);
  return <div>{state.name}</div>;
}
