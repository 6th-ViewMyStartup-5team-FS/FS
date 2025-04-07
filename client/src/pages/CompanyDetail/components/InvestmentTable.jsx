import React, { useState } from "react";
import styled from "styled-components";
import dropdown from "../../../assets/icon/btn_dropdown.png";
import ModalPassword from "../../../components/modal/Password";
import PopupOneButton from "../../../components/modal/PopupOneButton";
import UpdateInvestmentModal from "../../../components/modal/UpdateInvestmentModal";
import investmentAPI from "../../../api/investment.api";
import {
  black_100,
  black_300,
  black_400,
  gray_100,
  gray_200,
  gray_300,
} from "../../../styles/colors";

function InvestmentTable({ data = [], onRefresh, mediaSize }) {
  const sortedData = [...data].sort((a, b) => b.amount - a.amount);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDropdownId, setSelectedDropdownId] = useState(null);

  console.log("InvestmentTable - mediaSize:", mediaSize);

  const handlePasswordSubmit = async (password) => {
    if (!selectedInvestment) return;

    try {
      // 비밀번호 검증 (수정/삭제 공통)
      await investmentAPI.verifyPassword(selectedInvestment.id, password);

      if (isUpdateMode) {
        // 수정 모드 - 비밀번호 일치하면 수정 모달 열기
        setIsUpdateModalOpen(true);
      } else {
        // 삭제 모드 - 비밀번호 일치 후 삭제 진행
        await investmentAPI.deleteInvestment(selectedInvestment.id, password);
        setPopupType("delete-success");
        onRefresh && onRefresh();
      }
    } catch (e) {
      console.error(e);
      setPopupType("error"); // 비번 틀리면 에러 팝업
      setIsPopupOpen(true); // 실패했을 때만 팝업을 띄움
    } finally {
      setIsPasswordModalOpen(false);
    }
  };

  const handleUpdateSuccess = () => {
    setPopupType("update-success");
    setIsPopupOpen(true);
    onRefresh && onRefresh();
  };

  const openModal = (investment, mode) => {
    setSelectedInvestment(investment);
    setIsUpdateMode(mode === "update");
    setIsPasswordModalOpen(true);
    setSelectedDropdownId(null);
  };

  const toggleDropdown = (id) => {
    setSelectedDropdownId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {isPasswordModalOpen && (
        <ModalPassword
          onClose={() => setIsPasswordModalOpen(false)}
          onDelete={handlePasswordSubmit}
          isUpdateMode={isUpdateMode}
          mediaSize={mediaSize}
        />
      )}

      {isUpdateModalOpen && selectedInvestment && (
        <UpdateInvestmentModal
          onClose={() => setIsUpdateModalOpen(false)}
          mediaSize={mediaSize}
          investment={selectedInvestment}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {isPopupOpen && (
        <PopupOneButton
          onClose={() => setIsPopupOpen(false)}
          type={popupType}
          mediaSize={mediaSize}
        />
      )}

      <WrapTable>
        <Table $mediaSize={mediaSize}>
          <thead>
            <tr>
              <Th>투자자 이름</Th>
              <Th>순위</Th>
              <Th>투자 금액</Th>
              <Th>투자 코멘트</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <Tr>
                <Td colSpan="5" className="no-investment-message">
                  아직 투자한 기업이 없어요, 버튼을 눌러 기업에 투자해보세요
                </Td>
              </Tr>
            ) : (
              sortedData.map((investment, index) => (
                <Tr key={investment.id}>
                  <Td>{investment.investorName}</Td>
                  <Td>{index + 1}위</Td>
                  <Td>{investment.amount.toFixed(0)}억</Td>
                  <Td>{investment.comment}</Td>
                  <Td>
                    <Dropdown>
                      <DropdownButton
                        onClick={() => toggleDropdown(investment.id)}
                      >
                        <ArrowIcon src={dropdown} alt="화살표" />
                      </DropdownButton>
                      {selectedDropdownId === investment.id && (
                        <DropdownList>
                          <DropdownItem
                            onClick={() => openModal(investment, "update")}
                          >
                            수정하기
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => openModal(investment, "delete")}
                          >
                            삭제하기
                          </DropdownItem>
                        </DropdownList>
                      )}
                    </Dropdown>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </WrapTable>
    </>
  );
}

export default InvestmentTable;

const WrapTable = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 697px;
  border-collapse: collapse;
  background-color: ${black_400};
  color: ${gray_100};
`;

const Th = styled.th`
  /* padding: 12px; */
  padding-top: 12px;
  padding-bottom: 12px;

  background-color: ${black_100};
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 15px solid ${black_400}; /* thead와 tbody 사이 간격 */

  &:nth-child(1),
  &:nth-child(2),
  &:nth-child(3) {
    width: 84px; /* Set width to 84px for 투자자 이름, 순위, 투자 금액 */
  }

  &:nth-child(4) {
    width: 884px; /* Set width to 884px for 투자 코멘트 */
  }

  &:nth-child(5) {
    width: 64px; /* Set width to 64px for the last column (Dropdown) */
  }
`;

const Td = styled.td`
  padding: 12px;
  text-align: center;
  font-size: 14px;
  height: 64px;

  &:nth-child(1),
  &:nth-child(2),
  &:nth-child(3) {
    width: 84px;
    ${(props) =>
      props.$mediaSize === "big"
        ? "84px"
        : props.$mediaSize === "medium"
        ? "10%"
        : "10%"}
    text-align: center;
  }

  &:nth-child(4) {
    width: ${(props) =>
      props.$mediaSize === "big"
        ? "884px"
        : props.$mediaSize === "medium"
        ? "50%"
        : "50%"};
    text-align: left;
    font-size: 14px;
    height: 64px;
  }

  &:nth-child(5) {
    width: ${(props) =>
      props.$mediaSize === "big"
        ? "64px"
        : props.$mediaSize === "medium"
        ? "10%"
        : "10%"};
  }

  &.no-investment-message {
    background-color: ${black_400};
    color: ${gray_200};
    font-size: 14px;
    text-align: center;
    height: 150px;
  }
`;

const Tr = styled.tr`
  background-color: ${black_300};
  border-bottom: 1px solid ${gray_300}; /* 각 행 사이 가로줄 */

  &:last-child {
    border-bottom: none; /* 마지막 행에는 가로줄 제거 */
  }
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const ArrowIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const DropdownList = styled.div`
  box-sizing: border-box;
  position: absolute;
  top: 100%;
  left: auto;
  right: 0;
  width: 144px;
  height: 80px;
  background-color: ${black_400};
  border: 1px solid ${gray_200};
  border-radius: 10px;
  overflow: hidden;
  z-index: 1000;
`;

const DropdownItem = styled.button`
  white-space: nowrap;
  width: 100%;
  height: 50%;
  text-align: center;
  padding: 10px 16px;
  color: #fff;
  background-color: ${black_400};
  border: none;
  font-size: 12px;
  cursor: pointer;
  border-bottom: 1px solid ${gray_200};
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #212121;
  }
`;
