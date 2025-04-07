import React from "react";
import styled from "styled-components";
import { black_100 } from "../styles/colors";

export default function TableHeader({ columns = [] }) {
  return (
    <tr>
      {columns.map(({ label, name, width }, i) => (
        <Th key={name || i} style={{ width }}>
          {label}
        </Th>
      ))}
    </tr>
  );
}

const Th = styled.th`
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background-color: ${black_100};
  white-space: nowrap;
  text-align: center;
`;
