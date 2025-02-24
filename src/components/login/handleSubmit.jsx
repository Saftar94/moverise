
import { auth } from '../services/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const handleSubmit = async ({ e, isLogin, formData, setLoading, setMessage }) => {
  e.preventDefault();
  setLoading(true);
  setMessage({ text: '', type: '' });

  try {
    let userCredential;

    if (isLogin) {
      userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
    } else {
      userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
    }

    if (userCredential?.user) {
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        provider: 'email'
      };

      const db = getFirestore();
      await setDoc(doc(db, 'users', userCredential.user.uid), userData, { merge: true });

      setMessage({ 
        text: isLogin ? 'Successful login!' : 'Registration successful!', 
        type: 'success' 
      });

      setTimeout(() => {
        setLoading(false);
        window.location.replace('/');
      }, 1500);
    }
  } catch (error) {
    console.error('Auth error:', error);

    const errorMessages = {
        'auth/email-already-in-use': 'A user with this email already exists',
        'auth/wrong-password': 'Incorrect password!',
        'auth/user-not-found': 'User not found!',
        'auth/invalid-email': 'Invalid email format!',
        'auth/weak-password': 'Password must be at least 6 characters!',
        'auth/invalid-login-credentials': 'Invalid email or password!',
        'auth/missing-password': 'Please enter a password!',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/internal-error': 'An internal error occurred. Please try again.',
        'auth/operation-not-allowed': 'Email/password sign-in is not enabled.',
        'auth/popup-closed-by-user': 'Login window was closed. Please try again.',
        'auth/invalid-credential': 'Invalid credentials. Please try again.',
        'auth/account-exists-with-different-credential': 'An account already exists with a different sign-in method.'
      };
  
      const errorMessage = errorMessages[error.code] || 'An error has occurred. Please try again later!';
      
      setMessage({ 
        text: errorMessage, 
        type: 'error' 
      });
    setLoading(false);
  }
};

export default handleSubmit;
