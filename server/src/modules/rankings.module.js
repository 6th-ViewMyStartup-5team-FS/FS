const express = require("express");
const prisma = require("../db/prisma/client.prisma");
const Exception = require("../exceptions");

const rankingsRouter = express.Router();

/**
 * 전체 기업 랭킹 조회
 */
rankingsRouter.get("/", async (req, res, next) => {
  try {
    const { sortBy = "investmentAmount", order = "desc" } = req.query;

    const validSortFields = {
      investmentAmount: "realInvestmentAmount",
      revenue: "revenue",
      employees: "numberOfEmployees",
    };

    if (!validSortFields[sortBy]) {
      throw new Exception.BadRequest("유효하지 않은 정렬 기준입니다.");
    }

    const sortField = validSortFields[sortBy];

    const companies = await prisma.company.findMany();

    const sorted = [...companies].sort((a, b) => {
      const valA = a[sortField] ?? 0;
      const valB = b[sortField] ?? 0;
      return order === "asc" ? valA - valB : bVal - aVal;
    });

    const result = sorted.map((company, index) => ({
      id: company.id,
      imageUrl: company.imageUrl,
      name: company.name,
      description: company.description,
      category: company.category,
      investmentAmount: company.realInvestmentAmount ?? 0,
      revenue: company.revenue ?? 0,
      employees: company.numberOfEmployees ?? 0,
      ranking: index + 1,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * 선택된 기업 기준으로 최대 5개 기업 조회 API
 */
rankingsRouter.get("/surrounding", async (req, res, next) => {
  try {
    // 쿼리 파라미터에서 정렬 기준 및 정렬 순서 추출
    const {
      selectedCompanyId,
      sortBy = "investmentAmount",
      order = "desc",
    } = req.query;

    // 클라이언트에서 받은 sortBy를 실제 DB 컬럼 이름으로 매핑
    const validSortFields = {
      investmentAmount: "realInvestmentAmount",
      revenue: "revenue",
      employees: "numberOfEmployees",
    };
    const sortField = validSortFields[sortBy];
    if (!sortField) throw new Error("Invalid sort field");

    // 전체 기업 데이터 조회
    const allCompanies = await prisma.company.findMany();

    // 정렬 기준에 따라 기업 데이터 정렬
    const sorted = [...allCompanies].sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      return order === "asc" ? aVal - bVal : bVal - aVal;
    });

    // 선택한 기업이 정렬된 리스트에서 몇 번째(index)인지 찾음
    const myIndex = sorted.findIndex((c) => c.id === selectedCompanyId);
    if (myIndex === -1) throw new Error("Selected company not found");

    // 기본적으로 선택 기업 앞뒤로 2개씩 보여주기 위해 start 설정
    let start = Math.max(myIndex - 2, 0);
    let end = start + 5;

    // 만약 리스트 끝에 가까우면 뒤로 4개까지 보여줄 수 있도록 조정
    if (end > sorted.length) {
      end = sorted.length;
      start = Math.max(end - 5, 0);
    }

    // 최종적으로 선택 기업 기준 앞뒤 포함한 최대 5개 기업 추출
    const surrounding = sorted.slice(start, end);

    // 결과에 순위(ranking) 포함해서 응답 데이터 구성
    const result = surrounding.map((c) => ({
      id: c.id,
      imageUrl: c.imageUrl,
      name: c.name,
      description: c.description,
      category: c.category,
      investmentAmount: c.realInvestmentAmount ?? 0,
      revenue: c.revenue ?? 0,
      employees: c.numberOfEmployees ?? 0,
      ranking: sorted.findIndex((s) => s.id === c.id) + 1,
    }));

    // 클라이언트에 응답
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = rankingsRouter;
