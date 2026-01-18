import { createClient } from './client';

// Singleton for backward compatibility with existing client-side code
export const supabase = createClient();

// Re-export createClient for use in hooks/components if needed
export { createClient };
