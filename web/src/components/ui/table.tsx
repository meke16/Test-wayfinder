import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, Book, Pen } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  // CardAction,
} from "@/components/ui/card";

export type EventType = "class" | "exam" | "grade" | "attendance" | "general";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  emptyText?: string;
  onRowClick?: (row: TData) => void;
  eventTypeKey?: keyof TData;
}

export function DataTable<TData>({
  columns,
  data,
  title,
  description,
  isLoading = false,
  emptyText = "No data available",
  onRowClick,
  eventTypeKey,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const eventColor = (type: EventType) => {
    switch (type) {
      case "class":
        return "bg-blue-100 text-blue-800";
      case "exam":
        return "bg-red-100 text-red-800";
      case "grade":
        return "bg-green-100 text-green-800";
      case "attendance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const eventIcon = (type: EventType) => {
    switch (type) {
      case "class":
        return <Book className="h-4 w-4" />;
      case "exam":
        return <Pen className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-lg border border-gray-100">
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      "text-left px-4 py-3 font-semibold text-gray-700 cursor-pointer select-none",
                      header.column.getCanSort() &&
                        "hover:bg-gray-100 rounded-md transition-all"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span
                          className={cn(
                            "flex items-center transition-transform duration-200",
                            header.column.getIsSorted() ? "rotate-180" : ""
                          )}
                        >
                          {header.column.getIsSorted() === "asc" && (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          )}
                          {header.column.getIsSorted() === "desc" && (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                          {!header.column.getIsSorted() && (
                            <ChevronUp className="h-4 w-4 text-gray-300" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, idx) => {
                const eventType =
                  (eventTypeKey && (row.original as any)[eventTypeKey]) as EventType | undefined;

                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50",
                      "hover:shadow-md transition-shadow cursor-pointer"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-gray-800">
                        {eventType ? (
                          <div
                            className={cn(
                              "inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm font-semibold",
                              eventColor(eventType)
                            )}
                          >
                            {eventIcon(eventType)}
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-gray-400">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
 // sample for test by the TANEF team

//  import type { ColumnDef } from '@tanstack/react-table';
//  import { DataTable, type EventType } from '@/components/ui/table';

//  type Student = {
//    name: string;
//    subject: string;
//    score: number;
//  };
//  type Schedule = {
//    subject: string;
//    teacher: string;
//    startTime: string;
//    endTime: string;
//    type: EventType; // <-- use EventType here
//  };

//  const columns: ColumnDef<Schedule>[] = [
//    { accessorKey: "subject", header: "Subject" },
//    { accessorKey: "teacher", header: "Teacher" },
//    { accessorKey: "startTime", header: "Start Time" },
//    { accessorKey: "endTime", header: "End Time" },
//  ];

//  export default function StudentsPage() {
//    return (
//      <div className="p-6">
//        <DataTable<Schedule>
//    title="Class Schedule"
//    description="Weekly overview of classes and exams"
//    columns={columns}
//    data={[
//      { subject: "Math", teacher: "Mr. John", startTime: "08:00", endTime: "09:00", type: "class" },
//      { subject: "Physics Exam", teacher: "Mrs. Smith", startTime: "09:30", endTime: "11:00", type: "exam" },
//      { subject: "Biology", teacher: "Ali Hassan", startTime: "11:15", endTime: "12:15", type: "class" },
//    ]}
//    eventTypeKey="type"
//  />
//      </div>
//    );
//  }
