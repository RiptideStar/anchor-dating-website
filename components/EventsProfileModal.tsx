"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import PhoneOTPForm from "./PhoneOTPForm";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { createClient } from "@/lib/supabase/client";

export interface EventsTicket {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  payment_intent_id: string;
  ticket_purchased_at?: string;
  created_at: string;
}

interface EventsProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  userName: string;
  userId: string;
  onLoginSuccess: (identifier: string, id: string, name?: string, isAdmin?: boolean, authUserId?: string) => void;
  onLogout: () => void;
}

export default function EventsProfileModal({
  isOpen,
  onClose,
  isLoggedIn,
  userName,
  userId,
  onLoginSuccess,
  onLogout,
}: EventsProfileModalProps) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<EventsTicket | null>(null);
  const [qrData, setQrData] = useState("");
  const { signOut: supabaseSignOut } = useSupabaseAuth();

  const generateQRData = useCallback((paymentIntentId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/admin/scan/${paymentIntentId}`;
  }, []);

  const handleTicketClick = (ticket: EventsTicket) => {
    setQrData(generateQRData(ticket.payment_intent_id));
    setSelectedTicket(ticket);
  };

  const handleLogout = async () => {
    try {
      await supabaseSignOut();
      onLogout();
      setShowLoginForm(false);
      setSelectedTicket(null);
      onClose();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleLoginSuccess = (
    identifier: string,
    id: string,
    name?: string,
    isAdmin?: boolean,
    authUserId?: string,
  ) => {
    onLoginSuccess(identifier, id, name, isAdmin, authUserId);
    setShowLoginForm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl font-dm-sans"
        initial={{ scale: 0.96, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[#E8E3DC] bg-white rounded-t-2xl">
          <h2 className="font-playfair text-xl font-bold text-[#1A1A1A]">
            {showLoginForm ? "Log in" : "Account"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#9E9891] hover:text-[#1A1A1A] rounded-full hover:bg-[#F3EFE8] transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {showLoginForm ? (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <PhoneOTPForm
                  onSuccess={handleLoginSuccess}
                  onCancel={() => setShowLoginForm(false)}
                  title="Log in with your phone"
                />
              </motion.div>
            ) : selectedTicket ? (
              <motion.div
                key="ticket-detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                  {qrData && (
                    <div className="inline-flex p-4 bg-white rounded-xl border border-[#E8E3DC]">
                      <QRCodeSVG value={qrData} size={180} level="M" fgColor="#1A1A1A" bgColor="#ffffff" />
                    </div>
                  )}
                  <p className="text-[#6B6560] text-xs mt-4 font-medium">
                    Ticket #{selectedTicket.payment_intent_id?.slice(-8) || "—"}
                  </p>
                  <p className="text-[#9E9891] text-xs mt-1">
                    {selectedTicket.ticket_purchased_at || selectedTicket.created_at
                      ? new Date(selectedTicket.ticket_purchased_at || selectedTicket.created_at).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </motion.div>
            ) : !isLoggedIn ? (
              <motion.div
                key="guest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center"
              >
                <p className="text-[#9E9891] text-sm mb-6">
                  Log in to see your profile and ticket history.
                </p>
                <motion.button
                  type="button"
                  onClick={() => setShowLoginForm(true)}
                  className="rounded-full bg-[#1A1A1A] px-8 py-3.5 text-sm font-semibold text-white hover:opacity-85 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Log in
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="rounded-xl border border-[#E8E3DC] bg-white p-4">
                  <p className="text-[#9E9891] text-xs uppercase tracking-wider font-medium mb-1">Name</p>
                  <p className="text-[#1A1A1A] font-semibold">{userName || "—"}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-full border border-[#E8E3DC] bg-[#F3EFE8] px-4 py-3 text-sm font-semibold text-[#6B6560] hover:bg-[#E8E3DC] hover:text-[#1A1A1A] transition-all"
                >
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
