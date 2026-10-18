import { useState, useEffect } from "react";
import { getOrCreateUserData, updateUserSettings, db } from "../../services/db";
import { Volume2, VolumeX, Eye, ArrowLeft, Trash2 } from "lucide-react";

export default function SettingsScreen({ onBack }) {
  const [settings, setSettings] = useState({
    soundVolume: 80,
    musicVolume: 70,
    showDetectionRadius: true,
  });
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    getOrCreateUserData("guest").then((data) => {
      if (data.settings) setSettings(data.settings);
    });
  }, []);

  const handleChange = (key, val) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);
    updateUserSettings("guest", updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleResetProgress = async () => {
    if (confirm("Are you sure you want to reset all game progress and stats?")) {
      await db.progress.clear();
      await db.stats.clear();
      await db.achievements.clear();
      await getOrCreateUserData("guest");
      alert("Local game progress has been reset.");
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-950 text-white select-none">
      <div className="w-full max-w-md rounded-3xl border border-sky-500/30 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-6 text-3xl font-extrabold text-sky-400 tracking-wide text-center">
          ENGINE CONFIGURATION
        </h1>

        <div className="space-y-5 text-sm">
          {/* Sound Volume */}
          <div>
            <div className="flex justify-between items-center mb-2 font-bold text-slate-300">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-sky-400" /> Sound Effects Volume
              </span>
              <span className="text-sky-400 font-mono">{settings.soundVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.soundVolume}
              onChange={(e) => handleChange("soundVolume", Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>

          {/* Music Volume */}
          <div>
            <div className="flex justify-between items-center mb-2 font-bold text-slate-300">
              <span className="flex items-center gap-2">
                <VolumeX className="w-4 h-4 text-sky-400" /> Music Volume
              </span>
              <span className="text-sky-400 font-mono">{settings.musicVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.musicVolume}
              onChange={(e) => handleChange("musicVolume", Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>

          {/* Show Enemy Detection Rings */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="flex items-center gap-2 font-bold text-slate-300">
              <Eye className="w-4 h-4 text-amber-400" /> Show Enemy AI Radii
            </span>
            <input
              type="checkbox"
              checked={settings.showDetectionRadius}
              onChange={(e) => handleChange("showDetectionRadius", e.target.checked)}
              className="w-5 h-5 accent-sky-500 cursor-pointer rounded"
            />
          </div>

          {/* Reset Save Data */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={handleResetProgress}
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-rose-800/60 bg-rose-950/40 py-2.5 text-xs font-bold text-rose-300 transition hover:bg-rose-900/60"
            >
              <Trash2 className="w-4 h-4" /> RESET INDEXEDDB SAVE DATA
            </button>
          </div>
        </div>

        {savedNotice && (
          <p className="mt-4 text-center text-xs font-bold text-emerald-400">
            ✓ Settings saved automatically to IndexedDB
          </p>
        )}

        <button
          onClick={onBack}
          className="mt-8 flex items-center justify-center gap-2 w-full rounded-xl bg-sky-500 py-3 font-bold text-white shadow-[0_0_15px_rgba(14,165,233,0.4)] transition hover:bg-sky-400"
        >
          <ArrowLeft className="w-4 h-4" /> SAVE & BACK
        </button>
      </div>
    </div>
  );
}
