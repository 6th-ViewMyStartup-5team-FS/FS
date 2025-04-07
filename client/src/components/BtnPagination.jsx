import React from "react";
import styled from "styled-components";
import BtnPage from "./BtnPage";
import BtnLeft from "./BtnLeft";
import BtnRight from "./BtnRight";

function BtnPagination({
  mediaSize,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Container>
      <NavButton
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <BtnLeft mediaSize={mediaSize} />
      </NavButton>

      {pageNumbers.map((num) => (
        <PageButton
          key={num}
          onClick={() => onPageChange(num)}
          aria-current={currentPage === num ? "page" : undefined}
        >
          <BtnPage
            text={num}
            mediaSize={mediaSize}
            isActive={currentPage === num} // 여기에 주목
          />
        </PageButton>
      ))}

      <NavButton
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <BtnRight mediaSize={mediaSize} />
      </NavButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PageButton = styled(NavButton)`
  /* 추가 스타일이 있다면 여기에 */
`;

export default BtnPagination;
