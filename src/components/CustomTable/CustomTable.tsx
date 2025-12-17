import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React from "react";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any) => string;
}

interface CustomTableProps {
  columns: Column[];
  rows: any[];
  checkboxSelection?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowSelect?: (selectedRows: any[]) => void;
  getRowClassName?: (params: { indexRelativeToCurrentPage: number }) => string;
}

export default function CustomTable({
  columns,
  rows,
  checkboxSelection = false,
  pageSize = 20,
  pageSizeOptions = [10, 20, 50],
  onRowSelect,
  getRowClassName,
}: CustomTableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(pageSize);
  const [selectedRows, setSelectedRows] = React.useState<any[]>([]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
      setSelectedRows(newSelected);
      onRowSelect?.(newSelected);
    } else {
      setSelectedRows([]);
      onRowSelect?.([]);
    }
  };

  const handleRowClick = (event: React.MouseEvent<unknown>, row: any) => {
    if (!checkboxSelection) return;

    const selectedIndex = selectedRows.findIndex(
      (selectedRow) => selectedRow.id === row.id
    );
    let newSelected: any[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelected);
    onRowSelect?.(newSelected);
  };

  const isSelected = (row: any) =>
    selectedRows.findIndex((selectedRow) => selectedRow.id === row.id) !== -1;

  const isIndeterminate =
    selectedRows.length > 0 &&
    selectedRows.length <
      rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length;
  const isChecked =
    selectedRows.length ===
      rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length &&
    rows.length > 0;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table
          stickyHeader
          aria-label="custom table"
          sx={{ border: "1px solid #ccc" }}
        >
          <TableHead sx={{ borderRadius: "10px 10px 0 0" }}>
            <TableRow>
              {checkboxSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isChecked}
                    onChange={handleSelectAllClick}
                    inputProps={{ "aria-label": "select all rows" }}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleRowClick(event, row)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id || index}
                    selected={isItemSelected}
                    className={getRowClassName?.({
                      indexRelativeToCurrentPage: index,
                    })}
                    sx={{
                      cursor: checkboxSelection ? "pointer" : "default",
                      "&.even": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                      "&.odd": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    {checkboxSelection && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
                }}
              >
                <TableCell
                  colSpan={columns.length + (checkboxSelection ? 1 : 0)}
                />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={pageSizeOptions}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
