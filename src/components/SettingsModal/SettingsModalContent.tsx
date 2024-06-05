import { DownloadIcon, Settings, ZapIcon } from "lucide-react";
import { Button } from "../../shadcn/ui/button";
import { useSettings } from "../SettingsProvider";
import { Label } from "../../shadcn/ui/label";
import { Input } from "../../shadcn/ui/input";
import { Checkbox } from "../../shadcn/ui/checkbox";
import React from "react";

const SettingsModalContent: React.FC = () => {
  const { settings, updateSettings, createFGtoStyleMap, createItemMasterMap } =
    useSettings();

  const handleCSVUpload = (e: any) => {
    createFGtoStyleMap(e.target.files[0]);
  };

  const handleSAPItemMasterUpload = (e: any) => {
    createItemMasterMap(e.target.files[0]);
  };
  return (
    <div className="grid gap-5">
      <div className="grid w-full max-w-xs items-center gap-1.5">
        <Label htmlFor="downloadTuner">Download tuner</Label>
        <Input
          type="number"
          id="downloadTuner"
          value={settings.downloadTuner}
          step={100}
          min={1000}
          onBlur={(e) => {
            const val = Number(e.target.value);
            updateSettings("downloadTuner", val < 1000 ? 1000 : val);
          }}
          onChange={(e) => {
            const val = Number(e.target.value);
            updateSettings("downloadTuner", val);
          }}
        />
      </div>
      <div className="grid w-full max-w-xs items-center gap-1.5">
        <Label>Download format</Label>
        <div className="flex items-centers">
          <Checkbox
            className="w-[16px] m-auto"
            checked={settings.asZip}
            onCheckedChange={(a) => {
              updateSettings("asZip", a === "indeterminate" ? true : a);
            }}
          />
          <label
            className="flex-1 ml-2"
            onClick={() => {
              updateSettings("asZip", !settings.asZip);
            }}
          >
            Download as zip. (quick <ZapIcon size={14} className="inline" />)
          </label>
        </div>
      </div>
      <div className="grid w-full max-w-xs items-center gap-1.5">
        <Label htmlFor="fileMap">FG to style params Map</Label>
        <Input
          type="file"
          id="fileMap"
          placeholder=""
          accept=".csv"
          onChange={handleCSVUpload}
        />
      </div>

      <div className="grid w-full max-w-xs items-center gap-1.5">
        <Label htmlFor="fileMap">Barcode master</Label>
        <Input
          type="file"
          id="sapItemMaster"
          placeholder=""
          accept=".csv"
          onChange={handleSAPItemMasterUpload}
        />
        <small>
          Download sample file.
          <a
            className="ml-2"
            href={"mbo-booking-application/csv/barcode_sample.csv"}
          >
            <DownloadIcon size={14} className="inline" /> download
          </a>
        </small>
      </div>
    </div>
  );
};

export default SettingsModalContent;

export const SettingsModalButton = () => {
  const { setSettingsModalOpen } = useSettings();
  return (
    <div className="flex flex-row-reverse	mt-4">
      <Button
        className=""
        variant="outline"
        size="icon"
        onClick={() => setSettingsModalOpen(true)}
      >
        <Settings size={16} />
      </Button>
    </div>
  );
};
