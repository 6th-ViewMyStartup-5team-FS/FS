import React from "react";
import styled from "styled-components";
import company from "../assets/images/company/sample.png";
import deleteBtn from "../assets/images/deleteBtn.png";
import { black_300, gray_400, gray_200, gray_100 } from "../styles/colors";

function List({ mediaSize, src = company, companyName, discription }) {
  return (
    <Container $mediaSize={mediaSize}>
      <DeleteButton src={deleteBtn} alt="삭제 버튼" />
      <Img $mediaSize={mediaSize} src={src} alt="Company" />
      <Title $mediaSize={mediaSize}>{companyName}</Title>
      <Discription $mediaSize={mediaSize}>{discription}</Discription>
    </Container>
  );
}

export default List;

const Container = styled.div`
  box-sizing: border-box;
  position: relative; /* 삭제 버튼을 절대 위치로 배치할 수 있도록 설정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${gray_400};
  color: ${gray_100};
  border-radius: 10px;
  width: ${(props) => (props.$mediaSize === "small" ? "104px" : "126px")};
  height: ${(props) => (props.$mediaSize === "small" ? "163px" : "187px")};
`;

const DeleteButton = styled.img`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const Img = styled.img`
  width: ${(props) => (props.$mediaSize === "small" ? "64px" : "80px")};
  height: ${(props) => (props.$mediaSize === "small" ? "64px" : "80px")};
  border-radius: 100%;
`;

const Title = styled.h1`
  font-size: ${(props) => (props.$mediaSize === "small" ? "14px" : "16px")};
  color: white;
  width: auto;
  white-space: nowrap;
  margin: 5px;
`;

const Discription = styled.p`
  font-size: ${(props) => (props.$mediaSize === "small" ? "12px" : "14px")};
  color: ${gray_200};
  margin: 0;
`;
