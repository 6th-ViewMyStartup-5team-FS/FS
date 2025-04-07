import React from "react";
import styled from "styled-components";
import whiteLoadingImg from "../assets/images/btnMedium/whiteLoading.png";
import grayLoadingImg from "../assets/images/btnMedium/grayLoading.png";
import { black_100, brand_orange, gray_200 } from "../styles/colors";

{
  /* 아래 props는 type=black/orange  mediaSize=big/small src=white/gray 추가 */
}
function BtnMedium({ type, mediaSize, src }) {
  const imageSrc =
    src === "white" ? whiteLoadingImg : src === "gray" ? grayLoadingImg : null;
  return (
    <Container $type={type} $mediaSize={mediaSize}>
      <Img src={imageSrc}></Img>
      <Text $mediaSize={mediaSize}>기업 비교하기</Text>
    </Container>
  );
}

const Img = styled.img`
  padding-right: 4px;
`;

const Container = styled.div`
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
    return "none";
  }};

  color: ${(props) => {
    if (props.$type === "black") return gray_200;
    if (props.$type === "orange") return "#FFFFFF";
    return brand_orange;
  }};

  width: ${(props) => {
    if (props.$mediaSize === "big") return "183px";
    if (props.$mediaSize === "small") return "135px";
  }};
  height: ${(props) => {
    if (props.$mediaSize === "big") return "48px";
    if (props.$mediaSize === "small") return "40px";
  }};
`;

const Text = styled.div`
  padding: ${(props) => {
    if (props.$mediaSize === "big") return "13px, 48px, 13px, 48px";
    if (props.$mediaSize === "small") return "13px, 24px, 13px, 24px";
  }};
  font-size: ${(props) => {
    if (props.$mediaSize === "big") return "16px";
    if (props.$mediaSize === "small") return "14px";
  }};
`;

export default BtnMedium;
