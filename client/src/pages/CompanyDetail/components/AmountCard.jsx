import React from "react";
import styled from "styled-components";
import { black_200, gray_100 } from "../../../styles/colors";
import { media } from "../../../styles/mixin";

function AmountCard({ char, type, number, mediaSize }) {
  const unit = type === "price" ? "억 원" : type === "people" ? "명" : "";

  return (
    <Container $mediaSize={mediaSize}>
      <Char>{char}</Char>
      <Number>
        {number}
        {unit}
      </Number>
    </Container>
  );
}

export default AmountCard;

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${gray_100};
  background-color: ${black_200};
  width: ${({ $mediaSize }) =>
    $mediaSize === "big"
      ? "384px"
      : $mediaSize === "medium"
      ? "30%"
      : $mediaSize === "small"
      ? "103px"
      : null};
  height: 92px;
  padding: 0 20px;
  border-radius: 10px;
  font-size: 16px;
  ${media.mobile`
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0px;
  `}
`;

const Char = styled.span`
  font-weight: 300;
  ${media.mobile`
    font-size: 14px;
  `}
  word-break: keep-all;
`;

const Number = styled.span`
  font-weight: 500;
  ${media.mobile`
    font-size: 14px;
  `}
`;
