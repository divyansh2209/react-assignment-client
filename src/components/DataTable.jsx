import { useMemo } from 'react';


export default function DataTable({ items, columns, onRowClick }) {
    const visibleColumns = useMemo(() => {
    // Show up to first 5 non-_id columns by default
    const cols = columns.filter(c => c !== '_id');
    return ['_id', ...cols.slice(0, 4)];
}, [columns]);


return (
    <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
                <tr>
                    {visibleColumns.map(col => (
                    <th key={col} style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>{col}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {items.map(row => (
                    <tr key={row._id} style={{ cursor: 'pointer' }} onClick={() => onRowClick(row)}>
                    {visibleColumns.map(col => (
                        <td key={col} style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{String(row[col] ?? '')}</td>
                    ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
}