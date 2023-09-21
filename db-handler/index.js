import { createClient } from '@supabase/supabase-js'

export const db = createClient(import.meta.env.VITE_SUPABASE_DOMAIN, import.meta.env.VITE_SUPABASE_TOKEN,{
    auth: {
        persistSession: false
    }
})

export const UPCOMING_EVENT_CHANNEL = 'upcomingEventChannel'

export const UPCOMING_EVENT_CHANNEL_BROADCAST = {
    TYPE: "broadcast",
    EVENT: "createTreatment"
}

export const TABLE = {
    USER: "users",
    TREATMENT: "treatment",
    PRODUCTS: "products"
}