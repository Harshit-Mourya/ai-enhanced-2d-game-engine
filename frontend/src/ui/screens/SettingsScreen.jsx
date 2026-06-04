export default function SettingsScreen({ onBack }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-950 text-white">
      <h1 className="mb-8 text-5xl font-bold text-sky-400">SETTINGS</h1>

      <div className="space-y-3 text-lg text-slate-300">
        <p>Sound Effects: ON</p>
        <p>Music Volume: 80%</p>
      </div>

      <button
        onClick={onBack}
        className="mt-10 rounded-xl bg-sky-500 px-6 py-3 font-bold shadow-[0_0_15px_rgba(14,165,233,0.5)] transition hover:scale-105 hover:bg-sky-400"
      >
        BACK
      </button>
    </div>
  );
}
