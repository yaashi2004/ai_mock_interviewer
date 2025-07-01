"use server";

import { auth, db } from "@/Firebase/admin";
import { cookies } from "next/headers";

// ====================
// 🧾 TYPES
// ====================

export type SignUpParams = {
  uid: string;
  name: string;
  email: string;
};

export type SignInParams = {
  email: string;
  idToken: string;
};

// ====================
// 🔐 Session duration: 1 week
// ====================

const SESSION_DURATION = 60 * 60 * 24 * 7;

// ====================
// 🍪 Set session cookie
// ====================

export async function setSessionCookie(idToken: string) {
  const cookieStore = cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

// ====================
// 🆕 Sign up
// ====================

export async function signUp(params: SignUpParams): Promise<{
  success: boolean;
  message: string;
}> {
  const { uid, name, email } = params;

  try {
    console.log("🔵 Creating Firestore user:", { uid, name, email });

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    await userRef.set({ name, email });

    console.log("🟢 User successfully saved in Firestore.");

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("🔴 Firestore user creation error:", error);

    return {
      success: false,
      message: error.message || "Failed to create account. Please try again.",
    };
  }
}

// ====================
// 🔐 Sign in
// ====================

export async function signIn(params: SignInParams): Promise<{
  success: boolean;
  message: string;
}> {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error: any) {
    console.error("🔴 Firebase sign-in error:", error);

    return {
      success: false,
      message: error.message || "Failed to log in. Please try again.",
    };
  }
}

// ====================
// 🚪 Sign out
// ====================

export async function signOut() {
  const cookieStore = cookies();
  cookieStore.delete("session");
}

// ====================
// 👤 Get current user
// ====================

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await auth.verifySessionCookie(sessionCookie, true);

    const userDoc = await db.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) return null;

    return {
      ...userDoc.data(),
      id: userDoc.id,
    } as User;
  } catch (error) {
    console.log("🔴 Invalid or expired session:", error);
    return null;
  }
}

// ====================
// ✅ Authenticated check
// ====================

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
