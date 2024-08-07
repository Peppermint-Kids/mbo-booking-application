import React from "react";
import { useSettings } from "./components/SettingsProvider";
import { Button } from "./shadcn/ui/button";
import ScreenSaver from "./components/ScreenSaver";

const ScannerDisplay = () => {
  var breakLoop = false;
  const { imageUrl, retrieveImage, settings } = useSettings();
  const [barcode, setBarcode] = React.useState<string>("");
  const [isScanning, setScanning] = React.useState<boolean>(false);
  const barcodeInput = React.useRef<HTMLInputElement>(null);
  const [showScreenSaver, setShowScreenSaver] = React.useState(true);
  const screenSaveTimeout = React.useRef<NodeJS.Timeout>();

  const showScreenSaverOnTimeout = () => {
    setShowScreenSaver(true);
    retrieveImage("");
  };

  React.useEffect(() => {
    if (!imageUrl) setShowScreenSaver(true);
    else {
      setShowScreenSaver(false);
      clearTimeout(screenSaveTimeout.current);
      screenSaveTimeout.current = setTimeout(
        showScreenSaverOnTimeout,
        settings.imageTimeout * 1000
      );
    }
  }, [imageUrl]);

  const keypressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (barcodeInput.current) {
        barcodeInput.current.blur();
      }
    }
  };

  return (
    <div>
      {settings.isLoggedIn && (
        <>
          <div className="absolute bottom-1 right-11" style={{ zIndex: 10 }}>
            <input
              className="p-0 h-0 w-0"
              ref={barcodeInput}
              value={barcode}
              onChange={(e) => {
                setBarcode(e.target.value);
              }}
              onBlur={async (e) => {
                if (!breakLoop) {
                  await retrieveImage(e.target.value.substring(0, 13));
                  setBarcode("");
                  e.target.focus();
                }
              }}
              onKeyUpCapture={(event) => keypressHandler(event)}
            />
            <input className="p-0 h-0 w-0" />
            <Button
              variant={"ghost"}
              onClick={() => {
                if (isScanning) {
                  setScanning(false);
                  breakLoop = true;
                  barcodeInput.current?.blur();
                } else {
                  setScanning(true);
                  breakLoop = false;
                  barcodeInput.current?.focus();
                }
              }}
            >
              {isScanning ? "Stop" : "Start"} scanning
            </Button>
          </div>

          {showScreenSaver && (
            <div
              id="screen_saver_container"
              className="absolute "
              style={{
                maxWidth: "100vw",
                maxHeight: "100vh",
                width: "100vw",
                height: "100vh",
                zIndex: 5,
              }}
            >
              <ScreenSaver />
            </div>
          )}

          <div style={{ zIndex: 4 }}>
            <img
              src={imageUrl}
              style={{
                maxWidth: "100vw",
                maxHeight: "100vh",
                width: "100vw",
                height: "100vh",
                objectFit: settings.objectFit,
                objectPosition: "center",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ScannerDisplay;
