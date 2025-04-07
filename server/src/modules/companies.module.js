const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const companiesRouter = express.Router();

/**
 * 전체 기업 리스트 조회 + 가상 투자 총합 포함
 */
companiesRouter.get("/", async (req, res, next) => {
  try {
    const companies = await prisma.$queryRaw`
      SELECT
        c.*,
        COALESCE(SUM(i.amount), 0) AS "totalVirtualInvestmentAmount"
      FROM "Company" c
      LEFT JOIN "Investment" i ON c.id = i."companyId"
      GROUP BY c.id
    `;
    res.json(companies);
  } catch (e) {
    next(e);
  }
});

/**
 * 특정 기업 상세 조회
 */
companiesRouter.get("/:companyId", async (req, res, next) => {
  try {
    const companyId = req.params.companyId;

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({ message: "해당 기업을 찾을 수 없습니다." });
    }

    res.json(company);
  } catch (e) {
    next(e);
  }
});

/**
 * 기업 등록
 */
companiesRouter.post("/", async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      realInvestmentAmount,
      revenue,
      numberOfEmployees,
    } = req.body;

    const company = await prisma.company.create({
      data: {
        name,
        description,
        category,
        realInvestmentAmount: parseFloat(realInvestmentAmount),
        revenue: parseFloat(revenue),
        numberOfEmployees: parseInt(numberOfEmployees),
      },
    });

    res.status(201).json(company);
  } catch (e) {
    next(e);
  }
});

/**
 * 기업 삭제
 */
companiesRouter.delete("/:companyId", async (req, res, next) => {
  try {
    const companyId = req.params.companyId;

    // TODO: Cascade
    // 관련 투자 먼저 삭제
    await prisma.investment.deleteMany({
      where: { companyId },
    });

    await prisma.company.delete({
      where: { id: companyId },
    });

    res.json({ message: "기업 및 관련 투자 정보 삭제 완료" });
  } catch (e) {
    next(e);
  }
});

module.exports = companiesRouter;
