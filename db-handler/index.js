import { createClient } from "@supabase/supabase-js";

const env = {};

if (typeof process === "undefined") {
  try {
    env.VITE_SUPABASE_DOMAIN = import.meta.env.VITE_SUPABASE_DOMAIN;
    env.VITE_SUPABASE_TOKEN = import.meta.env.VITE_SUPABASE_TOKEN;
  } catch {
    console.log('supabase:server')
  }
} else {
  env.VITE_SUPABASE_DOMAIN = process.env.VITE_SUPABASE_DOMAIN;
  env.VITE_SUPABASE_TOKEN = process.env.VITE_SUPABASE_TOKEN;
  console.log('supabase:client')
}

export const db = createClient(env.VITE_SUPABASE_DOMAIN, env.VITE_SUPABASE_TOKEN, {
  auth: {
    persistSession: false,
  },
});

export const UPCOMING_EVENT_CHANNEL = "upcomingEventChannel";

export const UPCOMING_EVENT_CHANNEL_BROADCAST = {
  TYPE: "broadcast",
  EVENT: "createTreatment",
};

export const TABLE = {
  USER: "users",
  TREATMENT: "treatment",
  PRODUCTS: "products",
};

export const TREATMENT_CLOSEST_DATE  = "treatment_closest_date"