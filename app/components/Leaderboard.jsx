"use client";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [projects, setProjects] = useState([]);
  const [timer, setTimer] = useState(86400); // 24h in seconds

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        if (data.success) setProjects(data.projects.sort((a,b)=>b.votes-a.votes).slice(0,2));
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t > 0 ? t-1 : 86400), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = async (id) => {
    await fetch(`/api/projects/vote?id=${id}`, { method: "POST" });
    setProjects(projects.map(p => p._id === id ? {...p, votes: p.votes+1} : p));
  };

  const formatTime = s => `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m ${s%60}s`;

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-2">Today's Top Coins</h2>
      <p className="mb-2">Next leaderboard reset in: {formatTime(timer)}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(p => (
          <div key={p._id} className="border rounded p-4 flex justify-between items-center">
            <span>{p.name} ({p.votes} votes)</span>
            <button className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600" onClick={()=>handleVote(p._id)}>Upvote</button>
          </div>
        ))}
      </div>
    </div>
  );
}
