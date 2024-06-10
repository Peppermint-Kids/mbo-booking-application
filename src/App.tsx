import "./App.css";
import { Toaster } from "./shadcn/ui/toaster";
import SettingsProvider from "./components/SettingsProvider";
import { SettingsModalButton } from "./components/SettingsModal";
import ScannerDisplay from "./ScannerDisplay";

function App() {
  return (
    <div className="" style={{ userSelect: "none" }}>
      <SettingsProvider>
        <SettingsModalButton />
        <ScannerDisplay />
        {/* <FileStorage /> */}
        <Toaster />
      </SettingsProvider>
    </div>
  );
}

export default App;
