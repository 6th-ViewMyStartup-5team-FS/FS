import React, { useState } from "react";
import styled from "styled-components";
import eyeVisibleImg from "../assets/images/passwordEye/eye-visible.svg";
import eyeInvisibleImg from "../assets/images/passwordEye/eye-invisible.svg";
import { brand_orange, gray_200 } from "../styles/colors";

// 유저 이름 입력칸
export function TextInputField({
  mediaSize,
  state,
  placeholder,
  value,
  onChange,
}) {
  const [isTouched, setIsTouched] = useState(false);

  const handleBlur = () => {
    if (value === "") {
      setIsTouched(true);
    }
  };

  const showError = state !== "normal" && isTouched && value === "";

  return (
    <Container $mediaSize={mediaSize} $error={showError} $state={state}>
      {state === "normal" ? (
        <StyledTextarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsTouched(false)}
          onBlur={handleBlur}
        />
      ) : (
        <StyledInput
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsTouched(false)}
          onBlur={handleBlur}
        />
      )}
      <ErrorMessage $visible={showError}>*필수 입력사항입니다.</ErrorMessage>
    </Container>
  );
}

// 비밀번호 입력칸
export function PasswordInputField({
  mediaSize,
  placeholder,
  value,
  onChange,
}) {
  const [isTouched, setIsTouched] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const showError = isTouched && value === "";

  return (
    <Container $mediaSize={mediaSize} $error={showError}>
      <StyledInput
        type={isPasswordVisible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsTouched(true)}
      />
      <Icon
        src={isPasswordVisible ? eyeVisibleImg : eyeInvisibleImg}
        alt="Toggle Password Visibility"
        onClick={() => setIsPasswordVisible((prev) => !prev)}
      />
      <ErrorMessage $visible={showError}>*필수 입력사항입니다.</ErrorMessage>
    </Container>
  );
}

// 공통 스타일
const Container = styled.div`
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  width: ${(props) => (props.$mediaSize === "small" ? "311px" : "448px")};
  border-radius: 8px;
  border: ${(props) =>
    props.$state === "normal"
      ? "2px solid #444"
      : props.$error
      ? "2px solid #EB5230"
      : "2px solid #444"};
  padding: ${(props) => (props.$mediaSize === "big" ? "14px" : "10px")};
  margin-bottom: ${(props) => (props.$error ? "20px" : "10px")};
`;

const StyledInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  outline: none;

  &::placeholder {
    font-size: 14px;
    font-family: "Pretendard";
    color: ${gray_200};
  }
`;

const StyledTextarea = styled.textarea`
  flex: 1;
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  outline: none;
  resize: none;
  height: 108px; /* 적절한 높이 설정 */

  &::placeholder {
    font-size: 14px;
    font-family: "Pretendard";
    color: ${gray_200};
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-right: 10px;
`;

const ErrorMessage = styled.p`
  position: absolute;
  bottom: -33px;
  left: 5px;
  font-size: 13px;
  color: ${brand_orange};
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  ${(props) => props.$state === "normal" && "display: none;"}
`;
