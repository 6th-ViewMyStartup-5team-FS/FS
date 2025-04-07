import React, { useState, useEffect } from "react";
import styles from "./CompareStatus.module.css";
import { black_400, gray_100 } from "../../styles/colors";
import BtnPagination from "../../components/BtnPagination";
import SortDropdown from "../../components/Dropdown";
import resultCompareAPI from "../../api/resultCompare.api";
import { Link } from "react-router-dom";
import styled from "styled-components";

function CompareStatus() {
  const [mediaSize, setMediaSize] = useState("");
  const [selectedSort, setSelectedSort] =
    useState("나의 기업 선택 횟수 높은순");
  const [compareData, setCompareData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const columns = [
    { label: "순위", name: "ranking", width: "6%" },
    { label: "기업명", name: "name", width: "18%" },
    { label: "기업 소개", name: "description", width: "30%" },
    { label: "카테고리", name: "category", width: "12%" },
    {
      label: "나의 기업 선택 횟수",
      name: "pickAsMyStartupCount",
      width: "16%",
    },
    {
      label: "비교 기업 선택 횟수",
      name: "pickAsComparisonCount",
      width: "16%",
    },
  ];

  const sortOptions = [
    "나의 기업 선택 횟수 높은순",
    "나의 기업 선택 횟수 낮은순",
    "비교 기업 선택 횟수 높은순",
    "비교 기업 선택 횟수 낮은순",
  ];

  const sortMap = {
    "나의 기업 선택 횟수 높은순": {
      sortBy: "pickAsMyStartupCount",
      order: "desc",
    },
    "나의 기업 선택 횟수 낮은순": {
      sortBy: "pickAsMyStartupCount",
      order: "asc",
    },
    "비교 기업 선택 횟수 높은순": {
      sortBy: "pickAsComparisonCount",
      order: "desc",
    },
    "비교 기업 선택 횟수 낮은순": {
      sortBy: "pickAsComparisonCount",
      order: "asc",
    },
  };

  const handleSortChange = (option) => {
    setSelectedSort(option);
    setCurrentPage(1);
  };

  const updateMediaSize = () => {
    const width = window.innerWidth;
    setMediaSize(width > 744 ? "big" : "small");
  };

  useEffect(() => {
    updateMediaSize();
    window.addEventListener("resize", updateMediaSize);
    return () => window.removeEventListener("resize", updateMediaSize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { sortBy, order } = sortMap[selectedSort];
        const data = await resultCompareAPI.getCompareStatus({ sortBy, order });
        setCompareData(data);
      } catch (err) {
        console.error("비교 현황 불러오기 실패:", err);
      }
    };
    fetchData();
  }, [selectedSort]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = compareData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Wrap>
      <div className={styles.container}>
        <div className={styles.top}>
          <h1 className={styles.title}>비교 현황</h1>
          <SortDropdown
            mediaSize={mediaSize}
            options={sortOptions}
            value={selectedSort}
            onChange={handleSortChange}
          />
        </div>

        <div className={styles.record}>
          <table className={styles.styledTable}>
            <thead>
              <tr>
                {columns.map(({ label, name, width }, i) => (
                  <th key={name || i} className={styles.th} style={{ width }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td className={styles.rank}>{startIndex + index + 1}위</td>
                  <td className={styles.name}>
                    <div className={styles.companyCell}>
                      <img
                        className={styles.logo}
                        src={item.imageUrl}
                        alt={`${item.name} 로고`}
                      />
                      <Link to={`/company-detail/${item.id}`}>{item.name}</Link>
                    </div>
                  </td>
                  <td className={styles.introduce}>
                    <Link to={`/company-detail/${item.id}`}>
                      {item.description}
                    </Link>
                  </td>
                  <td className={styles.td}>{item.category}</td>
                  <td className={styles.td}>
                    {item.pickAsMyStartupCount.toLocaleString()}회
                  </td>
                  <td className={styles.td}>
                    {item.pickAsComparisonCount.toLocaleString()}회
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.paginationWrap}>
          <BtnPagination
            mediaSize={mediaSize}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={compareData.length}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </Wrap>
  );
}

export default CompareStatus;

const Wrap = styled.div`
  background-color: ${black_400};
  color: ${gray_100};
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
`;
