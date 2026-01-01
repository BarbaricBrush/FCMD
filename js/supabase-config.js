
// Initialize Supabase Client
const SUPABASE_URL = 'https://zohdrkvdaxyidnwzmcwr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvaGRya3ZkYXh5aWRud3ptY3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MDI3MjUsImV4cCI6MjA1MTI3ODcyNX0.s0_publishable_ItmA7nn0ozo5COzZIj8'.trim();

// Ensure the global supabase object exists from the CDN
if (typeof supabase !== 'undefined') {
    // Debug log to verify key (check console if error persists)
    console.log('Initializing Supabase with URL:', SUPABASE_URL);
    
    try {
        window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized successfully.');
    } catch (e) {
        console.error('Supabase init failed:', e);
    }
} else {
    console.error('Supabase library not loaded. Check CDN script tag.');
}