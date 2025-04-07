import React from "react";
import styled from "styled-components";
import InputField from "../components/InputField";
import BtnLarge from "../components/BtnLarge";
import { gray_200 } from "../styles/colors";
import minusIcon from "../assets/icon/ic_minus.svg";

const CompareListSection = ({
  companies = [],
  onAddClick,
  onDelete,
  isActive,
}) => {
  const mediaSize =
    typeof window !== "undefined"
      ? window.innerWidth >= 1200
        ? "big"
        : window.innerWidth > 744
        ? "medium"
        : "small"
      : "big";

  const renderSelectedCompanies = () => {
    if (!companies) return null;
    return (
      <InputField variant="default" mediaSize={mediaSize}>
        {companies.length === 0 ? (
          <EmptyContainer>
            <EmptyText>
              아직 추가한 기업이 없어요. <br />
              버튼을 눌러 기업을 추가해보세요!
            </EmptyText>
          </EmptyContainer>
        ) : (
          <CardGrid>
            {companies.map((company) => (
              <CompanyCard key={company.id} $mediaSize={mediaSize}>
                <DeleteButton onClick={() => onDelete(company.id)}>
                  <img src={minusIcon} alt="삭제" />
                </DeleteButton>
                <Logo
                  src={company.imageUrl || ""}
                  alt={`${company.name} 로고`}
                  $mediaSize={mediaSize}
                />
                <CompanyName>{company.name}</CompanyName>
                <CompanyCategory>{company.category}</CompanyCategory>
              </CompanyCard>
            ))}
          </CardGrid>
        )}
      </InputField>
    );
  };

  return (
    <Wrapper $mediaSize={mediaSize}>
      {isActive && (
        <Header $mediaSize={mediaSize}>
          <Title $mediaSize={mediaSize}>
            어떤 기업이 궁금하세요? {companies.length > 0 && " (최대 5개)"}
          </Title>
          <BtnLarge
            label="기업 추가하기"
            type={companies.length >= 5 ? "black" : "orange"}
            mediaSize="small"
            onClick={() => {
              if (companies.length >= 5) return;
              onAddClick();
            }}
          />
        </Header>
      )}

      <CardContainer>{renderSelectedCompanies()}</CardContainer>
    </Wrapper>
  );
};

export default CompareListSection;

const Wrapper = styled.section`
  box-sizing: border-box;
  color: white;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: ${({ $mediaSize }) => ($mediaSize === "small" ? "16px" : "20px")};
`;

const CardContainer = styled.div`
  min-height: 150px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EmptyContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyText = styled.p`
  color: ${gray_200};
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
`;

const CardGrid = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  justify-content: ${({ $mediaSize }) =>
    $mediaSize === "small" ? "flex-start" : "center"};
  align-content: center;
`;

const CompanyCard = styled.div`
  position: relative;
  width: ${({ $mediaSize }) => ($mediaSize === "small" ? "104px" : "126px")};
  height: ${({ $mediaSize }) => ($mediaSize === "small" ? "163px" : "187px")};
  background: #2c2c2c;
  border-radius: 8px;
  text-align: center;
`;

const DeleteButton = styled.button`
  position: absolute;
  margin: 8px;
  top: 6px;
  right: 6px;
  background: none;
  border: none;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
  }
`;

const Logo = styled.img`
  width: ${({ $mediaSize }) => ($mediaSize === "small" ? "65px" : "80px")};
  height: ${({ $mediaSize }) => ($mediaSize === "small" ? "65px" : "80px")};
  object-fit: cover;
  border-radius: 50%;
  margin-top: 32px;
  margin-bottom: 10px;
`;

const CompanyName = styled.div`
  font-size: 16px;
  margin-bottom: 4px;
  font-weight: bold;
`;

const CompanyCategory = styled.div`
  font-size: 14px;
  color: ${gray_200};
`;
