const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string
const supabasePublic = process.env.EXPO_PUBLIC_SUPABASE_PUBLIC as string

import { createClient } from '@supabase/supabase-js';

function createClerkSupabaseClient() {
    return createClient(
        supabaseUrl,
        supabasePublic
,
      {
        global: {
          // Get the custom Supabase token from Clerk
          fetch: async (url, options = {}) => {
            window.Clerk?.session?.getToken({template:'supabase'})
            const clerkToken = await window.Clerk?.session?.getToken({template:'supabase'})

            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers);
            headers.set('Authorization', `Bearer ${clerkToken}`);

            // Now call the default fetch
            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      }
    );
  }
  export const client = createClerkSupabaseClient()