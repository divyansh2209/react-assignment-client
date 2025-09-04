import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';


const API = '';


export default function DetailPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [notFound, setNotFound] = useState(false);


    useEffect(() => {
        setNotFound(false);
        fetch(`/api/items/${encodeURIComponent(id)}`)
            .then(async r => {
                if (!r.ok) throw new Error(await r.text());
                return r.json();
            })
            .then(setItem)
            .catch(() => setNotFound(true));
    }, [id]);


    if (notFound) return (
        <div>
            <p>Item not found.</p>
            <Link to="/">Back</Link>
        </div>
    );


    if (!item) return <div>Loading…</div>;


    // Only show these columns on Detail page: A,C,D,F,AF,AL,AZ,BJ
    const detailColumns = ["Id", "BA ID", "App Name", "App Data Class", "Description", "Data Custodian Notifier Name", "Data Sourced from (To build the Data Asset)", "Additional Comments Blob"];


    return (
        <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: 12 }}>&larr; Back to Catalog</Link>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Details: {item._id}</h1>


            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                {detailColumns.map((key) => (
                    <div key={key} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{key}</div>
                        <div style={{ fontWeight: 600 }}>{String(item[key] ?? '')}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}