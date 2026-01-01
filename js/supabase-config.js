// Initialize Supabase Client
const SUPABASE_URL = 'https://zohdrkvdaxyidnwzmcwr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvaGRya3ZkYXh5aWRud3ptY3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MDI3MjUsImV4cCI6MjA1MTI3ODcyNX0.s0_pubIishable_ItemA7nn0ozo5COzZIj8';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other scripts
window.supabase = supabaseClient;