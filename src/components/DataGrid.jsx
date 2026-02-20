import { useState, useEffect } from "react";

export function DataGrid({ columns, data, actions, emptyMessage, rowClassName }) {
  const [filters, setFilters] = useState({});
  const [sortCfg, setSortCfg] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => { setPage(1); }, [filters, data.length]);

  const filtered = data.filter((item) =>
    columns.every((col) => {
      const f = filters[col.key];
      if (!f) return true;
      const v = col.filterValue ? col.filterValue(item) : String(item[col.key] || "");
      return v.toLowerCase().includes(f.toLowerCase());
    })
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortCfg.key) return 0;
    const col = columns.find((c) => c.key === sortCfg.key);
    const av = col?.sortValue ? col.sortValue(a) : (a[sortCfg.key] ?? "");
    const bv = col?.sortValue ? col.sortValue(b) : (b[sortCfg.key] ?? "");
    if (av < bv) return sortCfg.dir === "asc" ? -1 : 1;
    if (av > bv) return sortCfg.dir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const rows = sorted.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100"
                  onClick={() => setSortCfg((p) => ({ key: col.key, dir: p.key === col.key && p.dir === "asc" ? "desc" : "asc" }))}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortCfg.key === col.key && (
                      <span className="text-gray-400">{sortCfg.dir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </span>
                </th>
              ))}
              {actions && (
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              )}
            </tr>
            <tr className="border-b">
              {columns.map((col) => (
                <th key={col.key} className="px-3 py-1">
                  {col.filterable !== false && (
                    <input
                      type="text"
                      placeholder="Filtrar..."
                      value={filters[col.key] || ""}
                      onChange={(e) => setFilters((p) => ({ ...p, [col.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs font-normal text-gray-600 focus:ring-1 focus:ring-gray-300 outline-none"
                    />
                  )}
                </th>
              ))}
              {actions && <th className="px-3 py-1" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-3 py-8 text-center text-gray-400">
                  {emptyMessage || "Nenhum registro."}
                </td>
              </tr>
            ) : (
              rows.map((item, i) => (
                <tr key={item.id || i} className={`hover:bg-gray-50 ${rowClassName ? rowClassName(item) : ""}`}>
                  {columns.map((col) => (
                    <td key={col.key} className={`px-3 py-2 ${col.className || ""}`}>
                      {col.render ? col.render(item) : (item[col.key] ?? "-")}
                    </td>
                  ))}
                  {actions && <td className="px-3 py-2 whitespace-nowrap">{actions(item)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-3 py-1.5 border-t bg-gray-50 text-xs text-gray-500">
        <span>{sorted.length} registro(s)</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(1)} disabled={page <= 1} className="px-1.5 py-0.5 rounded hover:bg-gray-200 disabled:opacity-30">«</button>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-1.5 py-0.5 rounded hover:bg-gray-200 disabled:opacity-30">‹</button>
          <span className="px-2">{page}/{totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-1.5 py-0.5 rounded hover:bg-gray-200 disabled:opacity-30">›</button>
          <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} className="px-1.5 py-0.5 rounded hover:bg-gray-200 disabled:opacity-30">»</button>
        </div>
      </div>
    </div>
  );
}
