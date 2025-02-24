import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../services/firebaseConfig';

const handleGoogleLogin = async ({ setLoading, setMessage }) => {
  setLoading(true);

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account' // Всегда показывать окно выбора аккаунта
    });

    const result = await signInWithPopup(auth, provider);

    if (result?.user) {
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        lastLogin: new Date().toISOString(),
        provider: 'google',
      };

      const db = getFirestore();
      await setDoc(doc(db, 'users', result.user.uid), userData, { merge: true });

      setMessage({
        text: `Welcome, ${result.user.displayName || result.user.email}!`,
        type: 'success'
      });

      setTimeout(() => {
        setLoading(false);
        window.location.replace('/');
      }, 1500);
    }
  } catch (error) {
    console.error('Google login error:', error);
    setLoading(false);
    setMessage({
      text: 'Login failed. Please try again.',
      type: 'error'
    });
  }
};

export default handleGoogleLogin;
