import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Search from "../Search";
import closeIcon from "../../assets/icon/ic_delete.png";
import {
  black_300,
  black_400,
  brand_orange,
  gray_200,
} from "../../styles/colors";
import { client } from "../../api/index.api";
import Hangul from "hangul-js";
import {
  getRecentMyCompanies,
  setRecentMyCompanies,
} from "../../pages/SelectCompany/localStorage";

function SelectMyEnterprise({
  isOpen,
  onClose,
  mediaSize,
  onSelect,
  excludeCompanies,
}) {
  const [keyword, setKeyword] = useState("");
  const [searchTokens, setSearchTokens] = useState({
    raw: "",
    disassembled: "",
    cho: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const [companies, setCompanies] = useState([]);
  const [recentCompanies, setRecentCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await client.get("/api/companies");
        setCompanies(res.data);
      } catch (e) {
        console.error("기업 불러오기 실패:", e);
      }
    };
    if (isOpen) {
      fetchCompanies();
      const storedRecent = getRecentMyCompanies();
      setRecentCompanies(storedRecent);
    }
  }, [isOpen]);

  useEffect(() => {
    if (recentCompanies.length > 0) {
      setRecentMyCompanies(recentCompanies);
    }
  }, [recentCompanies]);

  const filteredCompanies = useMemo(() => {
    const input = searchTokens.raw.toLowerCase();
    if (!input || companies.length === 0) return [];

    return companies.filter((company) => {
      if (excludeCompanies.some((ex) => ex.id === company.id)) return false;

      const name = company.name.toLowerCase();
      if (Hangul.isConsonant(input[0])) {
        const firstChar = name[0];
        const firstCho = Hangul.disassemble(firstChar)[0];
        return firstCho === input[0];
      }
      return name.includes(input);
    });
  }, [searchTokens, companies, excludeCompanies]);

  const totalPages = Math.ceil(filteredCompanies.length / perPage);
  const currentPageData = filteredCompanies.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleCompanySelect = (company) => {
    if (onSelect) {
      onSelect(company);
    }
    setRecentCompanies((prev) => {
      const filtered = prev.filter((c) => c.id !== company.id);
      return [company, ...filtered].slice(0, 5);
    });
  };

  if (!isOpen) return null;

  console.log(mediaSize);

  return (
    <Overlay onClick={onClose}>
      <Container $mediaSize={mediaSize} onClick={(e) => e.stopPropagation()}>
        <Title>
          <div>나의 기업 선택하기</div>
          <img onClick={onClose} src={closeIcon} alt="닫기" />
        </Title>
        <Search
          mediaSize={mediaSize}
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

        {/* 최근 선택된 기업 */}
        {recentCompanies.length > 0 && (
          <>
            <SectionTitle>
              최근 선택된 기업 ({recentCompanies.length})
            </SectionTitle>
            <CompanyList>
              {recentCompanies.map((company) => (
                <CompanyItem key={company.id}>
                  <CompanyCell>
                    <Logo
                      src={company.imageUrl || "/default-image.png"}
                      alt={`${company.name} 로고`}
                    />
                    <Info>
                      <div className="name">{company.name}</div>
                      <div className="tagline">{company.category}</div>
                    </Info>
                  </CompanyCell>
                  <SelectBtn onClick={() => handleCompanySelect(company)}>
                    선택하기
                  </SelectBtn>
                </CompanyItem>
              ))}
            </CompanyList>
          </>
        )}

        {/* 검색 결과 */}
        {keyword.trim() !== "" && (
          <>
            <SectionTitle>검색 결과 ({filteredCompanies.length})</SectionTitle>
            <CompanyList>
              {currentPageData
                .filter(
                  (company) =>
                    !excludeCompanies.some(
                      (excluded) => excluded.id === company.id
                    )
                )
                .map((c) => (
                  <CompanyItem key={c.id}>
                    <CompanyCell>
                      <Logo
                        src={c.imageUrl || "/default-image.png"}
                        alt={`${c.name} 로고`}
                      />
                      <Info>
                        <div className="name">{c.name}</div>
                        <div className="tagline">{c.category}</div>
                      </Info>
                    </CompanyCell>
                    <SelectBtn onClick={() => handleCompanySelect(c)}>
                      선택하기
                    </SelectBtn>
                  </CompanyItem>
                ))}
            </CompanyList>
            <Pagination>
              {[...Array(totalPages)].map((_, i) => (
                <PageBtn
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  $active={currentPage === i + 1}
                >
                  {i + 1}
                </PageBtn>
              ))}
            </Pagination>
          </>
        )}
      </Container>
    </Overlay>
  );
}

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
  z-index: 999;
  padding: 0 12px;
`;

const Container = styled.div`
  background-color: ${black_300};
  border-radius: 16px;
  padding: 24px;
  color: #ffffff;
  font-size: 20px;

  width: ${(props) =>
    props.$mediaSize === "big"
      ? "496px"
      : props.$mediaSize === "medium"
      ? "496px"
      : "343px"};

  box-sizing: border-box;

  margin: 0 auto;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  img {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;

const SectionTitle = styled.div`
  font-size: 14px;
  color: #aaa;
  margin: 20px 0 12px;
`;

const CompanyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const CompanyItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${black_300};
  padding: 10px 12px;
  border-radius: 8px;

  .name {
    font-size: 14px;
    font-weight: bold;
  }

  .tagline {
    font-size: 12px;
    color: ${gray_200};
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const SelectBtn = styled.button`
  background-color: transparent;
  border: 1px solid ${brand_orange};
  color: ${brand_orange};
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
`;

const PageBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background-color: ${(props) => (props.$active ? brand_orange : black_400)};
  color: ${(props) => (props.$active ? "white" : "#aaa")};
  border: none;
  cursor: pointer;
  font-size: 14px;
`;

const CompanyCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

export default SelectMyEnterprise;
