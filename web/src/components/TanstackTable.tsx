import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type GroupingState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight, ChevronUp, Eye, Pencil, Printer, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type StudentStatus = "On Track" | "At Risk" | "Probation";

type StudentRecord = {
  id: string;
  student: string;
  classGroup: string;
  advisor: string;
  campus: string;
  credits: number;
  score: number;
  status: StudentStatus;
  absentDays: number;
  enrollmentDate: string;
};

const statusBadgeStyles: Record<StudentStatus, { bg: string; text: string }> = {
  "On Track": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "At Risk": { bg: "bg-amber-100", text: "text-amber-700" },
  Probation: { bg: "bg-rose-100", text: "text-rose-700" },
};

const statusOptions: StudentStatus[] = ["On Track", "At Risk", "Probation"];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const globalTextFilter: FilterFn<StudentRecord> = (row, columnId, filterValue) => {
  if (!filterValue) return true;
  const rawValue = row.getValue(columnId);
  if (rawValue === undefined || rawValue === null) return false;
  return String(rawValue).toLowerCase().includes(String(filterValue).toLowerCase());
};

export default function TanstackTablePage() {
  const advancedData = useMemo<StudentRecord[]>(() => {
    const studentNames = [
      "Alex Johnson",
      "Priya Patel",
      "Liam Chen",
      "Maria Rodriguez",
      "Noah Williams",
      "Sophia Lee",
      "Ethan Davis",
      "Aisha Rahman",
      "James Carter",
      "Zara Ali",
      "Mason Wright",
      "Olivia Martin",
    ];
    const classGroups = ["Grade 9A", "Grade 9B", "Grade 10A", "Grade 10B", "Grade 11A", "Grade 11B"];
    const advisors = ["Ms. Patel", "Mr. Ortega", "Dr. Sullivan", "Mrs. O'Connor"];
    const campuses = ["North", "South", "West"];
    return Array.from({ length: 180 }, (_, index) => {
      const score = 64 + ((index * 7) % 34);
      return {
        id: `student-${index}`,
        student: `${studentNames[index % studentNames.length]} ${index + 1}`,
        classGroup: classGroups[index % classGroups.length],
        advisor: advisors[index % advisors.length],
        campus: campuses[index % campuses.length],
        credits: 12 + (index % 6),
        score: Math.min(score, 99),
        status: statusOptions[index % statusOptions.length],
        absentDays: index % 9,
        enrollmentDate: new Date(2024, index % 6, (index % 27) + 1).toISOString(),
      } satisfies StudentRecord;
    });
  }, []);

  const advancedColumns = useMemo<ColumnDef<StudentRecord>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-4 w-4 accent-slate-600"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            ref={(element) => {
              if (element) element.indeterminate = table.getIsSomeRowsSelected();
            }}
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-4 w-4 accent-slate-600"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            ref={(element) => {
              if (element) element.indeterminate = row.getIsSomeSelected();
            }}
            disabled={!row.getCanSelect()}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
        size: 48,
      },
      {
        accessorKey: "student",
        header: "Student",
        cell: ({ row, getValue }) => (
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">{getValue<string>()}</span>
            {row.original?.campus && <span className="text-xs text-slate-500">{row.original.campus} Campus</span>}
          </div>
        ),
      },
      {
        accessorKey: "classGroup",
        header: "Class",
        enableGrouping: true,
      },
      {
        accessorKey: "advisor",
        header: "Advisor",
        enableGrouping: true,
      },
      {
        accessorKey: "campus",
        header: "Campus",
        enableGrouping: true,
      },
      {
        accessorKey: "credits",
        header: "Credits",
        enableGrouping: false,
        enableHiding: false,
        aggregationFn: "sum",
        aggregatedCell: ({ getValue }) => (
          <span className="font-medium text-slate-700">Total: {getValue<number>() ?? 0}</span>
        ),
      },
      {
        accessorKey: "score",
        header: "Performance",
        aggregationFn: "mean",
        cell: ({ getValue }) => {
          const value = Number(getValue<number>() ?? 0);
          const tone = value >= 85 ? "bg-emerald-500" : value >= 70 ? "bg-amber-500" : "bg-rose-500";
          return (
            <div className="flex items-center gap-3">
              <div className="relative h-2 flex-1 rounded-full bg-slate-200">
                <div className={`absolute left-0 top-0 h-2 rounded-full ${tone}`} style={{ width: `${Math.min(value, 100)}%` }} />
              </div>
              <span className="w-12 text-right text-sm font-semibold text-slate-700">{Math.round(value)}%</span>
            </div>
          );
        },
        aggregatedCell: ({ getValue }) => {
          const value = Number(getValue<number>() ?? 0);
          return <span className="font-medium text-slate-700">Avg: {value.toFixed(1)}%</span>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, columnId, filterValue) => {
          const active = (filterValue as StudentStatus[] | undefined) ?? [];
          if (!active.length) return true;
          return active.includes(row.getValue(columnId) as StudentStatus);
        },
        cell: ({ getValue }) => {
          const value = getValue<StudentStatus>();
          const style = statusBadgeStyles[value];
          return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
              {value}
            </span>
          );
        },
        enableGrouping: true,
        aggregationFn: "count",
        aggregatedCell: ({ getValue }) => (
          <span className="font-medium text-slate-700">{getValue<number>() ?? 0} Students</span>
        ),
      },
      {
        accessorKey: "absentDays",
        header: "Absences",
        aggregationFn: "mean",
        cell: ({ getValue }) => <span>{getValue<number>() ?? 0} days</span>,
        aggregatedCell: ({ getValue }) => (
          <span className="font-medium text-slate-700">Avg: {Number(getValue<number>() ?? 0).toFixed(1)} days</span>
        ),
      },
      {
        accessorKey: "enrollmentDate",
        header: "Enrolled",
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return <span>{dateFormatter.format(new Date(value))}</span>;
        },
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row, cell }) => {
          if (cell.getIsGrouped() || cell.getIsAggregated() || cell.getIsPlaceholder()) {
            return null;
          }
          return (
            <RowActionDropdown
              studentName={row.original.student}
              onAction={(action) => {
                console.info(`[table] ${action} action requested for`, row.original.student);
              }}
            />
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
        size: 56,
      },
    ],
    []
  );

  const [advancedSorting, setAdvancedSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    enrollmentDate: false,
    campus: false,
    advisor: false,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 30 });
  const [useVirtualRows, setUseVirtualRows] = useState(false);
  const [virtualScrollTop, setVirtualScrollTop] = useState(0);
  const virtualContainerRef = useRef<HTMLDivElement | null>(null);

  const table = useReactTable({
    data: advancedData,
    columns: advancedColumns,
    state: {
      sorting: advancedSorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      grouping,
      globalFilter,
      pagination,
    },
    onSortingChange: setAdvancedSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGroupingChange: setGrouping,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    enableRowSelection: (row) => !row.getIsGrouped(),
    getRowId: (row) => row.id,
    getRowCanExpand: () => true,
    globalFilterFn: globalTextFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const rowsForDisplay = useVirtualRows ? table.getRowModel().rows : table.getPaginationRowModel().rows;

  const virtualRowHeight = 56;
  const virtualContainerHeight = 360;
  const virtualBuffer = 6;
  const rowCount = rowsForDisplay.length;
  const startIndex = useVirtualRows
    ? Math.max(0, Math.floor(virtualScrollTop / virtualRowHeight) - virtualBuffer)
    : 0;
  const endIndex = useVirtualRows
    ? Math.min(rowCount, startIndex + Math.ceil(virtualContainerHeight / virtualRowHeight) + virtualBuffer * 2)
    : rowCount;
  const paddingTop = useVirtualRows ? startIndex * virtualRowHeight : 0;
  const paddingBottom = useVirtualRows ? Math.max(rowCount - endIndex, 0) * virtualRowHeight : 0;
  const visibleRows = useVirtualRows ? rowsForDisplay.slice(startIndex, endIndex) : rowsForDisplay;

  useEffect(() => {
    if (virtualContainerRef.current) {
      virtualContainerRef.current.scrollTop = 0;
    }
    setVirtualScrollTop(0);
    if (useVirtualRows) {
      setPagination((previous) => (previous.pageIndex === 0 ? previous : { ...previous, pageIndex: 0 }));
    }
  }, [useVirtualRows]);

  useEffect(() => {
    if (!useVirtualRows) return;
    if (virtualContainerRef.current) {
      virtualContainerRef.current.scrollTop = virtualScrollTop;
    }
  }, [useVirtualRows, virtualScrollTop]);

  useEffect(() => {
    if (!useVirtualRows) return;
    if (virtualContainerRef.current) {
      virtualContainerRef.current.scrollTop = 0;
    }
    setVirtualScrollTop(0);
  }, [useVirtualRows, globalFilter, columnFilters, grouping]);

  useEffect(() => {
    if (!useVirtualRows) return;
    const maxScroll = Math.max(rowCount * virtualRowHeight - virtualContainerHeight, 0);
    setVirtualScrollTop((current) => {
      if (current > maxScroll) {
        if (virtualContainerRef.current) {
          virtualContainerRef.current.scrollTop = maxScroll;
        }
        return maxScroll;
      }
      return current;
    });
  }, [useVirtualRows, rowCount, virtualRowHeight, virtualContainerHeight]);

  const statusFilterValue = (table.getColumn("status")?.getFilterValue() as StudentStatus[] | undefined) ?? [];
  const toggleStatusFilter = (status: StudentStatus) => {
    const column = table.getColumn("status");
    if (!column) return;
    const current = new Set(statusFilterValue);
    if (current.has(status)) {
      current.delete(status);
    } else {
      current.add(status);
    }
    const next = Array.from(current);
    column.setFilterValue(next.length ? next : undefined);
  };

  const columnsForVisibility = table.getAllLeafColumns().filter((column) => column.getCanHide());

  const selectedRowCount = table.getSelectedRowModel().rows.length;
  const filteredRowCount = table.getFilteredRowModel().rows.length;
  const tableStatePreview = useMemo(
    () => JSON.stringify(table.getState(), null, 2),
    [table, advancedSorting, columnFilters, columnVisibility, rowSelection, grouping, globalFilter, pagination]
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Student Performance Table</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-950 cursor-pointer">
              Print
            </Button>
            <Button size="lg" className="bg-rose-500 text-white hover:bg-rose-600 cursor-pointer">
              PDF
            </Button>
            <Button size="lg" className="bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer">
              XL
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-[220px] flex-1 flex-wrap items-center gap-3">
            <input
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder="Search students, advisors, classes, campus..."
              className="w-full max-w-sm flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 accent-slate-600"
                checked={useVirtualRows}
                onChange={(event) => setUseVirtualRows(event.target.checked)}
              />
              <span>Enable virtualization</span>
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <DropdownMenu
              widthClass="w-60"
              renderTrigger={({ open, toggle }) => (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggle}
                  className="min-w-[160px] justify-between text-slate-700"
                >
                  <span className="font-medium">Status Filters</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${open ? "-rotate-180" : ""}`} />
                </Button>
              )}
            >
              {() => (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Toggle status</p>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => {
                      const active = statusFilterValue.includes(status);
                      const style = statusBadgeStyles[status];
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => toggleStatusFilter(status)}
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition ${
                            active
                              ? `${style.bg} ${style.text} border-transparent`
                              : "border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
                    disabled={!statusFilterValue.length}
                  >
                    Clear status filters
                  </Button>
                </div>
              )}
            </DropdownMenu>
            <DropdownMenu
              widthClass="w-56"
              renderTrigger={({ open, toggle }) => (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggle}
                  className="min-w-[160px] justify-between text-slate-700"
                >
                  <span className="font-medium">Columns</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${open ? "-rotate-180" : ""}`} />
                </Button>
              )}
            >
              {() => (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Toggle visibility</p>
                  <div className="grid gap-2">
                    {columnsForVisibility.map((column) => {
                      const header = column.columnDef.header;
                      const label = typeof header === "string" ? header : column.id;
                      return (
                        <label key={column.id} className="flex items-center justify-between gap-2 text-sm text-slate-600">
                          <span>{label}</span>
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-slate-600"
                            checked={column.getIsVisible()}
                            onChange={column.getToggleVisibilityHandler()}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </DropdownMenu>
            <DropdownMenu
              widthClass="w-60"
              renderTrigger={({ open, toggle }) => (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggle}
                  className="min-w-[180px] justify-between text-slate-700"
                >
                  <span className="font-medium">Grouping &amp; aggregation</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${open ? "-rotate-180" : ""}`} />
                </Button>
              )}
            >
              {() => (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Choose columns</p>
                  <div className="grid gap-2">
                    {["status", "advisor", "classGroup", "campus"].map((columnId) => {
                      const column = table.getColumn(columnId);
                      const header = column?.columnDef.header;
                      const label = typeof header === "string" ? header : columnId;
                      const grouped = column?.getIsGrouped();
                      return (
                        <Button
                          key={columnId}
                          size="sm"
                          variant={grouped ? "default" : "outline"}
                          onClick={() => column?.toggleGrouping?.()}
                          className="justify-start"
                        >
                          {grouped ? "Grouped " : "Group "}
                          {label}
                        </Button>
                      );
                    })}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setGrouping([])} disabled={!grouping.length}>
                    Reset grouping
                  </Button>
                </div>
              )}
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200">
          <div
            ref={virtualContainerRef}
            className={`overflow-auto rounded-lg ${useVirtualRows ? "max-h-[360px]" : ""}`}
            onScroll={(event) => {
              if (useVirtualRows) setVirtualScrollTop(event.currentTarget.scrollTop);
            }}
          >
            <table className="w-full min-w-[900px] table-auto border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className={`flex items-center gap-2 ${header.column.getCanSort() ? "cursor-pointer select-none" : ""}`}
                          >
                            <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                            {header.column.getCanSort() && (
                              <span className="text-slate-400">
                                {header.column.getIsSorted() === "asc" && <ChevronUp className="h-4 w-4" />}
                                {header.column.getIsSorted() === "desc" && <ChevronDown className="h-4 w-4" />}
                                {!header.column.getIsSorted() && <ChevronUp className="h-4 w-4 opacity-20" />}
                              </span>
                            )}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {useVirtualRows && paddingTop > 0 && (
                  <tr>
                    <td colSpan={table.getVisibleLeafColumns().length} style={{ height: `${paddingTop}px` }} />
                  </tr>
                )}
                {visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-100 transition-colors ${
                      row.getIsSelected() ? "bg-slate-100/80" : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isGrouped = cell.getIsGrouped();
                      const isAggregated = cell.getIsAggregated();
                      const isPlaceholder = cell.getIsPlaceholder();

                      if (cell.column.id === "select") {
                        return (
                          <td key={cell.id} className="px-4 py-3 text-sm text-slate-700">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      }

                      if (cell.column.id === "actions") {
                        if (isGrouped || isAggregated || isPlaceholder) {
                          return <td key={cell.id} className="px-4 py-3" />;
                        }
                        return (
                          <td key={cell.id} className="px-4 py-3 text-right text-sm text-slate-700">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      }

                      if (isGrouped) {
                        return (
                          <td key={cell.id} className="px-4 py-3 text-sm font-semibold text-slate-800">
                            <button
                              type="button"
                              onClick={row.getToggleExpandedHandler()}
                              className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-600"
                            >
                              {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            <span className="ml-2 text-xs text-slate-500">({row.subRows.length})</span>
                          </td>
                        );
                      }

                      if (isAggregated) {
                        return (
                          <td key={cell.id} className="px-4 py-3 text-sm text-slate-600">
                            {flexRender(
                              cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      }

                      if (isPlaceholder) {
                        return <td key={cell.id} className="px-4 py-3" />;
                      }

                      return (
                        <td key={cell.id} className="px-4 py-3 text-sm text-slate-700">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {useVirtualRows && paddingBottom > 0 && (
                  <tr>
                    <td colSpan={table.getVisibleLeafColumns().length} style={{ height: `${paddingBottom}px` }} />
                  </tr>
                )}

                {!visibleRows.length && (
                  <tr>
                    <td colSpan={table.getVisibleLeafColumns().length} className="px-4 py-12 text-center text-sm text-slate-500">
                      No rows match the current state.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            {selectedRowCount} selected · {filteredRowCount} visible after filters
            {useVirtualRows ? " · virtualization on" : ` · page ${pagination.pageIndex + 1} of ${Math.max(table.getPageCount(), 1)}`}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || useVirtualRows}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || useVirtualRows}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || useVirtualRows}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || useVirtualRows}
            >
              Last
            </Button>
            <select
              className="rounded border border-slate-300 px-2 py-1 text-sm"
              value={pagination.pageSize}
              onChange={(event) => table.setPageSize(Number(event.target.value))}
              disabled={useVirtualRows}
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700">State management snapshot</p>
          <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-slate-950 px-4 py-3 text-xs text-slate-100 shadow-inner">
            {tableStatePreview}
          </pre>
        </div>
      </div>
    </div>
  );
}

type DropdownMenuProps = {
  renderTrigger: (props: { open: boolean; toggle: () => void; close: () => void }) => ReactNode;
  children: (props: { close: () => void }) => ReactNode;
  align?: "left" | "right";
  widthClass?: string;
};

function DropdownMenu({ renderTrigger, children, align = "right", widthClass = "min-w-[200px]" }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {renderTrigger({ open, toggle: () => setOpen((previous) => !previous), close: () => setOpen(false) })}
      {open ? (
        <div
          className={`absolute z-30 mt-2 ${widthClass} rounded-lg border border-slate-200 bg-white p-3 shadow-lg ${align === "right" ? "right-0" : "left-0"}`}
        >
          {children({ close: () => setOpen(false) })}
        </div>
      ) : null}
    </div>
  );
}

type RowAction = "view" | "edit" | "print" | "delete";

type RowActionDropdownProps = {
  studentName: string;
  onAction: (action: RowAction) => void;
};

function RowActionDropdown({ studentName, onAction }: RowActionDropdownProps) {
  const actionItems: Array<{ action: RowAction; label: string; icon: ReactNode }> = [
    { action: "view", label: "View", icon: <Eye className="h-4 w-4 text-slate-500" /> },
    { action: "edit", label: "Edit", icon: <Pencil className="h-4 w-4 text-slate-500" /> },
    { action: "print", label: "Print", icon: <Printer className="h-4 w-4 text-slate-500" /> },
    { action: "delete", label: "Delete", icon: <Trash2 className="h-4 w-4 text-rose-500" /> },
  ];

  return (
    <DropdownMenu
      widthClass="min-w-[160px]"
      renderTrigger={({ open, toggle }) => (
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              toggle();
            }}
            className={`w-full justify-between gap-2 rounded-md border-slate-200 px-3 py-2 text-xs font-medium uppercase tracking-wide ${open ? "bg-slate-100" : "bg-white hover:bg-slate-50"}`}
            aria-label={`Actions for ${studentName}`}
          >
            <span>Actions</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <div className="pointer-events-none absolute inset-0 rounded-md border  border-slate-200" aria-hidden="true" />
        </div>
      )}
    >
      {({ close }) => (
        <div className="grid gap-1">
          {actionItems.map((item) => (
            <button
              key={item.action}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                close();
                onAction(item.action);
              }}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </DropdownMenu>
  );
}
