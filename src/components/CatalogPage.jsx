import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CatalogPage() {
    const nav = useNavigate();
    const [meta, setMeta] = useState({ columns: [], count: 0, idField: "_id" });
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [q, setQ] = useState("");
    const [sortDir, setSortDir] = useState("asc");
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetch(`/api/metadata`)
            .then((r) => r.json())
            .then((m) => setMeta(m))
            .catch(() => setMeta({ columns: [], count: 0 }));
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize),
            q,
            sortBy: meta.idField,
            sortDir,
        });
        fetch(`/api/items?${params.toString()}`)
            .then((r) => {
                const total = r.headers.get("X-Total-Count");
                if (total) setTotalCount(parseInt(total, 10));
                return r.json();
            })
            .then((data) => setItems(data || []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, [page, pageSize, q, sortDir, meta.idField]);

    const visibleColumns = useMemo(
        () => [
            "Id",
            "Approval Workflow",
            "BA ID",
            "Domain/Bus Function",
            "Approver BSO Name",
            "Approver BSO Signed DT",
            "Approver Data Steward",
        ],
        []
    );

    const toggleSort = () => {
        setPage(1);
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    };

    return (
        <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 20 }}>Catalog</h1>

            {/* Controls */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
                <input
                    placeholder="Search..."
                    value={q}
                    onChange={(e) => {
                        setPage(1);
                        setQ(e.target.value);
                    }}
                    style={{
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                        flex: "1 1 200px",
                        outline: "none",
                    }}
                />

                {/* Toggle sort on ID */}
                <button
                    onClick={toggleSort}
                    style={{
                        padding: "8px 14px",
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                        background: "#fff",
                        cursor: "pointer",
                    }}
                >
                    Sort by ID ({sortDir})
                </button>

                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPage(1);
                        setPageSize(parseInt(e.target.value, 10));
                    }}
                    style={{ padding: "8px 12px", borderRadius: 6 }}
                >
                    {[10, 20, 50, 100].map((s) => (
                        <option key={s} value={s}>
                            {s} / page
                        </option>
                    ))}
                </select>

                <button
                    onClick={() =>
                        fetch(`/api/reload`, { method: "POST" })
                            .then(() => window.location.reload())
                            .catch((err) => console.error("reload error", err))
                    }
                    style={{
                        padding: "8px 14px",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                    }}
                >
                    Reload Excel
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ padding: 20 }}>Loading…</div>
            ) : (
                <DataTable
                    items={items}
                    columns={visibleColumns}
                    onRowClick={(row) => nav(`/item/${encodeURIComponent(row._id)}`)}
                />
            )}

            {/* Pagination */}
            <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    style={{
                        padding: "6px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                        background: page === 1 ? "#f3f4f6" : "#fff",
                        cursor: page === 1 ? "not-allowed" : "pointer",
                    }}
                >
                    Prev
                </button>

                <span style={{ fontWeight: 500 }}>
                    Page {page} {totalCount > 0 ? `· ${totalCount} results` : ""}
                </span>

                <button
                    disabled={page * pageSize >= totalCount}
                    onClick={() => setPage((p) => p + 1)}
                    style={{
                        padding: "6px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                        background: page * pageSize >= totalCount ? "#f3f4f6" : "#fff",
                        cursor: page * pageSize >= totalCount ? "not-allowed" : "pointer",
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

/** DataTable (same design, no changes) */
function DataTable({ items, columns, onRowClick }) {
    return (
        <div
            style={{
                overflowX: "auto",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                animation: "fadeIn 0.5s ease-in",
            }}
        >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#f9fafb", position: "sticky", top: 0 }}>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col}
                                style={{
                                    textAlign: "left",
                                    padding: "10px 12px",
                                    borderBottom: "1px solid #e5e7eb",
                                    fontSize: "14px",
                                    color: "#374151",
                                }}
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ padding: 16, textAlign: "center" }}>
                                No rows found.
                            </td>
                        </tr>
                    ) : (
                        items.map((row, idx) => (
                            <tr
                                key={row._id}
                                style={{
                                    cursor: "pointer",
                                    background: idx % 2 === 0 ? "#fff" : "#f9fafb",
                                    transition: "background 0.2s",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.background = "#e0f2fe")}
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.background =
                                        idx % 2 === 0 ? "#fff" : "#f9fafb")
                                }
                                onClick={() => onRowClick(row)}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col}
                                        style={{
                                            padding: "10px 12px",
                                            borderBottom: "1px solid #f1f5f9",
                                            fontSize: "14px",
                                            color: "#111827",
                                        }}
                                    >
                                        {String(row[col] ?? "—")}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
