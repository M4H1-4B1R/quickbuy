import { useQuery } from "@tanstack/react-query";
import { SalesAnalytics } from "@/lib/shopbot.types";

async function fetchAnalytics(period: string): Promise<SalesAnalytics> {
  const res = await fetch(`/api/analytics?period=${period}`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export function useAnalytics(period: string = "week") {
  return useQuery({
    queryKey: ["analytics", period],
    queryFn: () => fetchAnalytics(period),
  });
}