import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Search from "../Search";
import closeIcon from "../../assets/icon/ic_delete.png";
import BtnPagination from "../BtnPagination";
import BtnOutline from "../BtnOutline";
import {
  black_300,
  black_400,
  brand_orange,
  gray_200,
} from "../../styles/colors";
import Hangul from "hangul-js";
import { client } from "../../api/index.api";

function SelectComparison({
  isOpen,
  onClose,
  mediaSize,
  selectedCompanies,
  setSelectedCompanies,
  selectedCompany,
}) {
  const [companies, setCompanies] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchTokens, setSearchTokens] = useState({
    raw: "",
    disassembled: "",
    cho: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [buttonSize, setButtonSize] = useState("big");
  const [searchSize, setSearchSize] = useState("big");
  const itemsPerPage = 5;
  const [recentCompanies, setRecentCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSearching = keyword.trim() !== "";

  const modalHeight =
    isSearching || selectedCompanies.length > 0
      ? "858px"
      : mediaSize === "small"
      ? "112px"
      : "152px";

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await client.get("/api/companies");
        setCompanies(res.data);
      } catch (e) {
        console.error("기업 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setKeyword("");
      setSearchTokens({ raw: "", disassembled: "", cho: "" });
      setCurrentPage(1);
    }
  }, [isOpen]);

  const handleSelect = (company) => {
    if (selectedCompanies.length >= 5) {
      alert("비교할 기업은 최대 5개까지 선택 가능합니다.");
      return;
    }

    if (selectedCompanies.some((c) => c.id === company.id)) return;

    setSelectedCompanies((prev) => [...prev, company]);

    setRecentCompanies((prev) => {
      const existing = prev.findIndex((c) => c.id === company.id);
      if (existing !== -1) {
        const updatedRecent = [
          company,
          ...prev.slice(0, existing),
          ...prev.slice(existing + 1),
        ];
        return updatedRecent.slice(0, 5);
      }
      return [company, ...prev].slice(0, 5);
    });
  };

  const handleRemove = (id) => {
    setSelectedCompanies((prev) => prev.filter((company) => company.id !== id));
  };

  const filteredCompanies = useMemo(() => {
    const input = searchTokens.raw;
    if (!input || companies.length === 0) return [];

    return companies.filter((company) => {
      const name = company.name.toLowerCase();
      if (selectedCompany && selectedCompany.id === company.id) return false;

      if (Hangul.isConsonant(input[0])) {
        const firstChar = name[0];
        const firstCho = Hangul.disassemble(firstChar)[0];
        return firstCho === input[0];
      } else {
        return name.startsWith(input);
      }
    });
  }, [searchTokens, companies, selectedCompany]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalWrapper
        $mediaSize={mediaSize}
        $height={modalHeight}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <div>비교할 기업 선택하기</div>
          <img onClick={onClose} src={closeIcon} alt="닫기" />
        </ModalHeader>

        <Search
          mediaSize={searchSize}
          state="searching"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => {
            setKeyword("");
            setSearchTokens({ raw: "", disassembled: "", cho: "" });
          }}
          onSearch={(tokens) => {
            setSearchTokens(tokens);
            setCurrentPage(1);
          }}
        />

        {selectedCompanies.length > 0 && (
          <>
            <SectionTitle>
              선택한 기업 ({selectedCompanies.length})
            </SectionTitle>
            {selectedCompanies.map((company) => (
              <CompanyCard key={company.id}>
                <CompanyInfo>
                  {company.imageUrl ? (
                    <Logo src={company.imageUrl} alt={`${company.name} 로고`} />
                  ) : (
                    <LogoPlaceholder />
                  )}
                  <CompanyText>
                    <div>{company.name}</div>
                    <div>{company.category}</div>
                  </CompanyText>
                </CompanyInfo>
                <BtnOutline
                  text="cancel"
                  type="black"
                  mediaSize={buttonSize}
                  onClick={() => handleRemove(company.id)}
                />
              </CompanyCard>
            ))}
          </>
        )}

        {isSearching && (
          <>
            <SectionTitle> 검색 결과 ({filteredCompanies.length})</SectionTitle>
            {currentCompanies.map((company) => {
              const isSelected = selectedCompanies.some(
                (c) => c.id === company.id
              );

              return (
                <CompanyCard key={company.id}>
                  <CompanyInfo>
                    {company.imageUrl ? (
                      <Logo
                        src={company.imageUrl}
                        alt={`${company.name} 로고`}
                      />
                    ) : (
                      <LogoPlaceholder />
                    )}
                    <CompanyText>
                      <div>{company.name}</div>
                      <div>{company.category}</div>
                    </CompanyText>
                  </CompanyInfo>
                  {isSelected ? (
                    <BtnOutline
                      text="complete"
                      type="black"
                      mediaSize={buttonSize}
                      src="existSmall"
                    />
                  ) : (
                    <BtnOutline
                      text="choice"
                      type="orange"
                      mediaSize={buttonSize}
                      onClick={() => handleSelect(company)}
                    />
                  )}
                </CompanyCard>
              );
            })}

            <PaginationWrapper>
              <BtnPagination
                mediaSize={buttonSize}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredCompanies.length}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </PaginationWrapper>

            {selectedCompanies.length >= 5 && (
              <Warning>*비교할 기업은 최대 5개까지 선택 가능합니다.</Warning>
            )}
          </>
        )}
      </ModalWrapper>
    </Overlay>
  );
}

export default SelectComparison;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${black_400}80;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 998;
`;

const ModalWrapper = styled.div`
  background: ${black_300};
  font-size: 20px;
  padding: 24px;
  border-radius: 16px;
  width: ${(props) => (props.$mediaSize === "small" ? "343px" : "496px")};
  max-height: 90vh;
  overflow-y: auto;
  height: fit-content;
  z-index: 999;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  img {
    cursor: pointer;
  }
`;

const SectionTitle = styled.div`
  font-size: 16px;
  margin: 16px 0 8px;
`;

const CompanyCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
`;

const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const LogoPlaceholder = styled.div`
  width: 36px;
  height: 36px;
  background-color: #888;
  border-radius: 50%;
`;

const CompanyText = styled.div`
  margin-left: 16px;
  display: flex;
  flex-direction: row;
  align-items: baseline;

  div:first-child {
    font-size: 16px;
    font-weight: bold;
  }

  div:last-child {
    font-size: 14px;
    margin: 8px;
    color: ${gray_200};
  }
`;

const PaginationWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
`;

const Warning = styled.p`
  color: ${brand_orange};
  font-size: 13px;
  text-align: right;
  margin-top: 12px;
`;
