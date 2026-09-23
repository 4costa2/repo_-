import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ufqyjirhfskwcmsvralz.supabase.co";
const SUPABASE_KEY = "sb_publishable_TvL-CyBWEbv4-lcohqESVg__KledB34";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
