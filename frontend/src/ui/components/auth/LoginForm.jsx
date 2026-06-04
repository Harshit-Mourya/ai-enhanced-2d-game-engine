export default function LoginForm({ onSwitch }) {
  return (
    <>
      <h1 className="mb-8 text-center text-4xl font-bold text-sky-400">
        LOGIN
      </h1>

      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400"
        />

        <input
          type="password"
          placeholder="Password"
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400"
        />

        <button className="rounded-xl bg-sky-500 py-3 font-bold transition hover:bg-sky-400">
          LOGIN
        </button>

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
