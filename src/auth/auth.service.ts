import { Injectable, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, setDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = signal<User | null>(null);
  user = this._user.asReadonly();
  private authStateInitialized = signal(false);

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, (user) => {
      this._user.set(user);
      this.authStateInitialized.set(true);
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error: any) {
      throw error;
    }
  }

  async register(email: string, password: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      const userRef = doc(collection(this.firestore, 'users'), user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: email,
        createdAt: new Date(),
      });
    } catch (error: any) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  isAuthenticated(): boolean {
    return !!this._user();
  }

  getUser(): User | null {
    return this._user();
  }

  // Wait for auth state to be initialized and return current user
  async waitForAuthState(): Promise<User | null> {
    return new Promise((resolve) => {
      if (this.authStateInitialized()) {
        resolve(this._user());
      } else {
        const unsub = onAuthStateChanged(this.auth, (user) => {
          resolve(user);
          unsub();
        });
      }
    });
  }
}
