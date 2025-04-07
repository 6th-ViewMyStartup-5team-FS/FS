import React from "react";
import styled from "styled-components";
import { brand_orange } from "../styles/colors";
import { black_100, black_300 } from "../styles/colors";
import { gray_200 } from "../styles/colors";

{
  /* 아래 props는 type=black/orange/""  mediaSize=big/small*/
}

function BtnLarge({ type, mediaSize, label, onClick, disabled, icon }) {
  return (
    <Container
      $type={type}
      $mediaSize={mediaSize}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <img src={icon} alt="icon" />}
      <Text $mediaSize={mediaSize}>{label}</Text>
    </Container>
  );
}

const Container = styled.button`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;

  border-style: solid;
  border-radius: 50px;
  border-color: ${brand_orange};
  border-width: ${(props) => {
    if (props.$type === "") return "1px";
    return "0px";
  }};

  background-color: ${(props) => {
    if (props.$type === "black") return black_100;
    if (props.$type === "orange") return brand_orange;
    if (props.$type === "") return black_300;
    return "none";
  }};

  color: ${(props) => {
    if (props.$type === "black") return gray_200;
    if (props.$type === "orange") return "#FFFFFF";
    if (props.$type === "") return brand_orange;
    return brand_orange;
  }};

  width: ${(props) => {
    if (props.$type === "" && props.$mediaSize === "big") return "194px";
    if (props.$type === "" && props.$mediaSize === "small") return "135px";
    return props.$mediaSize === "small" ? "135px" : "183px";
  }};
  height: ${(props) => {
    return props.$mediaSize === "small" ? "40px" : "48px";
  }};
`;

const Text = styled.div`
  font-weight: 600;
  font-size: ${(props) => {
    if (props.$mediaSize === "big") return "16px";
    if (props.$mediaSize === "medium") return "16px";
    if (props.$mediaSize === "small") return "14px";
    if (props.$type === "") return "18px";
  }};
`;

export default BtnLarge;
