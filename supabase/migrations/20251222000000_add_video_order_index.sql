-- Add order_index column to videos table for sorting
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Create index for faster ordering
CREATE INDEX IF NOT EXISTS idx_videos_topic_order 
ON public.videos(topic_id, order_index);

-- Update existing videos to have sequential order_index based on created_at
WITH ordered_videos AS (
  SELECT id, topic_id, ROW_NUMBER() OVER (PARTITION BY topic_id ORDER BY created_at) - 1 as new_order
  FROM public.videos
  WHERE topic_id IS NOT NULL
)
UPDATE public.videos v
SET order_index = ov.new_order
FROM ordered_videos ov
WHERE v.id = ov.id;

