import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { black_400, black_200, gray_100, gray_200 } from "../../styles/colors";
import companyAPI from "../../api/company.api";
import investmentAPI from "../../api/investment.api";
import BtnLarge from "../../components/BtnLarge";
import BtnPagination from "../../components/BtnPagination";
import AmountCard from "./components/AmountCard";
import InvestmentTable from "./components/InvestmentTable";
import InvestmentModal from "../../components/modal/InvestmentModal";
import { useParams } from "react-router-dom";
import sampleImg from "../../assets/images/company/sample.png";
import PopupOneButton from "../../components/modal/PopupOneButton";
import styles from "./companyDetail.module.css";

function CompanyDetail() {
  const { companyId } = useParams();
  const [mediaSize, setMediaSize] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [investors, setInvestors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ispopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!companyId) {
      console.error("companyId is undefined");
      return;
    }
    fetchData();
  }, [companyId]);

  // 새로고침용 함수 분리
  const fetchData = async () => {
    try {
      const company = await companyAPI.getCompanyById(companyId);
      const investments = await investmentAPI.getAllInvestment();

      const filtered = investments.filter(
        (inv) => inv.company?.id === companyId
      );

      setCompanyData(company);
      setInvestors(filtered);
      setInvestors([
        ...investments.filter((inv) => inv.company.id === companyId),
      ]);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  //페이지네이션 로직
  const currentInvestors = investors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //디버깅
  console.log(investors.length);

  // 반응형 사이즈 계산
  useEffect(() => {
    function updateMediaSize() {
      const { innerWidth: width } = window;
      if (width >= 1200) setMediaSize("big");
      else if (width > 375) setMediaSize("medium");
      else setMediaSize("small");
    }
    updateMediaSize();
    window.addEventListener("resize", updateMediaSize);
    return () => window.removeEventListener("resize", updateMediaSize);
  }, []);

  if (!companyData) return <p>Loading...</p>;

  //디버깅
  console.log(mediaSize);

  return (
    <Wrap>
      <CompanyDetailWrap $size={mediaSize}>
        <div className={styles.companyContainer}>
          <Img
            $mediaSize={mediaSize}
            src={companyData?.imageUrl || sampleImg}
            alt="Company"
          />
          <div className={styles.titleWrap}>
            <Title $mediaSize={mediaSize}>{companyData.name}</Title>
            <Discription $mediaSize={mediaSize}>
              {companyData.category}
            </Discription>
          </div>
        </div>

        <div className={styles.amountCardContainer}>
          <AmountCard
            char="누적 투자 금액"
            type="price"
            number={companyData.realInvestmentAmount}
            mediaSize={mediaSize}
          />
          <AmountCard
            char="매출액"
            type="price"
            number={companyData.revenue}
            mediaSize={mediaSize}
          />
          <AmountCard
            char="고용 인원"
            type="people"
            number={companyData.numberOfEmployees}
            mediaSize={mediaSize}
          />
        </div>

        <IntroContainer>
          <IntroTitle>기업 소개</IntroTitle>
          <IntroText>{companyData.description}</IntroText>
        </IntroContainer>

        <InvestContainer>
          <InvestTitle>View My Startup에서 받은 투자</InvestTitle>
          <BtnLarge
            type="orange"
            mediaSize={mediaSize}
            label="기업 투자하기"
            onClick={() => setIsModalOpen(true)}
          />
        </InvestContainer>

        <Hr $mediaSize={mediaSize} />

        <TableWrap>
          <TotalAmount>
            총{" "}
            {investors.length > 0
              ? investors.reduce((sum, inv) => sum + inv.amount, 0).toFixed(0)
              : "0"}
            억
          </TotalAmount>

          {/* 수정: InvestmentTable에 onRefresh 전달 */}
          <InvestmentTable
            data={currentInvestors} //5명의 투자자마 보여주기
            onRefresh={fetchData}
            mediaSize={mediaSize}
          />
        </TableWrap>

        <PaginationWrap>
          <BtnPagination
            mediaSize={mediaSize}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={investors.length}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </PaginationWrap>
      </CompanyDetailWrap>

      {isModalOpen && (
        <InvestmentModal
          mediaSize={mediaSize}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsPopupOpen(true);
            fetchData(); // 화면이 최신 데이터로 바뀜
          }}
        />
      )}

      {ispopupOpen && (
        <PopupOneButton
          onClose={() => setIsPopupOpen(false)}
          mediaSize={mediaSize}
          type={"success"}
        />
      )}
    </Wrap>
  );
}

export default CompanyDetail;

const Wrap = styled.div`
  background-color: ${black_400};
  color: ${gray_100};
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
`;

const CompanyDetailWrap = styled.div`
  width: ${(props) =>
    props.$mediaSize === "small"
      ? "343px"
      : props.$mediaSize === "medium"
      ? "696px"
      : null};

  margin: ${(props) =>
    props.$mediaSize === "medium" || props.$mediaSize === "small"
      ? "0 16px 68px 16px"
      : "0 23px 115px 13px"};
`;

const Img = styled.img`
  width: ${(props) => (props.$mediaSize === "small" ? "49px" : "80px")};
  height: ${(props) => (props.$mediaSize === "small" ? "49px" : "80px")};
  border-radius: 100%;
  object-fit: cover;
  margin-right: 20px;
`;

const Title = styled.h1`
  font-size: ${({ $mediaSize }) => ($mediaSize === "small" ? "20px" : "24px")};
  font-weight: 700;
  color: white;
  margin: 0;
`;

const Discription = styled.p`
  font-size: ${({ $mediaSize }) => ($mediaSize === "small" ? "16px" : "20px")};
  color: ${gray_200};
  font-weight: 500;
  margin: 0;
`;

const IntroContainer = styled.div`
  background-color: ${black_200};
  color: white;
  border-radius: 10px;
  padding: 24px;
  margin: 20px 0;
`;

const IntroTitle = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
`;

const IntroText = styled.div`
  font-size: 14px;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #2e2e2e;
  margin: ${(props) =>
    props.$mediaSize === "big"
      ? "20px"
      : props.$mediaSize === "medium"
      ? "16px"
      : props.$mediaSize === "small"
      ? "16px"
      : null};
`;

const InvestContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
`;

const InvestTitle = styled.div`
  font-weight: 700;
  color: white;
  font-size: ${(props) =>
    props.$mediaSize === "big"
      ? "20px"
      : props.$mediaSize === "medium" || props.$mediaSize === "small"
      ? "16"
      : null};
`;

const TableWrap = styled.div`
  margin-top: 20px;
`;

const PaginationWrap = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 30px;
`;

const TotalAmount = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
`;
