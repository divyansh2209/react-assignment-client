import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function DetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setNotFound(false);
    fetch(`/api/items/${encodeURIComponent(id)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then(setItem)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound)
    return (
      <div style={{ padding: "20px" }}>
        <p style={{ color: "red", fontWeight: "500", marginBottom: "10px" }}>
          Item not found.
        </p>
        <Link to="/" style={{ color: "#2563eb", textDecoration: "underline" }}>
          &larr; Back
        </Link>
      </div>
    );

  if (!item) return <div style={{ padding: "20px" }}>Loading…</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginBottom: "16px",
          color: "#2563eb",
          textDecoration: "none",
          fontWeight: "500",
        }}
        onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        &larr; Back to Catalog
      </Link>

      <h1
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "24px",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "8px",
        }}
      >
        Details: {item._id}
      </h1>

      {/* Row 1: ID, BAID, App Name, App Data Class */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <DetailCard label="ID" value={item["Id"]} />
        <DetailCard label="BA ID" value={item["BA ID"]} />
        <DetailCard label="App Name" value={item["App Name"]} />
        <DetailCard label="App Data Class" value={item["App Data Class"]} />
      </div>

      {/* Full-width fields */}
      <DetailBlock label="Description" value={item["Description"]} />
      <DetailBlock
        label="Data Custodian Notifier Name"
        value={item["Data Custodian Notifier Name"]}
      />
      <DetailBlock
        label="Data Sourced From (To build the Data Asset)"
        value={item["Data Sourced from (To build the Data Asset)"]}
      />
      <DetailBlock
        label="Additional Comments"
        value={item["Additional Comments Blob"]}
      />
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "14px",
        backgroundColor: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.12)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
      }}
    >
      <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
        {label}
      </div>
      <div style={{ fontWeight: "600", color: "#111827" }}>
        {value || "—"}
      </div>
    </div>
  );
}

function DetailBlock({ label, value }) {
  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        backgroundColor: "#f9fafb",
      }}
    >
      <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "6px" }}>
        {label}
      </div>
      <div style={{ fontSize: "15px", color: "#111827", whiteSpace: "pre-line" }}>
        {value || "—"}
      </div>
    </div>
  );
}
