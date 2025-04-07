import React, { useEffect, useState } from "react";
import styled from "styled-components";
import bigLogo from "../assets/images/gnb/standard=pc.svg";
import smallLogo from "../assets/images/gnb/standard=mobile.svg";
import { NavLink } from "react-router-dom";
import { gray_100, gray_200, black_400 } from "../styles/colors";

const getLinkStyle = ({ isActive }) => {
  return {
    color: isActive ? `${gray_100}` : undefined,
  };
};

// 아래 props는 length=big/medium/small
function Gnb({ length }) {
  const image =
    length === "big"
      ? bigLogo
      : length === "medium"
      ? bigLogo
      : length === "small"
      ? smallLogo
      : null;

  //브라우저 사이즈 체크를 위해 임시로 적어둔 코드. 후에 제거할 것것
  //여기부터
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  //여기까지. return 내에서도 width 지우고, import도 확인.

  return (
    <Contatiner $length={length}>
      <NavLink to="/" style={getLinkStyle}>
        <Logo src={image} $length={length}></Logo>
      </NavLink>
      <Text $length={length}>
        <NavLink to="/select-company" style={getLinkStyle}>
          나의 기업 비교
        </NavLink>
        <NavLink to="/compare-status" style={getLinkStyle}>
          비교 현황
        </NavLink>
        <NavLink to="/invest-status" style={getLinkStyle}>
          투자 현황
        </NavLink>
        {/* 브라우저 width 체크를 위한 코드 후에 삭제 필요. */}
        <div>{width}</div>
      </Text>
    </Contatiner>
  );
}

const Contatiner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  background-color: ${black_400};
  color: ${gray_200};

  font-size: ${(props) => {
    if (props.$length === "big") return "15px";
    if (props.$length === "medium") return "15px";
    if (props.$length === "small") return "12px";
    return "0";
  }};

  height: ${(props) => {
    if (props.$length === "big") return "60px";
    if (props.$length === "medium") return "60px";
    if (props.$length === "small") return "56px";
    return "0";
  }};

  border-bottom: 1px solid #2e2e2e;
`;

const Logo = styled.img`
  width: ${(props) => {
    if (props.$length === "big") return "112px";
    if (props.$length === "medium") return "112px";
    if (props.$length === "small") return "64px";
    return "0";
  }};
  height: ${(props) => {
    if (props.$length === "big") return "40px";
    if (props.$length === "medium") return "40px";
    if (props.$length === "small") return "23px";
    return "0";
  }};
  padding-left: ${(props) => {
    if (props.$length === "big") return "360px";
    if (props.$length === "medium") return "24px";
    if (props.$length === "small") return "16px";
    return "0";
  }};
  padding-right: ${(props) => {
    if (props.$length === "big") return "57px";
    if (props.$length === "medium") return "41px";
    if (props.$length === "small") return "24px";
    return "0";
  }};
`;

const Text = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0;

  font-size: ${(props) => {
    if (props.$length === "big") return "15px";
    if (props.$length === "medium") return "15px";
    if (props.$length === "small") return "12px";
    return "0";
  }};

  width: ${(props) => {
    if (props.$length === "big") return "299px";
    if (props.$length === "medium") return "299px";
    if (props.$length === "small") return "212px";
  }};
`;

export default Gnb;
