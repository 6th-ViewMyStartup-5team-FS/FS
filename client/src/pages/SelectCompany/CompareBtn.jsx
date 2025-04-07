import React from "react";
import styled from "styled-components";

function CompareBtn() {
  return (
    <Container>
      <Text> 다른 기업 비교하기</Text>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  border-style: solid;
  border-radius: 50px;
  border-color: #eb5230;
  border-width: 0px;

  background-color: #eb5230;

  color: #ffffff;

  width: 167px;
  height: 40px;
`;

const Text = styled.div`
  padding: ${(props) => {
    if (props.$mediaSize === "big") return "13px, 48px, 13px, 48px";
    if (props.$mediaSize === "small") return "13px, 24px, 13px, 24px";
  }};
  font-size: 16px;
`;

export default CompareBtn;
