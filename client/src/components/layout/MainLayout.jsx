import React, { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import Nav from "./Nav";

function MainLayout() {
  const [mediaSize, setMediaSize] = useState("");

  function updateMediaSize() {
    const { innerWidth: width } = window;
    if (width >= 1200) {
      setMediaSize("big");
    } else if (width > 376) {
      setMediaSize("medium");
    } else {
      setMediaSize("small");
    }
  }

  useEffect(() => {
    updateMediaSize();

    window.addEventListener("resize", updateMediaSize);

    return () => {
      window.removeEventListener("resize", updateMediaSize);
    };
  }, []);

  return (
    <>
      <Nav mediaSize={mediaSize} />
      <Outlet />
    </>
  );
}

export default MainLayout;
