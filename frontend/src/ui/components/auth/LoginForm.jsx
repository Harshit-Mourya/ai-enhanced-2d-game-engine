import { useState } from "react";
import { toast } from "react-toastify";
import { login } from "../../../services/authService";

export default function LoginForm({ onSwitch, onSuccess }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // const [message, setMessage] = useState("");

  async function handleLogin() {
    try {
      console.log("Logging in with:", { email, password });
      const data = await login({
        email,
        password,
      });

      if (data.success) {
        console.log("Login successful:", data);
        toast.success(`Welcome ${data.user.username}!`);
        localStorage.setItem("token", data.token);

        localStorage.setItem("user", JSON.stringify(data.user));

        onSuccess();
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
      <h1 className="mb-8 text-center text-4xl font-bold text-sky-400">
        LOGIN
      </h1>

      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400"
        />

        <button
          onClick={handleLogin}
          className="rounded-xl bg-sky-500 py-3 font-bold transition hover:bg-sky-400"
        >
          LOGIN
        </button>

        {/* {message && <p className="text-center text-sm">{message}</p>} */}

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <button onClick={onSwitch} className="text-sky-400 hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </>
  );
}
