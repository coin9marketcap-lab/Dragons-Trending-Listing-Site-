"use client";
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

export default function PremiumSlider() {
  const [premiumProjects, setPremiumProjects] = useState([]);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        if (data.success) setPremiumProjects(data.projects.filter(p => p.premium && p.status === "approved"));
      });
  }, []);

  return (
    <div className="overflow-x-auto whitespace-nowrap py-4">
      {premiumProjects.map(p => (
        <span key={p._id} className="inline-block mr-4">
          <ProjectCard project={p} />
        </span>
      ))}
    </div>
  );
}
