import React from "react";
import styled from "styled-components";
import { brand_orange } from "../styles/colors";

// type prop: "delete" (default), "confirm"
export default function BtnDelete({ onClick, mediaSize, type, style }) {
  console.log("Button mediaSize:", mediaSize); // 전달되는 값 확인
  let buttonText = "삭제하기"; // 기본값

  if (type === "confirm") buttonText = "확인";
  else if (type === "update") buttonText = "수정하기";

  return (
    <ButtonWrapper onClick={onClick} $mediaSize={mediaSize} style={style}>
      <ButtonText>{buttonText}</ButtonText>
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.button`
  box-sizing: border-box;
  width: ${(props) => (props.$mediaSize === "small" ? "135px" : "194px")};
  height: ${(props) => (props.$mediaSize === "small" ? "44px" : "48px")};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${brand_orange};
  border: none;
  border-radius: 50px;
  cursor: pointer;
`;

const ButtonText = styled.span`
  color: white;
  font-size: 14px;
`;
