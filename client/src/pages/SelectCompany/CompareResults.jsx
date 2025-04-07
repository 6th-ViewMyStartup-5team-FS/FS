import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import styles from "./CompareResult.module.css";
import SortDropdown from "../../components/Dropdown";
import BtnLarge from "../../components/BtnLarge";
import TableHeader from "../../components/TableHeader";
import InvestmentModal from "../../components/modal/InvestmentModal";
import InputField from "../../components/InputField";
import PopupOneButton from "../../components/modal/PopupOneButton";
import { fetchComparedCompanies } from "../../api/myCompany";
import rankingsAPI from "../../api/rankings.api";

function CompareResults() {
  const location = useLocation();
  const { selectedCompanyId, compareCompanyIds } = location.state || {};

  const [mediaSize, setMediaSize] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupModalOpen, setIsPopupModalAble] = useState(false);
  const [sortTop, setSortTop] = useState("누적 투자금액 높은순");
  const [sortBottom, setSortBottom] = useState("누적 투자금액 높은순");
  const [companies, setCompanies] = useState([]);
  const [rankingCompanies, setRankingCompanies] = useState([]);

  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const closePopupModal = () => setIsPopupModalAble(false);
  const openPopupModal = () => setIsPopupModalAble(true);

  const handleSuccess = () => {
    closeModal(); // 모달 닫고
    openPopupModal(); // 성공 팝업 열고
    if (selectedCompanyId) {
      // 선택된 기업 + 비교 기업 데이터 다시 불러오기
      fetchComparedCompanies({ selectedCompanyId, compareCompanyIds })
        .then(setCompanies)
        .catch((err) => console.error("데이터 리로드 실패:", err));
    }
  };

  //반응형 디자인
  useEffect(() => {
    function updateMediaSize() {
      const { innerWidth: width } = window;
      if (width >= 1200) setMediaSize("big");
      else if (width > 730) setMediaSize("medium");
      else setMediaSize("small");
    }
    updateMediaSize();
    window.addEventListener("resize", updateMediaSize);
    return () => window.removeEventListener("resize", updateMediaSize);
  }, []);

  useEffect(() => {
    if (!selectedCompanyId) return;
    const loadData = async () => {
      try {
        const data = await fetchComparedCompanies({
          selectedCompanyId,
          compareCompanyIds,
        });
        setCompanies(data);
      } catch (err) {
        console.error("기업 비교 데이터 불러오기 실패:", err);
      }
    };
    loadData();
  }, [selectedCompanyId, compareCompanyIds]);

  useEffect(() => {
    const fetchRankingData = async () => {
      if (!selectedCompanyId) return;
      try {
        const sortBy = getSortKey(sortBottom);
        const order = getSortOrder(sortBottom);
        const data = await rankingsAPI.getSurroundingRankings({
          selectedCompanyId,
          sortBy,
          order,
        });
        setRankingCompanies(data);
      } catch (err) {
        console.error("기업 순위 데이터 불러오기 실패:", err);
      }
    };
    fetchRankingData();
  }, [selectedCompanyId, sortBottom]);

  const sortOptions = [
    "누적 투자금액 높은순",
    "누적 투자금액 낮은순",
    "매출액 높은순",
    "매출액 낮은순",
    "고용 인원 많은순",
    "고용 인원 적은순",
  ];

  const getSortKey = (label) => {
    switch (label) {
      case "누적 투자금액 높은순":
      case "누적 투자금액 낮은순":
        return "investmentAmount";
      case "매출액 높은순":
      case "매출액 낮은순":
        return "revenue";
      case "고용 인원 많은순":
      case "고용 인원 적은순":
        return "employees";
      default:
        return "investmentAmount";
    }
  };

  const getSortOrder = (label) =>
    label.includes("낮은순") || label.includes("적은순") ? "asc" : "desc";

  const sortCompanies = (companies, criteria) => {
    const key = getSortKey(criteria);
    const order = getSortOrder(criteria);
    return [...companies].sort((a, b) => {
      const aVal = a[key] ?? 0;
      const bVal = b[key] ?? 0;
      return order === "asc" ? aVal - bVal : bVal - aVal;
    });
  };

  const columns = [
    { label: "기업명", name: "name", flex: 1.5 },
    { label: "기업 소개", name: "description", flex: 4 },
    { label: "카테고리", name: "category", flex: 2 },
    { label: "누적 투자 금액", name: "realInvestmentAmount", flex: 1 },
    { label: "매출액", name: "revenue", flex: 2 },
    { label: "고용 인원", name: "employees", flex: 1.5 },
  ];

  const rankColumns = [{ label: "순위", name: "ranking", flex: 1 }, ...columns];

  console.log("mediaSize", mediaSize);
  return (
    <>
      <Wrap>
        <div className={styles.contents}>
          <div className={styles.content1}>
            내가 선택한 기업
            <BtnLarge
              type={"orange"}
              mediaSize={mediaSize}
              label={"다른 기업 비교하기"}
              onClick={() =>
                navigate("/select-company", {
                  state: {
                    selectedCompany: companies[0], // 내가 선택한 기업 정보
                    compareCompanies: [], // 비교 기업 초기화
                    preserveOnRefresh: true, // 새로고침 방지용 플래그 추가
                  },
                })
              }
            />
          </div>

          <InputField key={mediaSize} mediaSize={mediaSize}>
            {companies.length > 0 && (
              <CenteredWrapper>
                <SelectedCompanyBox>
                  <img src={companies[0].imageUrl} alt="로고" />
                  <div>
                    <div>{companies[0].name}</div>
                    <div>{companies[0].category}</div>
                  </div>
                </SelectedCompanyBox>
              </CenteredWrapper>
            )}
          </InputField>

          <SpacerSmall />

          <div className={styles.content2}>
            비교 결과 확인하기
            <SortDropdown
              mediaSize={mediaSize}
              options={sortOptions}
              value={sortTop}
              onChange={setSortTop}
            />
          </div>

          <StyledTableWrapper>
            <StyledTable1>
              <thead>
                <TableHeader columns={columns} />
              </thead>
              <tbody>
                {sortCompanies(companies, sortTop).map((company) => (
                  <tr
                    key={company.id}
                    onClick={() => navigate(`/company-detail/${company.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <CompanyCell>
                      <img
                        src={company.imageUrl}
                        alt={`${company.name} 로고`}
                      />
                      <span>{company.name}</span>
                    </CompanyCell>
                    <LeftAlignTD>{company.description}</LeftAlignTD>
                    <TD>{company.category}</TD>
                    <TD>{company.investmentAmount?.toLocaleString()}억 원</TD>
                    <TD>{company.revenue}억 원</TD>
                    <TD>{company.employees}명</TD>
                  </tr>
                ))}
              </tbody>
            </StyledTable1>
          </StyledTableWrapper>

          <SpacerSmall />

          <div className={styles.content3}>
            기업 순위 확인하기
            <SortDropdown
              mediaSize={mediaSize}
              options={sortOptions}
              value={sortBottom}
              onChange={setSortBottom}
            />
          </div>

          <StyledTableWrapper>
            <StyledTable2>
              <thead>
                <TableHeader columns={rankColumns} />
              </thead>
              <tbody>
                {rankingCompanies.map((company) => (
                  <tr
                    key={company.id}
                    onClick={() => navigate(`/company-detail/${company.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <TD>{company.ranking}위</TD>
                    <CompanyCell>
                      <img
                        src={company.imageUrl}
                        alt={`${company.name} 로고`}
                      />
                      <span>{company.name}</span>
                    </CompanyCell>
                    <LeftAlignTD>{company.description}</LeftAlignTD>
                    <TD>{company.category}</TD>
                    <TD>{company.investmentAmount?.toLocaleString()}억 원</TD>
                    <TD>{company.revenue}억 원</TD>
                    <TD>{company.employees}명</TD>
                  </tr>
                ))}
              </tbody>
            </StyledTable2>
          </StyledTableWrapper>

          <Spacer />
          <BtnWrapper>
            <BtnLarge
              type={"orange"}
              mediaSize="big"
              label={"나의 기업에 투자하기"}
              onClick={openModal}
            />
          </BtnWrapper>

          {isModalOpen && (
            <InvestmentModal
              onClose={closeModal}
              onSuccess={handleSuccess} // 성공 후 처리 로직
              mediaSize={mediaSize}
              openPopupModal={openPopupModal}
              company={companies[0]} // "내가 선택한 기업" 정보 넘기기
            />
          )}
        </div>

        {isPopupModalOpen && (
          <PopupOneButton
            onClose={closePopupModal}
            mediaSize={mediaSize}
            type={"success"}
          />
        )}
      </Wrap>
    </>
  );
}

export default CompareResults;

const Wrap = styled.div`
  background-color: #131313;
  color: #ffffff;
`;

const SelectedCompanyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
  }

  div {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
  }
`;

const CenteredWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const TD = styled.td`
  padding: 20px 16px;
  border-bottom: 1px solid #333;
  font-size: 14px;
  background-color: #212121;
  color: #d8d8d8;
  text-align: center;
  word-break: keep-all;
`;

const StyledTable1 = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 696px;

  thead tr {
    border-bottom: 16px solid #131313;
  }

  th,
  td {
    white-space: nowrap;
    text-align: center;
  }

  @media (max-width: 730px) {
    min-width: 576px;
  }
`;

const StyledTable2 = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 768px;

  thead tr {
    border-bottom: 16px solid #131313;
  }

  th,
  td {
    white-space: nowrap;
    text-align: center;
  }

  @media (max-width: 730px) {
    min-width: 656px;
  }
`;

const LeftAlignTD = styled.td`
  padding: 20px 16px;
  border-bottom: 1px solid #333;
  font-size: 14px;
  background-color: #212121;
  color: #d8d8d8;
  text-align: left;
  vertical-align: middle;
`;

const Spacer = styled.div`
  margin-top: 32px;
`;

const SpacerSmall = styled.div`
  margin-top: 50px;
`;

const CompanyCell = styled.td`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  border-bottom: 1px solid #333;
  background-color: #212121;
  color: #d8d8d8;
  font-size: 14px;

  img {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 50%;
  }

  span {
    white-space: nowrap;
  }
`;
const BtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
`;
