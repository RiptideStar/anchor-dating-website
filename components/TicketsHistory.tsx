"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { QRCodeSVG } from "qrcode.react";

interface Ticket {
  id: string;
  user_id?: string;
  payment_intent_id: string;
  created_at: string;
  status?: string | null;
  updated_at?: string | null;
}

interface TicketsHistoryProps {
  email: string;
  userId: string;
  eventId?: string;
  onBuyNew: () => void;
  onClose: () => void;
}

export default function TicketsHistory({
  email,
  userId,
  eventId,
  onBuyNew,
  onClose,
}: TicketsHistoryProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(() => Boolean(userId));
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const generateQRData = useCallback((paymentIntentId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/admin/scan/${paymentIntentId}`;
  }, []);

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        const accessToken = session?.access_token;
        return fetch("/api/get-events-tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            access_token: accessToken,
            event_id: eventId,
          }),
        });
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTickets(data.tickets || []);
        else toast.error(data.error || "Failed to load tickets");
      })
      .catch(() => toast.error("Failed to load tickets"))
      .finally(() => setLoading(false));
  }, [userId, eventId]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-2xl bg-white rounded-2xl my-8 mx-4 sm:mx-6 overflow-hidden font-dm-sans"
        initial={{ scale: 0.96, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div className="px-6 sm:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Your Tickets
            </h2>
            <button
              onClick={onClose}
              className="text-[#9E9891] hover:text-[#1A1A1A] transition-colors p-1 -m-1 rounded-full hover:bg-[#F3EFE8]"
              type="button"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {(email || userId) && (
            <p className="text-[#9E9891] text-sm mb-6">
              {email && (
                <>
                  Email: <span className="text-[#1A1A1A] font-medium">{email}</span>
                </>
              )}
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8E3DC] border-t-[#D4654A]"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#9E9891] mb-6">
                No tickets found
              </p>
              <motion.button
                onClick={onBuyNew}
                className="rounded-full bg-[#1A1A1A] px-8 py-3.5 text-sm font-semibold text-white hover:opacity-85 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Buy Your First Ticket
              </motion.button>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                {selectedTicket ? (
                  <motion.div
                    key="ticket-detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      className="flex items-center gap-2 text-[#6B6560] hover:text-[#1A1A1A] text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to tickets
                    </button>
                    <div className="rounded-2xl border border-[#E8E3DC] bg-white p-6 text-center">
                      <p className="text-[#9E9891] text-sm mb-1">Status</p>
                      <p className="text-emerald-600 font-semibold mb-5">Confirmed</p>
                      {selectedTicket.payment_intent_id && (
                        <div className="inline-flex p-4 bg-white rounded-xl border border-[#E8E3DC]">
                          <QRCodeSVG
                            value={generateQRData(selectedTicket.payment_intent_id)}
                            size={200}
                            level="M"
                            fgColor="#1A1A1A"
                            bgColor="#ffffff"
                          />
                        </div>
                      )}
                      <p className="text-[#6B6560] text-xs mt-4 font-medium">
                        Ticket #{selectedTicket.payment_intent_id?.slice(-8) || "—"}
                      </p>
                      <p className="text-[#9E9891] text-xs mt-1">
                        {selectedTicket.created_at
                          ? new Date(selectedTicket.created_at).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ticket-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3 mb-6"
                  >
                    {tickets.map((ticket, index) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        onClick={() => setSelectedTicket(ticket)}
                        className="rounded-xl border border-[#E8E3DC] bg-white/60 p-4 cursor-pointer transition-all hover:border-[#D4654A]/40 hover:bg-[#F3EFE8]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1A1A1A] text-sm mb-1">
                              Ticket #{ticket.payment_intent_id?.slice(-8) || ticket.id?.slice(0, 8) || "—"}
                            </p>
                            <p className="text-[#9E9891] text-xs mb-1">
                              Purchased: {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "—"}
                            </p>
                            <p className="text-emerald-600 text-xs font-medium mb-1">Confirmed</p>
                            <p className="text-[#9E9891] text-xs">Tap to view QR code</p>
                          </div>
                          <svg className="w-5 h-5 text-[#9E9891] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {!selectedTicket && (
                <motion.button
                  type="button"
                  onClick={onBuyNew}
                  className="w-full rounded-full bg-[#1A1A1A] px-6 py-3.5 text-sm font-semibold text-white hover:opacity-85 transition-all"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Buy New Ticket
                </motion.button>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
