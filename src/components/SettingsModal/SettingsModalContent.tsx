import { DownloadIcon, Settings } from "lucide-react";
import { Button } from "../../shadcn/ui/button";
import { useSettings } from "../SettingsProvider";
import { Label } from "../../shadcn/ui/label";
import { Input } from "../../shadcn/ui/input";
import React from "react";
import { useToast } from "../../shadcn/ui/use-toast";
import { Progress } from "../../shadcn/ui/progress";
import { RadioGroup, RadioGroupItem } from "../../shadcn/ui/radio-group";

const SettingsModalContent: React.FC = () => {
  const {
    settings,
    updateSettings,
    handleBarcodeDataUpload,
    itemMaster,
    downloadProgress,
    downloadAllImages,
  } = useSettings();

  const { toast } = useToast();
  const [isDownloadStarted, setDownloadStarted] =
    React.useState<boolean>(false);
  const [password, setPassword] = React.useState("");

  return (
    <div className="grid gap-5">
      <div className="grid w-full max-w-xs items-center gap-1.5">
        {!settings.isLoggedIn ? (
          <>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              disabled={settings.isLoggedIn}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </>
        ) : (
          <></>
        )}
        <Button
          onClick={() => {
            if (!settings.isLoggedIn) {
              if (password === "12345") {
                updateSettings("isLoggedIn", true);

                toast({
                  variant: "default",
                  title: "Logged in",
                  description: "Login Successful",
                });
              } else {
                toast({
                  variant: "destructive",
                  title: "Login Failed",
                  description: "Wrong Password",
                });
              }
            } else {
              updateSettings("isLoggedIn", false);
            }
          }}
        >
          {settings.isLoggedIn ? "Logout" : "Login"}
        </Button>
      </div>
      {settings.isLoggedIn && (
        <>
          <div className="grid w-full max-w-xs items-center gap-1.5">
            <Label htmlFor="password">Image Fit</Label>
            <RadioGroup
              defaultValue="cover"
              value={settings.objectFit}
              className="flex flex-row"
              onValueChange={(e: "cover" | "contain") => {
                updateSettings("objectFit", e);
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cover" id="cover" />
                <Label htmlFor="cover">Cover</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contain" id="contain" />
                <Label htmlFor="contain">Contain</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid w-full max-w-xs items-center gap-1.5">
            <Label htmlFor="fileMap">Upload Barcode data</Label>
            <Input
              type="file"
              id="sapItemMaster"
              placeholder=""
              accept=".csv"
              onChange={(e) =>
                handleBarcodeDataUpload(e.target.files?.[0] ?? null)
              }
            />
            <small>
              Download sample file.
              <a
                className="ml-2"
                href={"./mbo-booking-application/csv/barcode_sample.csv"}
              >
                <DownloadIcon size={14} className="inline" /> download
              </a>
            </small>
            <p className="text-sm mt-2">
              Uploaded {itemMaster?.size ?? 0} items.
            </p>
            <Button
              variant="link"
              onClick={async () => {
                setDownloadStarted(true);
                await downloadAllImages();
                setDownloadStarted(false);
              }}
            >
              <DownloadIcon size={14} className="inline" />
              <p className="ml-2">Download all the images</p>
            </Button>
            {isDownloadStarted ? (
              <>
                <Progress value={downloadProgress * 100} />
                <small>Downloading all images</small>
              </>
            ) : (
              <small>Downloaded all the images.</small>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsModalContent;

export const SettingsModalButton = () => {
  const { setSettingsModalOpen } = useSettings();
  return (
    <div className="absolute right-1 bottom-1">
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
