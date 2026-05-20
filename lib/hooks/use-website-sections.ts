import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WebsiteSection } from "@/lib/shopbot.types";

async function fetchWebsiteSections(): Promise<WebsiteSection[]> {
  const res = await fetch("/api/website-sections");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export function useWebsiteSections() {
  return useQuery({
    queryKey: ["websiteSections"],
    queryFn: fetchWebsiteSections,
  });
}

export function useUpdateWebsiteSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WebsiteSection> }) =>
      fetch(`/api/website-sections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websiteSections"] });
    },
  });
}