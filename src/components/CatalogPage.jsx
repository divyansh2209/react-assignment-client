// client/src/pages/CatalogPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = '';

export default function CatalogPage() {
    const nav = useNavigate();
    const [meta, setMeta] = useState({ columns: [], count: 0, idField: '_id' });
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [q, setQ] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortDir, setSortDir] = useState('asc');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/metadata`)
            .then((r) => r.json())
            .then(setMeta)
            .catch((err) => {
                console.error('metadata error', err);
                setMeta({ columns: [], count: 0 });
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize),
            q,
            sortBy,
            sortDir,
        });
        fetch(`/api/items?${params.toString()}`)
            .then((r) => r.json())
            .then((data) => {
                console.log('fetched items', data);
                setItems(data);
            })
            .catch((err) => {
                console.error('items fetch error', err);
                setItems([]);
            })
            .finally(() => setLoading(false));
    }, [page, pageSize, q, sortBy, sortDir]);

    // Only show these columns on Catalog page: A,B,C,E,H,I,J
    const visibleColumns = useMemo(() => ['Id', 'Approval Workflow', 'BA ID', 'Domain/Bus Function', 'Approver BSO Name' ,'Approver BSO Signed DT', 'Approver Data Steward'], []);

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Catalog</h1>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <input
                    placeholder="Search..."
                    value={q}
                    onChange={(e) => {
                        setPage(1);
                        setQ(e.target.value);
                    }}
                    style={{ padding: 8, border: '1px solid #e5e7eb', borderRadius: 6 }}
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: 8 }}
                >
                    <option value="">Sort by...</option>
                    {visibleColumns.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                <select
                    value={sortDir}
                    onChange={(e) => setSortDir(e.target.value)}
                    style={{ padding: 8 }}
                >
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>

                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPage(1);
                        setPageSize(parseInt(e.target.value, 10));
                    }}
                    style={{ padding: 8 }}
                >
                    {[10, 20, 50, 100].map((s) => (
                        <option key={s} value={s}>
                            {s} / page
                        </option>
                    ))}
                </select>

                <button
                    onClick={() =>
                        fetch(`/api/reload`, { method: 'POST' })
                            .then(() => window.location.reload())
                            .catch((err) => console.error('reload error', err))
                    }
                    style={{ padding: '8px 12px' }}
                >
                    Reload Excel
                </button>
            </div>

            {loading ? (
                <div>Loading…</div>
            ) : (
                <DataTable
                    items={items}
                    columns={visibleColumns}
                    onRowClick={(row) => nav(`/item/${encodeURIComponent(row._id)}`)}
                />
            )}

            <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    Prev
                </button>
                <span>Page {page}</span>
                <button onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
        </div>
    );
}

/** Simple DataTable used by CatalogPage */
function DataTable({ items, columns, onRowClick }) {
    return (
        <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f9fafb' }}>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col}
                                style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ padding: 12 }}>
                                No rows found.
                            </td>
                        </tr>
                    ) : (
                        items.map((row) => (
                            <tr
                                key={row._id}
                                style={{ cursor: 'pointer' }}
                                onClick={() => onRowClick(row)}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col}
                                        style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}
                                    >
                                        {String(row[col] ?? '')}
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
