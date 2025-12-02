import { ReactNode } from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
};

interface TableProps<T> {
  columns: Column<T>[];
  data?: T[];
  emptyMessage?: string;
}

export function Table<T>({ columns, data, emptyMessage = "Nenhum registro" }: TableProps<T>) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-muted-foreground px-4 py-3">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-border rounded-lg text-sm">
        <thead className="bg-[color:var(--muted)]/40 text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column.header} className="text-left px-4 py-3 font-semibold border-b border-border">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="odd:bg-card even:bg-card/70 border-b border-border/60">
              {columns.map((column) => (
                <td key={column.header} className="px-4 py-3 text-card-foreground">
                  {typeof column.accessor === "function" ? column.accessor(row) : String(row[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
