import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://juipkpvidlthunyyeplg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aXBrcHZpZGx0aHVueXllcGxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjM2NzIzMCwiZXhwIjoyMDQ3OTQzMjMwfQ.53TM-81IDlM_3DxY5le-ITmaP9W5f-WJbs3EgQsTgM8"; // Replace with your Supabase key
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
