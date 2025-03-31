import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.palette.background.paper};
  margin: 0 auto;
  table-layout: auto; /* Changed from fixed to auto to respect content */
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.palette.primary.main};
  position: sticky;
  top: 0;
  z-index: 10;

  tr {
    display: table-row; /* Use standard table layout for header */
  }

  th {
    padding: 12px 16px;
    vertical-align: middle;
    text-align: left;
    color: ${({ theme }) => theme.palette.common.white};
    font-weight: 600;
    white-space: nowrap;
    position: relative; /* For sortable indicators */
  }
`;

export const TableBody = styled.tbody`
  tr {
    &:nth-child(even) {
      background-color: ${({ theme }) => theme.palette.action.hover};
    }
    &:nth-child(odd) {
      background-color: ${({ theme }) => theme.palette.background.paper};
    }
    &:hover {
      background-color: ${({ theme }) => theme.palette.action.selected};
    }
  }
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  display: table-row; /* Use standard table layout for rows */

  td {
    padding: 12px 16px;
    vertical-align: middle;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  }
`;

// Updated TableCell with min-width
export const TableCell = styled.td<{ width?: string }>`
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: ${(props) => props.width || "100px"};
  max-width: ${(props) => props.width || "300px"};
`;

// Updated TableHeaderCell with min-width
export const TableHeaderCell = styled.th<{ width?: string }>`
  color: ${({ theme }) => theme.palette.common.white};
  min-width: ${(props) => props.width || "100px"};

  &.sortable {
    cursor: pointer;
    user-select: none;

    &:hover {
      background-color: ${({ theme }) => theme.palette.primary.dark};
    }

    &::after {
      content: "";
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
    }

    &.asc::after {
      content: "▲";
      font-size: 0.7em;
    }

    &.desc::after {
      content: "▼";
      font-size: 0.7em;
    }
  }
`;
