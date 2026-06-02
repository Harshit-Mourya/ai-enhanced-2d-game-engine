export default function LoginScreen({ onBack }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-950 text-white">
      <h1 className="mb-8 text-5xl font-bold text-sky-400">LOGIN</h1>

      <div className="flex w-[320px] flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400"
        />

        <input
          type="password"
          placeholder="Password"
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400"
        />

        <button className="rounded-xl bg-sky-500 py-3 font-bold transition hover:scale-105 hover:bg-sky-400">
          LOGIN
        </button>

        <button
          onClick={onBack}
          className="mt-4 rounded-xl border border-slate-700 py-3 transition hover:bg-slate-800"
        >
          BACK
        </button>
      </div>
    </div>
  );
}
