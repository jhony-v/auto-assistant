import Pusher from 'pusher';

export const pusher = new Pusher({
  appId: import.meta.env.VITE_PUSHER_APP_ID,
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  secret: import.meta.env.VITE_PUSHER_SECRET,
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  useTLS: true,
});