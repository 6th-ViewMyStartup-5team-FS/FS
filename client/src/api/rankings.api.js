import { client } from "./index.api";

// 전체 기업 랭킹 가져오기
const getRankings = async ({ sortBy, order }) => {
  const response = await client.get("/api/rankings", {
    params: { sortBy, order },
  });
  return response.data;
};

// 기준 회사 기준 주변 랭킹 5개씩 가져오기
const getSurroundingRankings = async ({ selectedCompanyId, sortBy, order }) => {
  const response = await client.get("/api/rankings/surrounding", {
    params: { selectedCompanyId, sortBy, order },
  });
  return response.data;
};

const rankingsAPI = {
  getRankings,
  getSurroundingRankings,
};

export default rankingsAPI;
