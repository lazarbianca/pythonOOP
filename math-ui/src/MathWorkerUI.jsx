import React, { useState, useCallback } from "react";

/*
  Layout: titlu deasupra cardurilor, totul centrat pe pagină.
  Cardurile sunt alăturate, se înfășoară dacă spațiul nu permite.
*/

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function submitJob(path, payload) {
  const r = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(`API error: ${r.status}`);
  const { job_id } = await r.json();
  const poll = async (tries = 0) => {
    const resp = await fetch(`${API_BASE}/job/${job_id}`);
    if (!resp.ok) throw new Error(`Job ${job_id} error: ${resp.status}`);
    const data = await resp.json();
    if (data.result === null) {
      if (tries > 30) throw new Error("Timeout");
      await new Promise((s) => setTimeout(s, 500));
      return poll(tries + 1);
    }
    return data.result;
  };
  return poll();
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #e0e0e0",
  borderRadius: 10,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  padding: 20,
  width: 280,
  boxSizing: "border-box"
};

const inputStyle = {
  width: "100%",
  padding: "6px 8px",
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: 14,
  boxSizing: "border-box"
};

const buttonStyle = {
  padding: "8px 14px",
  background: "#1464e4",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 14,
  minWidth: 100
};

function Box({ title, children }) {
  return (
    <div style={cardStyle}>
      <h2 style={{ marginTop: 0, fontSize: 18, marginBottom: 12 }}>{title}</h2>
      {children}
    </div>
  );
}

function PowForm() {
  const [base, setBase] = useState("2");
  const [exp, setExp] = useState("8");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const onSubmit = useCallback(async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await submitJob("/pow", { base: Number(base), exponent: Number(exp) });
      setResult(res);
    } catch (e) {
      setResult(e.message);
    } finally {
      setLoading(false);
    }
  }, [base, exp]);
  return (
    <Box title="Putere (b^e)">
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input value={base} onChange={(e) => setBase(e.target.value)} placeholder="baza" style={{ ...inputStyle, flex: 1 }} />
        <input value={exp} onChange={(e) => setExp(e.target.value)} placeholder="exp" style={{ ...inputStyle, flex: 1 }} />
      </div>
      <button onClick={onSubmit} disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.6 : 1 }}>
        {loading ? "Calcul..." : "Calculează"}
      </button>
      {result !== null && <p style={{ marginTop: 12 }}>Rezultat: {result}</p>}
    </Box>
  );
}

function FactorialForm() {
  const [n, setN] = useState("5");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const onSubmit = useCallback(async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await submitJob("/factorial", { number: Number(n) });
      setResult(res);
    } catch (e) {
      setResult(e.message);
    } finally {
      setLoading(false);
    }
  }, [n]);
  return (
    <Box title="Factorial (n!)">
      <input value={n} onChange={(e) => setN(e.target.value)} placeholder="n" style={{ ...inputStyle, marginBottom: 12 }} />
      <button onClick={onSubmit} disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.6 : 1 }}>
        {loading ? "Calcul..." : "Calculează"}
      </button>
      {result !== null && <p style={{ marginTop: 12 }}>Rezultat: {result}</p>}
    </Box>
  );
}

function FibonacciForm() {
  const [n, setN] = useState("10");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const onSubmit = useCallback(async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await submitJob("/fibonacci", { number: Number(n) });
      setResult(res);
    } catch (e) {
      setResult(e.message);
    } finally {
      setLoading(false);
    }
  }, [n]);
  return (
    <Box title="Fibonacci (n)">
      <input value={n} onChange={(e) => setN(e.target.value)} placeholder="n" style={{ ...inputStyle, marginBottom: 12 }} />
      <button onClick={onSubmit} disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.6 : 1 }}>
        {loading ? "Calcul..." : "Calculează"}
      </button>
      {result !== null && <p style={{ marginTop: 12 }}>Rezultat: {result}</p>}
    </Box>
  );
}

export default function MathWorkerUI() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f5f6fa", display: "flex", flexDirection: "column", alignItems: "center", padding: 32, boxSizing: "border-box" }}>
      {/* Titlu */}
      <h1 style={{ fontSize: 32, margin: "0 0 32px", textAlign: "center" }}>Math Worker</h1>

      {/* Carduri alăturate */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
        <PowForm />
        <FactorialForm />
        <FibonacciForm />
      </div>

      {/* Info backend */}
      <p style={{ marginTop: 40, fontSize: 12, color: "#666" }}>Backend: {API_BASE}</p>
    </div>
  );
}

