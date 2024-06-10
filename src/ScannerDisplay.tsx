import React from "react";
import { useSettings } from "./components/SettingsProvider";
import { Button } from "./shadcn/ui/button";

const ScannerDisplay = () => {
  var breakLoop = false;
  const { imageUrl, retrieveImage } = useSettings();
  const [barcode, setBarcode] = React.useState<string>("");
  const [isScanning, setScanning] = React.useState<boolean>(false);
  const barcodeInput = React.useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className="absolute bottom-1 right-11">
        <input
          className="p-0 h-0 w-0"
          ref={barcodeInput}
          value={barcode}
          onChange={(e) => {
            setBarcode(e.target.value);
          }}
          onBlur={async (e) => {
            if (!breakLoop) {
              await retrieveImage(e.target.value);
              setBarcode("");
              e.target.focus();
            }
          }}
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

      <div>
        <img
          src={imageUrl}
          style={{
            maxWidth: "100vw",
            maxHeight: "100vh",
            width: "100vw",
            height: "100vh",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </div>
    </div>
  );
};

export default ScannerDisplay;
