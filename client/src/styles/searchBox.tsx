import { Paper } from "@mui/material";
import styled from "styled-components";

export const PaperContainer = styled(Paper)`
  display: flex;
  align-items: center;
  border-radius: 2px;
  background-color: ${({ theme }) =>
    theme.mode === "light" ? "#f5f5f5" : "#2a2a2a"};
  &:hover {
    background-color: ${({ theme }) =>
      theme.mode === "light" ? "#e0e0e0" : "#333333"};
  }
  padding-left: 16px;
  width: 100%;
  max-width: 500px;
  @media (min-width: 600px) {
    width: 300px;
  }
  @media (max-width: 600px) {
    width: 100%;
  }
  @media (max-width: 400px) {
    width: 100%;
  }
  @media (max-width: 300px) {
    width: 100%;
  }
`;
