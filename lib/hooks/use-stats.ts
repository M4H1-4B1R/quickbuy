import { useQuery } from "@tanstack/react-query";
import { DashboardStats } from "@/lib/shopbot.types";

async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch("/api/stats");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });
}