import { useState } from "react";
import { signup } from "../../../services/authService";
import { toast } from "react-toastify";

export default function SignupForm({ onSwitch }) {
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // const [message, setMessage] = useState("");

  async function handleSignup() {
    try {
      console.log("Signing up with:", { username, email, password });
      const data = await signup({
        username,
        email,
        password,
      });

      if (data.success) {
        console.log("Signup successful:", data);
        toast.success("Account created successfully! Redirecting to login...");
        // setMessage("Account created successfully! Redirecting to login...");

        setTimeout(() => {
          onSwitch();
        }, 2000);
      } else {
        toast.error(data.message);
        // setMessage(data.message);
      }
    } catch (error) {
      toast.error("Server Error! Please try again later.");
      // setMessage("Server Error");
    }
  }

  return (
    <>
      <h1 className="mb-8 text-center text-4xl font-bold text-purple-400">
        SIGN UP
      </h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-purple-400"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-purple-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-purple-400"
        />

        <button
          onClick={handleSignup}
          className="rounded-xl bg-purple-500 py-3 font-bold transition hover:bg-purple-400"
        >
          SIGN UP
        </button>

        {/* {message && <p className="text-center text-sm">{message}</p>} */}

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <button
            onClick={onSwitch}
            className="text-purple-400 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </>
  );
}
