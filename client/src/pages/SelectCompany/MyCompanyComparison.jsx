import React, { useEffect, useState } from "react";
import styles from "./MyCompanyComparison.module.css";
import plusIcon from "../../assets/icon/btn_plus.svg";
import styled from "styled-components";
import BtnLarge from "../../components/BtnLarge";
import SelectMyEnterprise from "../../components/modal/SelectMyEnterprise";

function MyCompanyComparison() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaSize, setMediaSize] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleSelect = (c) => {
    setSelectedCompany(c);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setSelectedCompany(null);
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

    return () => {
      window.removeEventListener("resize", updateMediaSize);
    };
  }, []);

  return (
    <>
      <Wrap>
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
                <div className={styles.infoText}>
                  <div className={styles.name}>{selectedCompany.name}</div>
                  <div className={styles.category}>
                    {selectedCompany.category}
                  </div>
                </div>
              </div>
            ) : (
              <button className={styles.addButton}>
                <img
                  src={plusIcon}
                  alt="추가"
                  className={styles.plusIcon}
                  onClick={() => setModalOpen(true)}
                />
                기업 추가
              </button>
            )}
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          <BtnLarge type={"black"} size={"big"} label={"기업 비교하기"} />
        </div>

        <SelectMyEnterprise
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={handleSelect}
          size={mediaSize}
        />
      </Wrap>
    </>
  );
}

export default MyCompanyComparison;

const Wrap = styled.div`
  background-color: #131313;
  color: #fff;
  max-width: 1200px;
  min-height: 100vh;
  padding: 70px 0px 10% 10%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
