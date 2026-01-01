
// Initialize Supabase Client
const SUPABASE_URL = 'https://zohdrkvdaxyidnwzmcwr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvaGRya3ZkYXh5aWRud3ptY3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MDI3MjUsImV4cCI6MjA1MTI3ODcyNX0.s0_publishable_ItmA7nn0ozo5COzZIj8';

// Ensure the global supabase object exists from the CDN
if (typeof supabase !== 'undefined') {
    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized successfully.');
} else {
    console.error('Supabase library not loaded. Check CDN script tag.');
}