import React from "react";
import styled from "styled-components";
import { black_400, gray_200 } from "../styles/colors";

//  아래 props는 color=white/gray  mediaSize=big/small
function Tab({ color, mediaSize }) {
  return (
    <Text $color={color} $mediaSize={mediaSize}>
      나의 기업 비교
    </Text>
  );
}

const Text = styled.div`
  background-color: ${black_400};
  font-mediasize: ${(props) => {
    if (props.$mediaSize === "big") return "15px";
    if (props.$mediaSize === "small") return "12px";
  }};
  color: ${(props) => {
    if (props.$color === "white") return "#FFFFFF";
    if (props.$color === "gray") return `${gray_200}`;
  }};

  width: ${(props) => {
    if (props.$mediaSize === "big") return "119px";
    if (props.$mediaSize === "small") return "84px";
  }};

  height: ${(props) => {
    if (props.$mediaSize === "big") return "60px";
    if (props.$mediaSize === "small") return "56px";
  }};
`;

export default Tab;
