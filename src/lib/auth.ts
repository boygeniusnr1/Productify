import { supabase } from './supabase';

export const signInWithGithub = () => 
  supabase.auth.signInWithOAuth({ provider: 'github' });

export const signInWithEmail = (email: string) => 
  supabase.auth.signInWithOtp({ email });

export const signInWithWeb3 = async () => {
  // Brutally honest: You'll need ethers.js or wagmi for this later.
  // For now, we'll trigger a placeholder alert.
  alert("Web3 Wallet integration requires ethers.js installation. Ready for that next?");
};