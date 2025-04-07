import React, { useState } from "react";
import styled from "styled-components";
import Hangul from "hangul-js";
import searchImg from "../assets/images/search/lenz.png";
import xImg from "../assets/images/search/x.png";
import { black_300, gray_200, gray_100 } from "../styles/colors";

function Search({
  mediaSize,
  state = "none",
  value,
  onChange,
  onClear,
  onSearch,
}) {
  const [placeholder, setPlaceholder] = useState(
    state === "searching"
      ? "기업 검색하기"
      : mediaSize === "small"
      ? "검색"
      : "검색어를 입력해주세요"
  );

  const handleFocus = () => {
    if (state === "searching") setPlaceholder("");
  };

  const handleBlur = () => {
    if (state === "searching") setPlaceholder("기업 검색하기");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      const processed = value.trim().toLowerCase();
      onSearch({
        raw: processed,
        disassembled: Hangul.disassemble(processed).join(""),
        cho: Hangul.assemble(
          Hangul.disassemble(processed).map((char) =>
            Hangul.isConsonant(char) ? char : ""
          )
        ),
      });
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (onChange) onChange(e);
    if (onSearch) {
      const processed = newValue.trim().toLowerCase();
      onSearch({
        raw: processed,
        disassembled: Hangul.disassemble(processed).join(""),
        cho: Hangul.assemble(
          Hangul.disassemble(processed).map((char) =>
            Hangul.isConsonant(char) ? char : ""
          )
        ),
      });
    }
  };

  const handleClear = () => {
    if (onClear) onClear();
    if (onSearch) onSearch({ raw: "", disassembled: "", cho: "" });
  };

  return (
    <Container $mediaSize={mediaSize}>
      {state === "searching" ? (
        <>
          <Input
            $mediaSize={mediaSize}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
          {value && <Img src={xImg} alt="Clear" onClick={handleClear} />}
          <Img src={searchImg} alt="Search" />
        </>
      ) : (
        <>
          <Img src={searchImg} alt="Search" />
          <Input
            $mediaSize={mediaSize}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
          />
        </>
      )}
    </Container>
  );
}

export default Search;

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  color: ${gray_100};
  background-color: ${black_300};
  border: 1px solid ${gray_200};
  border-radius: 10px;
  padding: 5px;

  min-width: ${(props) =>
    props.$mediaSize === "big"
      ? "448px"
      : props.$mediaSize === "medium"
      ? "269px"
      : props.$mediaSize === "small"
      ? "189px"
      : null};
  height: ${(props) =>
    props.$mediaSize === "big"
      ? "48px"
      : props.$mediaSize === "medium"
      ? "48px"
      : props.$mediaSize === "small"
      ? "40px"
      : null};
`;

const Img = styled.img`
  padding: 0 8px;
  width: 15px;
  height: 15px;
`;

const Input = styled.input`
  border: none;
  outline: none;
  width: ${(props) => {
    if (props.$mediaSize === "short") return "311px";
    return "100%";
  }};
  background-color: ${black_300};
  color: ${gray_100};
  padding: 5px;

  &::placeholder {
    color: ${gray_100};
    font-family: "Pretendard";
    font-weight: 300;
    font-size: ${(props) =>
      props.$mediaSize === "big"
        ? "14px"
        : props.$mediaSize === "medium"
        ? "13px"
        : props.$mediaSize === "small"
        ? "13px"
        : "13px"};
  }
`;
