import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import closeIcon from "../../assets/icon/ic_delete.png";
import { PasswordInputField } from "../Input";
import BtnDelete from "../BtnDelete";
import { black_300, black_400 } from "../../styles/colors";

export default function ModalPassword({
  onClose,
  onDelete,
  mediaSize,
  isUpdateMode,
}) {
  console.log("ModalPassword - mediaSize:", mediaSize);
  const [password, setPassword] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const handleSubmit = () => {
    if (password.trim() === "") {
      setIsTouched(true);
      return;
    }
    onDelete(password);
  };

  // 모달 열릴 때 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Overlay onClick={onClose}>
      <Wrapper
        $mediaSize={mediaSize}
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫힘 방지
      >
        <Header>
          <Title>{isUpdateMode ? "수정 권한 인증" : "삭제 권한 인증"}</Title>
          <CloseBtn onClick={onClose}>
            <img src={closeIcon} alt="닫기" />
          </CloseBtn>
        </Header>

        <Label>비밀번호</Label>

        <PasswordInputField
          mediaSize={mediaSize}
          placeholder="패스워드를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onTouched={isTouched}
        />

        <BtnDeleteWrapper>
          <BtnDelete
            onClick={handleSubmit}
            mediaSize={mediaSize}
            type={isUpdateMode ? "update" : "delete"}
          />
        </BtnDeleteWrapper>
      </Wrapper>
    </Overlay>
  );
}

// 모달 배경 (어두운 오버레이)
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${black_400}80;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 모달 박스
const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${(props) => (props.$mediaSize === "small" ? "343px" : "496px")};
  height: ${(props) => (props.$mediaSize === "small" ? "235px" : "269px")};

  background-color: ${black_300};
  border-radius: 16px;
  padding: ${(props) => (props.$mediaSize === "small" ? "16px" : "24px")};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: white;
  z-index: 1000;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: bold;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
    display: block;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-top: 4px;
  align-self: flex-start;
`;

const BtnDeleteWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
