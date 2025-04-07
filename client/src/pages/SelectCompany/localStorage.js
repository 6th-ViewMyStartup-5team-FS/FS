const RECENT_KEY = "recentMyCompanies";

export const getRecentMyCompanies = () => {
  try {
    const data = localStorage.getItem(RECENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("localStorage 파싱 에러:", e);
    return [];
  }
};

export const setRecentMyCompanies = (companies) => {
  try {
    const data = JSON.stringify(companies.slice(0, 5));
    localStorage.setItem(RECENT_KEY, data);
  } catch (e) {
    console.error("localStorage 저장 에러:", e);
  }
};
