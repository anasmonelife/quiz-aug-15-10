-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  panchayath TEXT NOT NULL,
  reference_id TEXT,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questions (public read access)
CREATE POLICY "Questions are publicly readable" 
ON public.questions 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage questions" 
ON public.questions 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE username = current_setting('app.current_user', true)));

-- RLS Policies for submissions (public insert, admin read)
CREATE POLICY "Anyone can submit quiz answers" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can view all submissions" 
ON public.submissions 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE username = current_setting('app.current_user', true)));

-- RLS Policies for admin_users (admin only)
CREATE POLICY "Admin can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE username = current_setting('app.current_user', true)));

-- Insert default admin user (eva/123)
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('eva', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: 123

-- Insert the 20 Independence Day quiz questions
INSERT INTO public.questions (question_text, options, correct_answer) VALUES
('സ്വതന്ത്ര ഭാരതത്തിന്റെ ആദ്യ പ്രധാനമന്ത്രി ആര്?', '{"A": "ജവഹർലാൽ നെഹ്റു", "B": "മഹാത്മാഗാന്ധി", "C": "സർദാർ പട്ടേൽ", "D": "സുഭാഷ് ചന്ദ്രബോസ്"}', 'A'),
('ഭാരതം ബ്രിട്ടീഷ് ഭരണം അവസാനിപ്പിച്ച് സ്വാതന്ത്ര്യം നേടിയതെപ്പോഴാണ്?', '{"A": "1947 ജനുവരി 26", "B": "1947 ഓഗസ്റ്റ് 15", "C": "1947 ഒക്ടോബർ 2", "D": "1948 ജനുവരി 30"}', 'B'),
('ആദ്യ സ്വാതന്ത്ര്യ ദിനത്തിൽ ഇന്ത്യൻ ദേശീയ പതാക ആരാണ് ഉയർത്തിയത്?', '{"A": "മഹാത്മാഗാന്ധി", "B": "ഡോ. രാജേന്ദ്ര പ്രസാദ്", "C": "ജവഹർലാൽ നെഹ്റു", "D": "സുഭാഷ് ചന്ദ്രബോസ്"}', 'C'),
('ഇന്ത്യയുടെ ദേശീയ ഗാനം ഏതാണ്?', '{"A": "വന്ദേ മാതരം", "B": "ജന ഗണ മന", "C": "സാരേ ജഹാൻ സെ അച്ചാ", "D": "ഏ മേറെ വതൻ കേ ലോകോ"}', 'B'),
('ഇന്ത്യൻ ദേശീയഗാനം എഴുതിയത് ആര്?', '{"A": "ബങ്കിംചന്ദ്ര ചട്ടോപാധ്യായ", "B": "രവീന്ദ്രനാഥ ടാഗോർ", "C": "ശരോജിനി നായിഡു", "D": "സുബ്രഹ്മണ്യ ഭാരതി"}', 'B'),
('ഇന്ത്യയുടെ ദേശീയ ഗീതം ഏതാണ്?', '{"A": "വന്ദേ മാതരം", "B": "ജന ഗണ മന", "C": "സാരേ ജഹാൻ സെ അച്ചാ", "D": "ജയ്ഹോ"}', 'A'),
('സ്വതന്ത്ര ഭാരതത്തിന്റെ അവസാന ഗവർണർ ജനറൽ ആര്?', '{"A": "ലോർഡ് മൗണ്ട്ബാറ്റൻ", "B": "സി. രാജഗോപാലാചാരി", "C": "വാർൺ ഹാസ്റ്റിംഗ്സ്", "D": "ലോർഡ് കർസൺ"}', 'A'),
('1942-ൽ ഭാരതത്തിന്റെ സ്വാതന്ത്ര്യത്തിനായി ആരംഭിച്ച പ്രസ്ഥാനം ഏതാണ്?', '{"A": "അസഹകരണ പ്രസ്ഥാനം", "B": "ഇന്ത്യ വിടുക പ്രസ്ഥാനം", "C": "സ്വദേശി പ്രസ്ഥാനം", "D": "സിവിൽ നിരസന പ്രസ്ഥാനം"}', 'B'),
('ഇന്ത്യൻ നാഷണൽ കോൺഗ്രസിന്റെ ആദ്യ സമ്മേളനം നടന്നത് എവിടെയാണ്?', '{"A": "ബോംബെ", "B": "കൽക്കട്ട", "C": "ഡൽഹി", "D": "മദ്രാസ്"}', 'A'),
('"ജയ് ഹിന്ദ്" എന്ന മുദ്രാവാക്യം നൽകിയ നേതാവ് ആര്?', '{"A": "സുഭാഷ് ചന്ദ്രബോസ്", "B": "മഹാത്മാഗാന്ധി", "C": "ഭഗത് സിംഗ്", "D": "ബാലഗംഗാധർ തിലക്"}', 'A'),
('ഇന്ത്യൻ പതാകയിലെ കേശരി നിറം പ്രതിനിധീകരിക്കുന്നത്?', '{"A": "വെള്ള നിറം", "B": "പച്ച നിറം", "C": "കേശരി", "D": "നീല നിറം"}', 'C'),
('പതാകയിലെ അശോക ചക്രം സൂചിപ്പിക്കുന്നത്?', '{"A": "ധൈര്യം", "B": "ധർമ്മത്തിന്റെ നിയമം", "C": "സ്വാതന്ത്ര്യം", "D": "ശക്തി"}', 'B'),
('"ഇന്ത്യയുടെ ഇരുമ്പ് മനുഷ്യൻ" എന്നറിയപ്പെടുന്ന നേതാവ് ആര്?', '{"A": "ഭഗത് സിംഗ്", "B": "സർദാർ വല്ലഭായി പട്ടേൽ", "C": "ലാൽ ബഹാദൂർ ശാസ്ത്രി", "D": "ജവഹർലാൽ നെഹ്റു"}', 'B'),
('ഇന്ത്യൻ നാഷണൽ കോൺഗ്രസ് സ്ഥാപിതമായ വർഷം?', '{"A": "1885", "B": "1905", "C": "1920", "D": "1942"}', 'A'),
('"സ്വരാജ് എന്റെ ജന്മാവകാശമാണ്, അത് ഞാൻ നേടും" എന്ന മുദ്രാവാക്യം നൽകിയ നേതാവ് ആര്?', '{"A": "മഹാത്മാഗാന്ധി", "B": "ബാലഗംഗാധർ തിലക്", "C": "ഭഗത് സിംഗ്", "D": "സുഭാഷ് ചന്ദ്രബോസ്"}', 'B'),
('"രാജ്യപിതാവ്" എന്നറിയപ്പെടുന്ന നേതാവ് ആര്?', '{"A": "ജവഹർലാൽ നെഹ്റു", "B": "മഹാത്മാഗാന്ധി", "C": "സുഭാഷ് ചന്ദ്രബോസ്", "D": "രാജേന്ദ്ര പ്രസാദ്"}', 'B'),
('ഇന്ത്യൻ ദേശീയ പതാക രൂപകല്പന ചെയ്തത് ആര്?', '{"A": "പിങ്ങാളി വെങ്കയ്യ", "B": "രവീന്ദ്രനാഥ ടാഗോർ", "C": "മഹാത്മാഗാന്ധി", "D": "സി. രാജഗോപാലാചാരി"}', 'A'),
('ഇന്ത്യയിൽ ഓരോ വർഷവും ജനുവരി 26-ന് ആഘോഷിക്കുന്നത്?', '{"A": "സ്വാതന്ത്ര്യദിനം", "B": "റിപ്പബ്ലിക് ദിനം", "C": "ഗാന്ധി ജയന്തി", "D": "സൈനിക ദിനം"}', 'B'),
('ഇന്ത്യയുടെ ആദ്യ രാഷ്ട്രപതി ആര്?', '{"A": "ഡോ. രാജേന്ദ്ര പ്രസാദ്", "B": "ഡോ. എസ്. രാധാകൃഷ്ണൻ", "C": "സകീർ ഹുസൈൻ", "D": "വി. വി. ഗിരി"}', 'A'),
('ജാലിയൻവാലാബാഗ് കൂട്ടക്കൊലക്ക് ശേഷം മഹാത്മാഗാന്ധി ആരംഭിച്ച പ്രസ്ഥാനം ഏതാണ്?', '{"A": "സിവിൽ നിരസന പ്രസ്ഥാനം", "B": "അസഹകരണ പ്രസ്ഥാനം", "C": "ഇന്ത്യ വിടുക പ്രസ്ഥാനം", "D": "ഉപ്പുമാർച്ച്"}', 'B');