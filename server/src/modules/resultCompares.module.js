const express = require("express");
const prisma = require("../db/prisma/client.prisma");
const Exception = require("../exceptions");

const resultCompareRouter = express.Router();

/**
 * 비교 현황 조회
 */
resultCompareRouter.get("/", async (req, res, next) => {
  try {
    const { sortBy = "pickAsMyStartupCount", order = "desc" } = req.query;

    const companies = await prisma.company.findMany();

    const validSortFields = {
      pickAsMyStartupCount: "pickAsMyStartupCount",
      pickAsComparisonCount: "pickAsComparisonCount",
    };

    let sortedCompanies = [...companies];

    if (validSortFields[sortBy]) {
      sortedCompanies.sort((a, b) => {
        const valA = a[validSortFields[sortBy]];
        const valB = b[validSortFields[sortBy]];
        return order === "asc" ? valA - valB : valB - valA;
      });
    }

    const result = sortedCompanies.map((company) => ({
      id: company.id,
      imageUrl: company.imageUrl,
      name: company.name,
      description: company.description,
      category: company.category,
      pickAsMyStartupCount: company.pickAsMyStartupCount,
      pickAsComparisonCount: company.pickAsComparisonCount,
    }));
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/**
 * 선택 기업 + 비교 기업 데이터 조회
 */
resultCompareRouter.post("/selected", async (req, res, next) => {
  try {
    const { selectedCompanyId, compareCompanyIds = [] } = req.body;

    console.log("선택 기업 ID:", selectedCompanyId);
    console.log("비교 기업 ID 목록:", compareCompanyIds);
    console.log("전체 요청 body:", req.body);

    if (!selectedCompanyId) {
      throw new Exception.BadRequest("선택된 기업 ID는 필수입니다.");
    }

    const allIds = [selectedCompanyId, ...compareCompanyIds];

    const companies = await prisma.company.findMany({
      where: {
        id: {
          in: allIds,
        },
      },
    });

    // 나의 기업으로 선택된 횟수 증가시키기
    await prisma.company.update({
      where: {
        id: selectedCompanyId,
      },
      data: {
        pickAsMyStartupCount: {
          increment: 1,
        },
      },
    });

    // 비교 기업으로 선택된 횟수 증가시키기
    await prisma.company.updateMany({
      where: {
        id: {
          in: compareCompanyIds,
        },
      },
      data: {
        pickAsComparisonCount: {
          increment: 1,
        },
      },
    });

    if (!companies || companies.length === 0) {
      throw new Exception.BadRequest("기업 정보를 찾을 수 없습니다.");
    }

    const result = companies.map((company) => ({
      id: company.id,
      imageUrl: company.imageUrl,
      name: company.name,
      imageUrl: company.imageUrl,
      description: company.description,
      category: company.category,
      investmentAmount: company.realInvestmentAmount ?? 0,
      revenue: company.revenue ?? 0,
      employees: company.numberOfEmployees ?? 0,
    }));

    // 선택 기업이 앞에 오도록 정렬
    result.sort((a, b) =>
      a.id === selectedCompanyId ? -1 : b.id === selectedCompanyId ? 1 : 0
    );

    res.json(result);
  } catch (err) {
    console.error("비교 기업 데이터 조회 실패:", err);
    res.status(500).json({
      message: err.message || "서버 내부 오류 발생",
    });
  }
});

module.exports = resultCompareRouter;
