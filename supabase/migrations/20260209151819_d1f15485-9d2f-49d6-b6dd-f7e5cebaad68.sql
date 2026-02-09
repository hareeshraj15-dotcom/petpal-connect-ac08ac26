
-- Vet documents for verification
CREATE TABLE public.vet_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  document_type TEXT NOT NULL, -- 'license' or 'degree'
  document_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vet_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vets can view own documents" ON public.vet_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Vets can insert own documents" ON public.vet_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents" ON public.vet_documents
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update documents" ON public.vet_documents
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Vet availability slots
CREATE TABLE public.vet_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vet_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL, -- 0=Monday, 6=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vet_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vets manage own availability" ON public.vet_availability
  FOR ALL USING (auth.uid() = vet_id);

CREATE POLICY "Anyone can view vet availability" ON public.vet_availability
  FOR SELECT USING (true);

-- Appointments table (real)
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_owner_id UUID NOT NULL,
  vet_id UUID NOT NULL,
  pet_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  vet_name TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  payment_id TEXT,
  amount NUMERIC DEFAULT 500,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = pet_owner_id);

CREATE POLICY "Vets view own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = vet_id);

CREATE POLICY "Owners create appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = pet_owner_id);

CREATE POLICY "Vets update appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = vet_id);

CREATE POLICY "Owners update own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = pet_owner_id);

-- Prescriptions table
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vet_id UUID NOT NULL,
  pet_owner_id UUID NOT NULL,
  pet_name TEXT NOT NULL,
  medication TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  vet_name TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vets manage own prescriptions" ON public.prescriptions
  FOR ALL USING (auth.uid() = vet_id);

CREATE POLICY "Owners view own prescriptions" ON public.prescriptions
  FOR SELECT USING (auth.uid() = pet_owner_id);

-- Pet medical records
CREATE TABLE public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_owner_id UUID NOT NULL,
  vet_id UUID NOT NULL,
  pet_name TEXT NOT NULL,
  record_type TEXT NOT NULL,
  description TEXT NOT NULL,
  vet_name TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view own records" ON public.medical_records
  FOR SELECT USING (auth.uid() = pet_owner_id);

CREATE POLICY "Vets manage records" ON public.medical_records
  FOR ALL USING (auth.uid() = vet_id);

-- Feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  pet_owner_id UUID NOT NULL,
  vet_id UUID NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners create feedback" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = pet_owner_id);

CREATE POLICY "Owners view own feedback" ON public.feedback
  FOR SELECT USING (auth.uid() = pet_owner_id);

CREATE POLICY "Vets view own feedback" ON public.feedback
  FOR SELECT USING (auth.uid() = vet_id);

-- Storage bucket for vet documents
INSERT INTO storage.buckets (id, name, public) VALUES ('vet-documents', 'vet-documents', false);

CREATE POLICY "Vets upload own docs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vet-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Vets view own docs" ON storage.objects
  FOR SELECT USING (bucket_id = 'vet-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins view all vet docs" ON storage.objects
  FOR SELECT USING (bucket_id = 'vet-documents' AND public.has_role(auth.uid(), 'admin'));
