import React from "react";
import styled from "styled-components";
import closeIcon from "../../assets/icon/ic_delete.png";
import BtnDelete from "../BtnDelete";
import { black_300, black_400 } from "../../styles/colors";

export default function PopupOneButton({ onClose, mediaSize, type }) {
  const getMessage = () => {
    switch (type) {
      case "error":
        return "잘못된 비밀번호로 삭제에 실패하셨습니다.";
      case "delete-success":
        return "삭제가 완료되었어요!";
      case "success":
        return "투자가 완료되었어요!";
      case "update-success":
        return "투자 내역이 수정되었습니다!";
      default:
        return "팝업 내용이 들어갑니다";
    }
  };

  const onConfirm = () => {
    console.log("닫힘");
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Wrapper $mediaSize={mediaSize} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <img src={closeIcon} alt="닫기" />
        </CloseButton>

        <ContentBox $mediaSize={mediaSize}>
          <Message $mediaSize={mediaSize}>{getMessage()}</Message>

          <ButtonGroup>
            <BtnDelete
              onClick={onConfirm}
              mediaSize={mediaSize}
              type="confirm"
            />
          </ButtonGroup>
        </ContentBox>
      </Wrapper>
    </Overlay>
  );
}

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

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${(props) => (props.$mediaSize === "small" ? "343px" : "496px")};
  height: ${(props) => (props.$mediaSize === "small" ? "161px" : "186px")};
  padding: ${(props) => (props.$mediaSize === "small" ? "16px" : "24px")};
  background-color: ${black_300};
  border-radius: 16px;
  color: #ffff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
  }
`;

const ContentBox = styled.div`
  width: ${(props) => (props.$mediaSize === "small" ? "311px" : "448px")};
  height: ${(props) => (props.$mediaSize === "small" ? "129px" : "138px")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${(props) => (props.$mediaSize === "small" ? "16px" : "24px")};
`;

const Message = styled.div`
  text-align: center;
  font-family: "Pretendard";
  font-weight: 400;
  font-size: ${(props) => (props.$mediaSize === "small" ? "14px" : "15px")};
  line-height: 100%;
  letter-spacing: 0;
  margin-top: 32px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
`;
