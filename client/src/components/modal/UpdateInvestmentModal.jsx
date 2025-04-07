import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { TextInputField, PasswordInputField } from "../Input";
import BtnLarge from "../BtnLarge";
import { black_300, black_400, gray_200, gray_300 } from "../../styles/colors";
import companyAPI from "../../api/company.api";
import investmentAPI from "../../api/investment.api";

const modalRoot = document.getElementById("modal-root");

const UpdateInvestmentModal = ({
  onClose,
  mediaSize,
  investment,
  onSuccess,
}) => {
  //각 input들의 value를 state로 저장해둠
  const [inputValueName, setInputValueName] = useState(
    investment?.investorName || ""
  );
  const [inputValueAmount, setInputValueAmount] = useState(
    investment?.amount || ""
  );
  const [inputValueComment, setInputValueComment] = useState(
    investment?.comment || ""
  );
  const [inputValuePassword, setInputValuePassword] = useState("");
  const [inputValueCheckPassword, setInputValueCheckPassword] = useState("");

  const [companyInformation, setCompanyInformation] = useState(null);

  const isInvestButtonAvailable =
    inputValueName.trim().length > 0 &&
    inputValueComment.trim().length > 0 &&
    Number(inputValueAmount) &&
    inputValuePassword === inputValueCheckPassword;

  // 기업이 바뀔때마다 데이터 출력
  useEffect(() => {
    const companyData = async () => {
      try {
        const data = await companyAPI.getCompanyById(investment.company.id);
        setCompanyInformation(data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };
    companyData();
  }, [investment.company.id]);

  const handleClickInvestmentButton = async () => {
    try {
      await investmentAPI.updateInvestment(investment.id, {
        investorName: inputValueName,
        amount: Number(inputValueAmount),
        comment: inputValueComment,
        password: inputValuePassword,
      });

      if (onSuccess) onSuccess(); // 성공 후 콜백 호출
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("투자 수정 실패:", error);
      alert("비밀번호가 틀렸거나 수정에 실패했습니다.");
    }
  };

  if (companyInformation === null) return null; //렌더링 안됨

  return ReactDOM.createPortal(
    <Overlay onClick={onClose}>
      <ModalWrapper $mediaSize={mediaSize} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>투자 수정하기</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <Section>
          <SectionTitle>투자 기업 정보</SectionTitle>
          <CompanyInfo>
            <Logo
              src={companyInformation.imageUrl}
              alt={companyInformation.name}
            />
            <CompanyText>
              <CompanyName>{companyInformation.name}</CompanyName>
              <CompanyCategory>{companyInformation.category}</CompanyCategory>
            </CompanyText>
          </CompanyInfo>
        </Section>

        <Section>
          <FieldGroup>
            <FieldLabel>투자자 이름</FieldLabel>
            <TextInputField
              mediaSize={mediaSize}
              placeholder="투자자 이름을 입력해 주세요"
              value={inputValueName}
              onChange={(e) => setInputValueName(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>투자 금액</FieldLabel>
            <TextInputField
              mediaSize={mediaSize}
              placeholder="투자 금액을 입력해 주세요"
              value={inputValueAmount}
              onChange={(e) => setInputValueAmount(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>투자 코멘트</FieldLabel>
            <TextInputField
              mediaSize={mediaSize}
              state="normal"
              placeholder="투자에 대한 코멘트를 입력해 주세요"
              value={inputValueComment}
              onChange={(e) => setInputValueComment(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>비밀번호</FieldLabel>
            <PasswordInputField
              mediaSize={mediaSize}
              placeholder="비밀번호를 입력해주세요"
              value={inputValuePassword}
              onChange={(e) => setInputValuePassword(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>비밀번호 확인</FieldLabel>
            <PasswordInputField
              mediaSize={mediaSize}
              placeholder="비밀번호를 다시 한 번 입력해주세요"
              value={inputValueCheckPassword}
              onChange={(e) => setInputValueCheckPassword(e.target.value)}
            />
          </FieldGroup>
        </Section>

        <ButtonRow>
          <BtnLarge
            type=""
            mediaSize={mediaSize}
            label="취소"
            onClick={onClose}
          />
          <BtnLarge
            type="orange"
            mediaSize={mediaSize}
            label="수정하기"
            onClick={handleClickInvestmentButton}
            disabled={!isInvestButtonAvailable}
          />
        </ButtonRow>
      </ModalWrapper>
    </Overlay>,
    modalRoot
  );
};

export default UpdateInvestmentModal;

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

const ModalWrapper = styled.div`
  box-sizing: border-box;
  background: ${black_300};
  padding: 24px;
  border-radius: 16px;
  width: ${(props) => (props.$mediaSize === "small" ? "343px" : "496px")};
  height: auto;
  z-index: 999;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #fff;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #fff;
  cursor: pointer;
`;

const Section = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  color: #ccc;
  margin: 0 0 6px 0;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldLabel = styled.h3`
  font-size: 18px;
  color: #ccc;
  margin: 0 0 6px 0;
`;

const CompanyInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const CompanyText = styled.div`
  display: flex;
  flex-direction: column;
`;

const CompanyName = styled.span`
  font-weight: bold;
  color: #fff;
`;

const CompanyCategory = styled.span`
  font-size: 12px;
  color: #aaa;
`;

const TextArea = styled.textarea`
  width: 90%;
  background-color: ${gray_300};
  color: #fff;
  border: 2px solid ${gray_300};
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  resize: none;
  outline: none;

  &::placeholder {
    color: ${gray_200};
  }

  &:focus {
    border-color: #3692ff;
  }
`;

const ButtonRow = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 100%;
`;
