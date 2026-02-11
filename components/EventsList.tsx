"use client";

import { motion } from "framer-motion";
import { Event } from "./EventDetail";

interface EventsListProps {
  events: Event[];
  loading: boolean;
  onEventClick: (event: Event) => void;
}

export default function EventsList({
  events,
  loading,
  onEventClick,
}: EventsListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E8E3DC] border-t-[#D4654A]"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <p className="font-playfair text-2xl text-[#6B6560]">
          No events available at the moment.
        </p>
        <p className="text-base text-[#9E9891] mt-4">
          Check back soon for exciting events!
        </p>
      </motion.div>
    );
  }

  const now = new Date();

  return (
    <div className="w-full flex flex-col gap-7">
      {events.map((event, index) => {
        const eventDate = new Date(event.date);
        const isPast = eventDate < now;

        return (
          <motion.article
            key={event.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.15, duration: 0.6 }}
            onClick={() => onEventClick(event)}
            className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
              isPast ? "opacity-75 hover:opacity-90" : "hover:-translate-y-0.5"
            }`}
            style={{
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
            }}
            whileHover={{
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.05)",
            }}
          >
            {/* Image */}
            {event.image_url ? (
              <div className="relative w-full h-[200px] sm:h-[280px] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${event.image_url}')` }}
                />
                <span
                  className={`absolute top-4 left-4 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                    isPast
                      ? "bg-white/85 text-[#6B6560] backdrop-blur-sm"
                      : "bg-[rgba(212,101,74,0.9)] text-white"
                  }`}
                >
                  {isPast ? "Past Event" : "Upcoming"}
                </span>
                {!isPast && (
                  <span className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black/65 text-white backdrop-blur-sm">
                    ${event.price.toFixed(0)}
                  </span>
                )}
              </div>
            ) : (
              <div className="relative w-full h-[200px] sm:h-[280px] overflow-hidden bg-gradient-to-br from-[#D4654A] to-[#BF5840]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/30 text-6xl font-bold font-playfair">⚓</span>
                </div>
                <span
                  className={`absolute top-4 left-4 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                    isPast
                      ? "bg-white/85 text-[#6B6560] backdrop-blur-sm"
                      : "bg-[rgba(212,101,74,0.9)] text-white"
                  }`}
                >
                  {isPast ? "Past Event" : "Upcoming"}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="px-6 sm:px-7 py-6 sm:py-7">
              {/* Meta */}
              <div className="flex items-center gap-4 mb-3.5 flex-wrap">
                <div className="flex items-center gap-1.5 text-[13px] text-[#6B6560] font-medium">
                  <svg className="w-[15px] h-[15px] opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {eventDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-[#6B6560] font-medium">
                  <svg className="w-[15px] h-[15px] opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {event.location}
                </div>
              </div>

              {/* Title */}
              <h2 className="font-playfair text-[22px] sm:text-[26px] font-bold leading-[1.2] tracking-tight text-[#1A1A1A] mb-2.5">
                {event.title}
              </h2>

              {/* Description */}
              <p className="text-[15px] text-[#6B6560] leading-relaxed mb-6 line-clamp-2 max-w-[600px]">
                {event.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-[#D4654A] flex items-center justify-center text-[13px] font-semibold text-white border-2 border-white">
                      K
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#4B9CD3] flex items-center justify-center text-[13px] font-semibold text-white border-2 border-white -ml-2">
                      A
                    </div>
                  </div>
                  <span className="text-[13px] text-[#9E9891] font-medium">
                    Hosted by Kyle & Antony
                  </span>
                </div>

                <button
                  className={`inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all ${
                    isPast
                      ? "bg-[#F3EFE8] text-[#6B6560] hover:bg-[#E8E3DC] hover:text-[#1A1A1A]"
                      : "bg-[#1A1A1A] text-white hover:opacity-85"
                  }`}
                >
                  {isPast ? (
                    "View Recap"
                  ) : (
                    <>
                      RSVP
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
