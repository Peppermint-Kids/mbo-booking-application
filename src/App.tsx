import "./App.css";
import { Toaster } from "./shadcn/ui/toaster";
import SettingsProvider from "./components/SettingsProvider";
import { SettingsModalButton } from "./components/SettingsModal";
import FileStorage from "./FileStorage";

function App() {
  return (
    <div className="container mx-auto" style={{ userSelect: "none" }}>
      <SettingsProvider>
        <SettingsModalButton />

        <Toaster />
      </SettingsProvider>
      <FileStorage />
    </div>
  );
}

export default App;
