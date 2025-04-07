## 5TEAM

- 5팀 초급프로젝트 작업공간 입니다.
- https://zest-kitchen-ec0.notion.site/1bd7be15f9c880c8a9bee89cee58b9dc?v=1bd7be15f9c881a29670000c4644aaee&pvs=4

### 팀원 구성

- 김다은 https://github.com/fs6-kde
- 김수경 https://github.com/suKyoung25
- 이나경 https://github.com/nagyeong05
- 신수민 https://github.com/Shinmilli
- 최지예 https://github.com/kongduu

### 프로젝트 소개

- 주제:View My Startup
- 프로젝트 기간: 2025. 03. 21 ~ 2025. 04. 10

### 파일 구조

<pre><code>```bash
FS/
├── client/ # 프론트엔드 (React + Vite)
│ ├── node_modules/
│ ├── public/ # 정적 파일 (필요 시)
│ ├── src/
│ │ ├── api/ # API 호출 함수 모음 (ex. axios)
│ │ ├── assets/ # 이미지, 아이콘 등 정적 리소스
│ │ ├── components/ # 공통 컴포넌트
│ │ ├── hooks/ # 커스텀 훅
│ │ ├── pages/ # 라우팅되는 페이지 컴포넌트
│ │ ├── styles/ # 전역 및 모듈 스타일
│ │ ├── App.jsx # 루트 컴포넌트
│ │ ├── main.jsx # 앱 엔트리포인트
│ │ └── routes.jsx # 라우터 설정
│ ├── .gitignore
│ ├── index.html
│ ├── vite.config.js # Vite 설정 파일
│ ├── netlify.toml # 배포 설정 (Netlify)
│ ├── package.json
│ └── README.md

├── server/ # 백엔드 (Node.js + Express + Prisma)
│ ├── https/ # REST API 테스트용 HTTP 파일
│ ├── node_modules/
│ ├── src/
│ │ ├── db/
│ │ │ └── prisma/
│ │ │ ├── client.prisma.js
│ │ │ ├── schema.prisma
│ │ │ └── seed.js
│ │ ├── modules/ # 기능별 모듈(라우터)
│ │ │ ├── companies.module.js
│ │ │ ├── investments.module.js
│ │ │ ├── rankings.module.js
│ │ │ └── resultCompares.module.js
│ │ ├── app.js  
│ │ └── exceptions.js  
│ ├── .env
│ ├── .gitignore
│ ├── package.json
│ └── README.md

├── node_modules/  
├── .gitignore
├── package.json  
├── package-lock.json
└── README.md
```</code></pre>


### 배포 주소

- client url: https://view-my-startup-fs6.netlify.app/

- 구성
  MainFullList: 기업 전체 리스트 조회 Page
  SelectCompany > CompareResult: 나의 기업 비교 선택 Page > 비교 결과 Page
  InvestStatus: 투자 현황 Page
  CompareStatus: 비교 현황 Page
  CompanyDetail: 기업 상세 Page

- server url: https://fs-d0af.onrender.com

- 구성
  investments.module.js: 투자 등록, 조회, 삭제, 수정 등
  companies.module.js: 기업 정보 (기업 생성, 조회, 삭제 등)
  rankings.module.js: 비교 순위 조회
  compares.module.js: 기업 비교 선택/결과
