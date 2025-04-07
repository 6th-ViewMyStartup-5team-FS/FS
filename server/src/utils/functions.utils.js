function getSurroundingRanking(companies, targetCompany) {
  // 선택한 기업이 정렬된 리스트에서 몇 번째(index)인지 찾음
  const myIndex = companies.findIndex((c) => c.id === targetCompany);
  if (myIndex === -1) throw new Error("Selected company not found");

  // 기본적으로 선택 기업 앞뒤로 2개씩 보여주기 위해 start 설정
  let start = Math.max(myIndex - 2, 0);
  let end = start + 5;

  // 만약 리스트 끝에 가까우면 뒤로 4개까지 보여줄 수 있도록 조정
  if (end > companies.length) {
    end = companies.length;
    start = Math.max(end - 5, 0);
  }

  // 최종적으로 선택 기업 기준 앞뒤 포함한 최대 5개 기업 추출
  const surrounding = companies.slice(start, end);

  return surrounding;
}

module.exports = getSurroundingRanking;
