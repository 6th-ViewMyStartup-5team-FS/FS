import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { black_300 } from "../styles/colors";

function InputField({ variant = "default", children, mediaSize = "big" }) {
  console.log("🔥 [InputField] mediaSize:", mediaSize);

  return (
    <Outer $variant={variant} $mediaSize={mediaSize}>
      <Inner $mediaSize={mediaSize} $variant={variant}>
        {children}
      </Inner>
    </Outer>
  );
}

export default InputField;

const Outer = styled.div`
  width: 100%;

  min-height: ${({ $mediaSize }) =>
    $mediaSize === "big"
      ? "300px"
      : $mediaSize === "medium"
      ? "239px"
      : "179px"};

  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  background-color: ${({ $variant }) =>
    $variant === "dashed" ? "transparent" : black_300};

  border: ${({ $variant }) =>
    $variant === "dashed" ? `1px dashed ${black_300}` : "none"};
`;

const Inner = styled.div`
  width: 100%;
  max-width: ${({ $mediaSize }) =>
    $mediaSize === "big"
      ? "1168px"
      : $mediaSize === "medium"
      ? "664px"
      : "311px"};

  min-height: ${({ $mediaSize }) =>
    $mediaSize === "big"
      ? "268px"
      : $mediaSize === "medium"
      ? "207px"
      : "147px"};

  background-color: ${black_300};
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  padding: ${({ $mediaSize }) =>
    $mediaSize === "big" ? "45px" : $mediaSize === "medium" ? "32px" : "20px"};
`;
