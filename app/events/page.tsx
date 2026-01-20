"use client";

import { useState, useEffect, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import SignupForm from "@/components/SignupForm";
import PaymentScreen from "@/components/PaymentScreen";
import TicketSuccess from "@/components/TicketSuccess";

export type FormData = {
  name: string;
  email: string;
  phone: string;
};

export type FlowStep = "event" | "form" | "payment" | "ticket";

function EventsContent() {
  const [step, setStep] = useState<FlowStep>("event");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedFormData = localStorage.getItem("anchor_events_formData");
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        setFormData(parsed);
      } catch (e) {
        // Ignore parse errors
      }
    }

    const savedPaymentIntent = localStorage.getItem("anchor_events_paymentIntentId");
    if (savedPaymentIntent) {
      setPaymentIntentId(savedPaymentIntent);
    }

    const savedUserId = localStorage.getItem("anchor_events_userId");
    if (savedUserId) {
      setUserId(savedUserId);
    }

    const savedStep = localStorage.getItem("anchor_events_step") as FlowStep | null;
    if (savedStep && ["event", "form", "payment", "ticket"].includes(savedStep)) {
      setStep(savedStep);
    }
  }, []);

  // Save form data to localStorage
  useEffect(() => {
    if (formData.name || formData.email || formData.phone) {
      localStorage.setItem("anchor_events_formData", JSON.stringify(formData));
    }
  }, [formData]);

  // Save payment intent ID to localStorage
  useEffect(() => {
    if (paymentIntentId) {
      localStorage.setItem("anchor_events_paymentIntentId", paymentIntentId);
    }
  }, [paymentIntentId]);

  // Save userId to localStorage
  useEffect(() => {
    if (userId) {
      localStorage.setItem("anchor_events_userId", userId);
    }
  }, [userId]);

  // Save step to localStorage
  useEffect(() => {
    localStorage.setItem("anchor_events_step", step);
  }, [step]);

  const handleBuyTicket = () => {
    setStep("form");
  };

  const handleFormSubmit = (data: FormData, userId?: string) => {
    setFormData(data);
    if (userId) {
      setUserId(userId);
    }
    setStep("payment");
  };

  const handlePaymentSuccess = (intentId: string) => {
    setPaymentIntentId(intentId);
    setStep("ticket");
  };

  const handleWalletAdded = () => {
    // Clear saved data after completion
    setTimeout(() => {
      localStorage.removeItem("anchor_events_step");
      localStorage.removeItem("anchor_events_formData");
      localStorage.removeItem("anchor_events_paymentIntentId");
      localStorage.removeItem("anchor_events_userId");
    }, 1000);
  };

  return (
    <main className="min-h-screen w-full overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        {step === "event" && (
          <EventPage key="event" onBuyTicket={handleBuyTicket} />
        )}
        {step === "form" && (
          <SignupForm
            key="form"
            onSubmit={handleFormSubmit}
            onBack={() => setStep("event")}
            initialFormData={formData}
          />
        )}
        {step === "payment" && (
          <PaymentScreen
            key="payment"
            formData={formData}
            userId={userId}
            onSuccess={handlePaymentSuccess}
            onBack={() => setStep("form")}
          />
        )}
        {step === "ticket" && (
          <TicketSuccess
            key="ticket"
            userId={userId}
            paymentIntentId={paymentIntentId}
            onWalletAdded={handleWalletAdded}
            onBack={() => setStep("form")}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

interface EventPageProps {
  onBuyTicket: () => void;
}

function EventPage({ onBuyTicket }: EventPageProps) {
  return (
    <motion.div
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/anchor-landing-bg.jpg')",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Romantic floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <motion.div
          className="w-full max-w-2xl text-center"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        >
          {/* Event Card */}
          <motion.div
            className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              padding: "3rem",
              boxShadow:
                "0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
            }}
          >
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            {/* Event Title */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-6 font-serif text-6xl md:text-7xl text-white font-light"
            >
              NYC Launch Concert
            </motion.h1>

            {/* Event Description */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-8 text-white/70 font-serif text-lg md:text-xl font-light"
            >
              Join us for an unforgettable night of music and connection
            </motion.p>

            {/* Buy Ticket Button */}
            <motion.button
              onClick={onBuyTicket}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="group relative mx-auto flex items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-12 py-6 font-serif text-2xl font-normal text-white backdrop-blur-xl transition-all hover:border-white/40 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-blue-500/40"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow:
                  "0 10px 40px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Buy Ticket
                <motion.svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </motion.svg>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full overflow-hidden bg-slate-900 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
        </main>
      }
    >
      <EventsContent />
    </Suspense>
  );
}
