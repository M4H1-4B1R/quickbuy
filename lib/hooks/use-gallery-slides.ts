import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SwiperSlide } from "@/lib/shopbot.types";

async function fetchGallerySlides(): Promise<SwiperSlide[]> {
  const res = await fetch("/api/gallery-slides");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export function useGallerySlides() {
  return useQuery({
    queryKey: ["gallerySlides"],
    queryFn: fetchGallerySlides,
  });
}

export function useCreateGallerySlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SwiperSlide>) =>
      fetch("/api/gallery-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallerySlides"] });
    },
  });
}

export function useUpdateGallerySlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SwiperSlide> }) =>
      fetch(`/api/gallery-slides/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallerySlides"] });
    },
  });
}

export function useDeleteGallerySlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/gallery-slides/${id}`, { method: "DELETE" }).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallerySlides"] });
    },
  });
}