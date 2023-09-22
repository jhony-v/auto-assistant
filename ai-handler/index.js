import { OpenAI } from "openai";

let apiKey = '';
if(typeof process === 'undefined') {
  try {
    apiKey = import.meta.env.VITE_OPEN_AI_API_KEY; 
  } catch {  void 0; }
}
else {
  apiKey = process.env.VITE_OPEN_AI_API_KEY;
}

export const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});
