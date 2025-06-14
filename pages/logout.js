import { auth } from '../firebase-config.js';
import { signOut } from 'firebase/auth';

export async function logout() {
  await signOut(auth);
  window.location.href = './login.html';
}

// Optionally, call logout() directly if this script is loaded on a logout page
// logout(); 