import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NewsletterSubscriber } from "@/lib/shopbot.types";

async function fetchNewsletters(): Promise<NewsletterSubscriber[]> {
  const res = await fetch("/api/newsletters");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export function useNewsletters() {
  return useQuery({
    queryKey: ["newsletters"],
    queryFn: fetchNewsletters,
  });
}

export function useAddSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) =>
      fetch("/api/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletters"] });
    },
  });
}