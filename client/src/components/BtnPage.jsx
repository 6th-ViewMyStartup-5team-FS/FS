import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { black_100, brand_orange } from "../styles/colors";

// 아래 props는 text=1/2/3/4/5 mediaSize=big/small isActive=true/false
function BtnPage({ text, mediaSize, isActive }) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsClicked(true);

    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  };

  useEffect(() => {
    setIsClicked(false);
    console.log("BtnPage mediaSize:", mediaSize);

  }, []);

  return (
    <Button
      $mediaSize={mediaSize}
      $isClicked={isClicked}
      $isActive={isActive}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
}

const Button = styled.div`
  background-color: ${({ $isActive, $isClicked }) =>
    $isActive || $isClicked ? brand_orange : black_100};

  color: ${({ $isActive, $isClicked }) =>
    $isActive || $isClicked ? "#FFFFFF" : "#747474"};

  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: ${({ $mediaSize }) => ($mediaSize === "small" ? "16px" : "18px")};
  width: ${({ $mediaSize }) => ($mediaSize === "small" ? "32px" : "48px")};
  height: ${({ $mediaSize }) => ($mediaSize === "small" ? "32px" : "48px")};

  transition: background-color 0.2s, color 0.2s;
`;

export default BtnPage;
