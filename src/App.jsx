import { useState } from "react";

import MainMenu from "./ui/screens/MainMenu";
import SettingsScreen from "./ui/screens/SettingsScreen";
import LoginScreen from "./ui/screens/LoginScreen";
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
          onLogin={() => setCurrentScreen(SCREENS.LOGIN)}
        />
      )}
      {currentScreen === SCREENS.SETTINGS && (
        <SettingsScreen onBack={() => setCurrentScreen(SCREENS.MAIN_MENU)} />
      )}
      {currentScreen === SCREENS.LOGIN && (
        <LoginScreen onBack={() => setCurrentScreen(SCREENS.MAIN_MENU)} />
      )}
      {currentScreen === SCREENS.GAME && (
        <GameScreen onExitToMenu={() => setCurrentScreen(SCREENS.MAIN_MENU)} />
      )}{" "}
    </>
  );
}

export default App;
