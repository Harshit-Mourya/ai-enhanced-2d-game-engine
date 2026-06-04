export default function SignupForm({ onSwitch }) {
  return (
    <>
      <h1 className="mb-8 text-center text-4xl font-bold text-purple-400">
        SIGN UP
      </h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-purple-400"
        />

        <input
          type="email"
          placeholder="Email"
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-purple-400"
        />

        <input
          type="password"
          placeholder="Password"
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-purple-400"
        />

        <button className="rounded-xl bg-purple-500 py-3 font-bold transition hover:bg-purple-400">
          SIGN UP
        </button>

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
