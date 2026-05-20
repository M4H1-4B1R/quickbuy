"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useContent } from "@/stores/content";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const addSubscriber = useContent.getState().addSubscriber;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    addSubscriber(email.trim());
    toast.success("You're on the list!");
    setEmail("");
  };

  return (
    <section className="bg-ink py-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="font-display text-4xl uppercase text-canvas leading-none mb-2">
            Stay in the Loop
          </h2>
          <p className="text-stone text-sm">
            New drops, exclusive offers, and more.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-0 w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 md:w-72 h-11 px-4 bg-transparent border border-stone/40 text-canvas placeholder:text-stone text-sm focus:outline-none focus:border-canvas"
            required
          />
          <button
            type="submit"
            className="h-11 px-6 bg-canvas text-ink text-xs font-medium uppercase tracking-widest hover:bg-hairline-soft transition-colors shrink-0"
          >
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
}