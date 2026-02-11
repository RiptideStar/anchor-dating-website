"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface EmailEntryFormProps {
  onSuccess: (
    email: string,
    userId: string,
    name?: string,
    phone?: string,
    isAdmin?: boolean,
  ) => void;
  onCancel: () => void;
  title?: string;
}

export default function EmailEntryForm({
  onSuccess,
  onCancel,
  title = "Enter Your Email",
}: EmailEntryFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/events-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.error || "Failed to process email");
        return;
      }

      toast.success(
        data.isNewUser ? "Welcome! Account created." : "Welcome back!",
      );
      onSuccess(data.user.email, data.user.id, data.user.name || name, phone, data.user.is_admin);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 font-dm-sans"
        initial={{ scale: 0.96, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-2">
            {title}
          </h2>
          <p className="text-[#9E9891] text-sm">
            Enter your email to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#1A1A1A]">
              Email <span className="text-[#D4654A]">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-[#E8E3DC] bg-white px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#9E9891] focus:border-[#D4654A] focus:outline-none focus:ring-2 focus:ring-[#D4654A]/20 transition-all"
              placeholder="Enter your email"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#1A1A1A]">
              Name <span className="text-[#9E9891] font-normal">(Optional)</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#E8E3DC] bg-white px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#9E9891] focus:border-[#D4654A] focus:outline-none focus:ring-2 focus:ring-[#D4654A]/20 transition-all"
              placeholder="Enter your name"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-[#1A1A1A]">
              Phone Number <span className="text-[#9E9891] font-normal">(Optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-[#E8E3DC] bg-white px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#9E9891] focus:border-[#D4654A] focus:outline-none focus:ring-2 focus:ring-[#D4654A]/20 transition-all"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <motion.button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-full border border-[#E8E3DC] bg-[#F3EFE8] px-4 py-3 text-sm font-semibold text-[#6B6560] hover:bg-[#E8E3DC] hover:text-[#1A1A1A] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-[#1A1A1A] px-4 py-3 text-sm font-semibold text-white hover:opacity-85 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? "Processing..." : "Continue"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
