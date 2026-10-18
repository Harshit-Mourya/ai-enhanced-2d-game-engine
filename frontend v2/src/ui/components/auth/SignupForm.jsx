import { useState } from "react";
import { signup } from "../../../services/authService";
import { toast } from "react-toastify";

export default function SignupForm({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    try {
      console.log("Signing up with:", { username, email, password });
      const data = await signup({ username, email, password });

      if (data.success) {
        toast.success("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          onSwitch();
        }, 1500);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Server Error! Please try again later.");
    }
  }

  return (
    <>
      <h1 className="mb-8 text-center text-4xl font-bold text-sky-400">
        NEW PILOT REGISTRATION
      </h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Callsign / Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400 text-white"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400 text-white"
        />

        <button
          onClick={handleSignup}
          className="rounded-xl bg-sky-500 py-3 font-bold transition hover:bg-sky-400 text-white shadow-md"
        >
          REGISTER PILOT
        </button>

        <p className="text-center text-sm text-slate-400">
          Already registered?{" "}
          <button onClick={onSwitch} className="text-sky-400 hover:underline">
            Login
          </button>
        </p>
      </div>
    </>
  );
}
