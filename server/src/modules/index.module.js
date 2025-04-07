const express = require("express");
const companiesRouter = require("./companies.module");
const investmentsRouter = require("./investments.module");
const resultCompareRouter = require("./resultCompares.module");
const rankingsRouter = require("./rankings.module");

const router = express.Router();

router.use("/companies", companiesRouter);
router.use("/investments", investmentsRouter);
router.use("/resultCompare", resultCompareRouter);
router.use("/rankings", rankingsRouter);

module.exports = router;
