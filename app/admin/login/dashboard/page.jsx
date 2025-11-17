"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txids, setTxids] = useState({});
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => {
    if (!token) router.push("/admin/login");
    else fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        const pending = data.projects.filter(
          (p) => p.status === "pending_admin" || p.status === "pending_payment"
        );
        setProjects(pending);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, action, isPremium = false) => {
    try {
      if (isPremium && action === "approve") {
        const txid = txids[id];
        if (!txid) return alert("Enter TXID for premium project");
        const res = await fetch("/api/projects/verify-txid", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ projectId: id, txid }),
        });
        const data = await res.json();
        if (!data.success) return alert(data.error);
      } else {
        const res = await fetch(`/api/admin/projects/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ action }),
        });
        const data = await res.json();
        if (!data.success) return alert(data.error);
      }
      fetchProjects();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {loading ? <p>Loading pending projects...</p> : projects.length === 0 ? <p>No pending projects.</p> :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div key={p._id} className="border rounded p-4 shadow flex flex-col">
                {p.premium && <span className="bg-yellow-400 text-black px-2 py-1 rounded font-bold mb-2 inline-block">👑 Premium</span>}
                <img src={p.logoBase64} alt={p.name} className="w-16 h-16 mb-2 rounded" />
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-gray-700 text-sm mb-1">{p.symbol}</p>
                <p className="text-gray-600 text-sm mb-2">{p.description}</p>
                {p.premium && p.status === "pending_payment" &&
                  <input type="text" placeholder="Enter TXID" value={txids[p._id] || ""}
                    onChange={(e) => setTxids({ ...txids, [p._id]: e.target.value })}
                    className="border rounded px-2 py-1 mb-2 text-black" />}
                <div className="mt-auto flex gap-2">
                  <button className="bg-green-500 px-3 py-1 rounded hover:bg-green-600" onClick={() => handleAction(p._id, "approve", p.premium)}>Approve</button>
                  <button className="bg-red-500 px-3 py-1 rounded hover:bg-red-600" onClick={() => handleAction(p._id, "reject")}>Reject</button>
                </div>
              </div>
            ))}
          </div>}
      </main>
      <Footer />
    </div>
  );
    }
