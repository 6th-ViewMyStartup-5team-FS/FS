import { createGlobalStyle } from "styled-components";

import { media } from "./mixin";

import fontBold from "../assets/fonts/Pretendard-Bold.woff";
import fontMedium from "../assets/fonts/Pretendard-Medium.woff";
import fontLight from "../assets/fonts/Pretendard-Light.woff";

const GlobalStyle = createGlobalStyle`
  @font-face {
      font-family: 'Pretendard';
      src: url(${fontBold}) format('woff');
      font-weight: 700;
      font-style: normal;
  }
  @font-face {
      font-family: 'Pretendard';
      src: url(${fontMedium}) format('woff');
      font-weight: 500;
      font-style: normal;
  }
  @font-face {
      font-family: 'Pretendard';
      src: url(${fontLight}) format('woff');
      font-weight: 300;
      font-style: normal;
  }

  body {
      height: 100%;
      width: 100%;
      font-family: "Pretendard";
      letter-spacing: 1px;
      /* font-size: 1.6rem; */
  }

  ul,
    li {
        list-style: none;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    label,
    button,
    a {
        cursor: pointer;
    }
`;

export default GlobalStyle;
