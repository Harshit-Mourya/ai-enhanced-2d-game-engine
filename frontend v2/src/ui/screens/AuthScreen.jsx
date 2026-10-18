import { useState } from "react";

import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

export default function AuthScreen({ onBack, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl transition-all duration-300">
        {isLogin ? (
          <LoginForm
            onSwitch={() => setIsLogin(false)}
            onSuccess={onAuthSuccess}
          />
        ) : (
          <SignupForm onSwitch={() => setIsLogin(true)} />
        )}

        <button
          onClick={onBack}
          className="mt-6 w-full rounded-xl border border-slate-700 py-3 transition hover:bg-slate-800"
        >
          BACK
        </button>
      </div>
    </div>
  );
}
