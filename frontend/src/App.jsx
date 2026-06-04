import { useState } from "react";

import MainMenu from "./ui/screens/MainMenu";
import SettingsScreen from "./ui/screens/SettingsScreen";
import AuthScreen from "./ui/screens/AuthScreen";
import GameScreen from "./ui/screens/GameScreen";

import { SCREENS } from "./state/appState";

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.MAIN_MENU);

  return (
    <>
      {currentScreen === SCREENS.MAIN_MENU && (
        <MainMenu
          onStartGame={() => setCurrentScreen(SCREENS.GAME)}
          onSettings={() => setCurrentScreen(SCREENS.SETTINGS)}
          onAuth={() => setCurrentScreen(SCREENS.AUTH)}
        />
      )}

      {currentScreen === SCREENS.SETTINGS && (
        <SettingsScreen onBack={() => setCurrentScreen(SCREENS.MAIN_MENU)} />
      )}

      {currentScreen === SCREENS.AUTH && (
        <AuthScreen
          onBack={() => setCurrentScreen(SCREENS.MAIN_MENU)}
          onAuthSuccess={() => setCurrentScreen(SCREENS.MAIN_MENU)}
        />
      )}

      {currentScreen === SCREENS.GAME && (
        <GameScreen onExitToMenu={() => setCurrentScreen(SCREENS.MAIN_MENU)} />
      )}
    </>
  );
}

export default App;
