import React from "react";
import styled from "styled-components";
import BtnOutline from "./BtnOutline";
import { gray_200, gray_100 } from "../styles/colors";

function List({ mediaSize, src, companyName, discription }) {
  return (
    <Container $mediaSize={mediaSize}>
      <Img $mediaSize={mediaSize} src={src} alt="Company" />

      <Title $mediaSize={mediaSize}>{companyName}</Title>
      <Discription $mediaSize={mediaSize}>{discription}</Discription>
      <BtnOutline
        text={"choice"}
        type={"orange"}
        mediaSize={mediaSize}
        src={""}
      />
    </Container>
  );
}

export default List;

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  color: ${gray_100};
  // border: 1px solid ${gray_200};
  padding: 5px;
  width: ${(props) => (props.$mediaSize === "small" ? "311px" : "448px")};
  height: ${(props) => (props.$mediaSize === "small" ? "40px" : "48px")};
`;

const Img = styled.img`
  width: ${(props) => (props.$mediaSize === "small" ? "40px" : "48px")};
  height: ${(props) => (props.$mediaSize === "small" ? "40px" : "48px")};
  border-radius: 100%;
`;

const Title = styled.h1`
  font-size: ${(props) => (props.$mediaSize === "small" ? "14px" : "16px")};
  color: white;
  width: auto;
  padding: 0 10px;
  white-space: nowrap;
`;

const Discription = styled.p`
  width: 100%;
  font-size: ${(props) => (props.$mediaSize === "small" ? "12px" : "14px")};
  color: ${gray_200};
`;
