// Initialize Supabase Client
const SUPABASE_URL = 'https://pgllcxxvwspndoglrrqe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnbGxjeHh2d3NwbmRvZ2xycnFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNTA1NDUsImV4cCI6MjA4MjgyNjU0NX0.SxpvntptsVgSLTWoLDrSCtt9raoyVysZ0xNf9WD2OWU';

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