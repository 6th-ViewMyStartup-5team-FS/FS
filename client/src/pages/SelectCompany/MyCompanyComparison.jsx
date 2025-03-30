import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "./MyCompanyComparison.module.css";
import plusIcon from "../../assets/icon/btn_plus.svg";
import styled from "styled-components";
import BtnLarge from "../../components/BtnLarge";
import SelectMyEnterprise from "../../components/modal/SelectMyEnterprise";
import CompareListSection from "../../components/CompareListSection";

function MyCompanyComparison() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaSize, setMediaSize] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [compareCompanies, setCompareCompanies] = useState([]);
  const [selectionMode, setSelectionMode] = useState("my");
  const navigate = useNavigate();

  // 나의 기업 / 비교 기업 선택 핸들러
  const handleSelect = (company, mode) => {
    if (mode === "my") {
      setSelectedCompany(company);
    } else if (mode === "compare") {
      setCompareCompanies((prev) => {
        const exists = prev.find((c) => c.id === company.id);
        if (exists) return prev;
        return [company, ...prev].slice(0, 5);
      });
    }
    setModalOpen(false);
  };

  const handleCancel = () => {
    setSelectedCompany(null);
  };

  const handleCompareClick = () => {
    if (!selectedCompany || compareCompanies.length === 0) {
      alert("기업을 선택해주세요!");
      return;
    }

    const selectedCompanyId = selectedCompany.id;
    const compareCompanyIds = compareCompanies
      .filter((c) => c.id !== selectedCompanyId)
      .map((c) => c.id);

    if (compareCompanyIds.length === 0) {
      alert("비교할 기업을 1개 이상 선택해주세요!");
      return;
    }

    // 디버깅
    console.log("선택 기업 ID:", selectedCompanyId);
    console.log("비교 기업 IDs:", compareCompanyIds);

    navigate("/select-company/compare-results", {
      state: {
        selectedCompanyId,
        compareCompanyIds,
      },
    });
  };

  function updateMediaSize() {
    const { innerWidth: width } = window;
    if (width >= 744) {
      setMediaSize("big");
    } else {
      setMediaSize("medium");
    }
  }

  useEffect(() => {
    updateMediaSize();
    window.addEventListener("resize", updateMediaSize);
    return () => window.removeEventListener("resize", updateMediaSize);
  }, []);

  return (
    <Wrap>
      <Inner>
        <h2 className={styles.title}>나의 기업을 선택해 주세요!</h2>

        <div className={styles.addBoxWrapper}>
          {selectedCompany && (
            <button className={styles.cancelBtn} onClick={handleCancel}>
              선택 취소
            </button>
          )}
          <div className={styles.addBox}>
            {selectedCompany ? (
              <div className={styles.companyInfo}>
                <CompanyInfoWrap>
                  <Logo
                    src={selectedCompany.imageUrl}
                    alt={`${selectedCompany.name} 로고`}
                  />
                  <div className={styles.infoText}>
                    <div className={styles.name}>{selectedCompany.name}</div>
                    <div className={styles.category}>
                      {selectedCompany.category}
                    </div>
                  </div>
                </CompanyInfoWrap>
              </div>
            ) : (
              <button
                className={styles.addButton}
                onClick={() => {
                  setSelectionMode("my");
                  setModalOpen(true);
                }}
              >
                <img src={plusIcon} alt="추가" className={styles.plusIcon} />
                기업 추가
              </button>
            )}
          </div>
        </div>

        {/* 비교 기업 리스트 및 버튼 포함 */}
        <CompareListSection
          companies={compareCompanies}
          onAddClick={() => {
            setSelectionMode("compare");
            setModalOpen(true);
          }}
        />

        <div className={styles.buttonWrapper}>
          <BtnLarge
            type={"orange"}
            size={mediaSize}
            label={"기업 비교하기"}
            onClick={handleCompareClick}
          />
        </div>

        {/* 모달 - 기업 선택 */}
        <SelectMyEnterprise
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={(company) => handleSelect(company, selectionMode)}
          size={mediaSize}
          recentCompanies={compareCompanies}
        />
      </Inner>
    </Wrap>
  );
}

export default MyCompanyComparison;

const Wrap = styled.div`
  background-color: #131313;
  color: #fff;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 70px 16px;
  box-sizing: border-box;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CompanyInfoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
`;
