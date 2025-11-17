"use client";
import { useEffect, useState } from "react";

export default function Timer({ initialSeconds }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s > 0 ? s-1 : initialSeconds), 1000);
    return () => clearInterval(interval);
  }, [initialSeconds]);

  const formatTime = s => `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m ${s%60}s`;

  return <span>{formatTime(seconds)}</span>;
}
