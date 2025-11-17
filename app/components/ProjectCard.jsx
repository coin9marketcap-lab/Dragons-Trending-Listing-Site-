export default function ProjectCard({ project }) {
  return (
    <div className="border rounded p-4 shadow flex flex-col">
      {project.premium && <span className="bg-yellow-400 text-black px-2 py-1 rounded font-bold mb-2 inline-block">👑 Premium</span>}
      <img src={project.logoBase64} alt={project.name} className="w-16 h-16 mb-2 rounded" />
      <h3 className="font-bold text-lg">{project.name}</h3>
      <p className="text-gray-700 text-sm mb-1">{project.symbol}</p>
      <p className="text-gray-600 text-sm mb-2">{project.description}</p>
    </div>
  );
}
