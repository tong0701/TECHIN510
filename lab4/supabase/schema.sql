-- sponsors
CREATE TABLE sponsors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  company_name text NOT NULL,
  industry text,
  contact_name text,
  contact_email text,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_own_sponsors" ON sponsors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own_sponsors" ON sponsors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_sponsors" ON sponsors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own_sponsors" ON sponsors FOR DELETE USING (auth.uid() = user_id);

-- meetings
CREATE TABLE meetings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  sponsor_id uuid REFERENCES sponsors(id) ON DELETE CASCADE,
  title text NOT NULL,
  meeting_date date,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_own_meetings" ON meetings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own_meetings" ON meetings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_meetings" ON meetings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own_meetings" ON meetings FOR DELETE USING (auth.uid() = user_id);

-- project_ideas
CREATE TABLE project_ideas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  sponsor_id uuid REFERENCES sponsors(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'New',
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE project_ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_own_ideas" ON project_ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own_ideas" ON project_ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_ideas" ON project_ideas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own_ideas" ON project_ideas FOR DELETE USING (auth.uid() = user_id);
