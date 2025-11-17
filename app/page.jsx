"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProjectCard from "./components/ProjectCard";
import PremiumSlider from "./components/PremiumSlider";
import Leaderboard from "./components/Leaderboard";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) setProjects(data.projects);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Dragons Trending Memecoins</h1>

        {/* Premium Slider */}
        {projects.length > 0 && <PremiumSlider projects={projects} />}

        {/* Leaderboard */}
        {projects.length > 0 && <Leaderboard projects={projects} />}

        {/* All Projects */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">All Projects</h2>
          {loading ? (
            <p>Loading projects...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {projects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
    }
