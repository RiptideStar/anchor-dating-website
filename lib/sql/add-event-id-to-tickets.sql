-- Add event_id to tickets so each ticket is tied to a specific event
-- Run this in Supabase SQL Editor

ALTER TABLE tickets
ADD COLUMN IF NOT EXISTS event_id UUID;

CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);

-- Optional: link to events table (uncomment if you have an events table with id UUID)
-- ALTER TABLE tickets ADD CONSTRAINT fk_tickets_event_id
--   FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL;

COMMENT ON COLUMN tickets.event_id IS 'Event id this ticket was purchased for (null = legacy tickets)';
