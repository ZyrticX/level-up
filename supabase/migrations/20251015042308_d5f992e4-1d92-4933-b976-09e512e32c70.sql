-- Create enum for course icon categories
CREATE TYPE public.course_icon_category AS ENUM (
  'electrical_engineering',
  'digital_systems',
  'computer_organization',
  'computer_networks',
  'electronics',
  'semiconductors',
  'signal_processing',
  'mathematics',
  'probability',
  'stochastic_models',
  'physics',
  'mechanics',
  'magnetism',
  'general'
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  institution TEXT,
  department TEXT,
  instructor TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  duration TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  icon_category course_icon_category DEFAULT 'general',
  icon_url TEXT,
  whatsapp_link TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course chapters table
CREATE TABLE public.course_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course materials table
CREATE TABLE public.course_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  folder TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage all courses"
  ON public.courses FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for course_chapters
CREATE POLICY "Anyone can view chapters of published courses"
  ON public.course_chapters FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = course_chapters.course_id AND is_published = true
  ));

CREATE POLICY "Admins can manage all chapters"
  ON public.course_chapters FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for course_materials
CREATE POLICY "Anyone can view materials of published courses"
  ON public.course_materials FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = course_materials.course_id AND is_published = true
  ));

CREATE POLICY "Admins can manage all materials"
  ON public.course_materials FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at on courses
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on course_chapters
CREATE TRIGGER update_course_chapters_updated_at
  BEFORE UPDATE ON public.course_chapters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on course_materials
CREATE TRIGGER update_course_materials_updated_at
  BEFORE UPDATE ON public.course_materials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for course icons
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-icons', 'course-icons', true);

-- Storage policies for course icons
CREATE POLICY "Anyone can view course icons"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-icons');

CREATE POLICY "Admins can upload course icons"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-icons' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update course icons"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'course-icons' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete course icons"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'course-icons' AND
    public.has_role(auth.uid(), 'admin')
  );