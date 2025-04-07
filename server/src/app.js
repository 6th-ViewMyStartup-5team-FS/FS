const express = require("express");
const cors = require("cors");
const router = require("./modules/index.module");

const app = express();
const PORT = 7777;

app.use(express.json());
app.use(cors());
app.use("/api", router);

// 예외 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "서버 내부 오류 발생",
  });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
