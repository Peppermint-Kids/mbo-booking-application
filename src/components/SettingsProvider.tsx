import React, { useContext } from "react";

import { DialogNonTrigger } from "../shadcn/ui/dialog";
import { SettingsModalContent } from "./SettingsModal";
import { useToast } from "../shadcn/ui/use-toast";
import { IDBPDatabase, openDB } from "idb";

export type SettingsState = {
  isLoggedIn: boolean;
  objectFit: "cover" | "contain";
};

export type Item = {
  barcode: string;
  itemDescription: string;
  color: string;
  styleCode: string;
  season: "SS" | "AW";
  year: string;
  imageName: string;
  imageLink: string;
};

const DEFAULT_SETTINGS_STATE: SettingsState = {
  isLoggedIn: false,
  objectFit: "cover",
};

type SettingsContextProps = {
  settings: SettingsState;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
  updateSettings: (
    field: keyof SettingsState,
    val: boolean | "cover" | "contain"
  ) => void;
  setSettingsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleBarcodeDataUpload: (file: File | null) => void;
  itemMaster: Map<string, Item> | undefined;
  imageUrl: string;
  downloadAllImages: () => Promise<void>;
  retrieveImage: (barcode: string) => Promise<void>;
  downloadProgress: number;
  db: IDBPDatabase<unknown> | undefined;
};
const SettingsContext = React.createContext<SettingsContextProps | undefined>(
  undefined
);
const SettingsProvider: React.FC<{
  defaultSettings?: SettingsState;
  children: React.ReactNode;
}> = ({ children, defaultSettings = DEFAULT_SETTINGS_STATE }) => {
  const [settings, setSettings] =
    React.useState<SettingsState>(defaultSettings);
  const [db, setDb] = React.useState<IDBPDatabase<unknown>>();
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [downloadProgress, setDownloadProgress] = React.useState<number>(0);
  const [itemMaster, setItemMaster] = React.useState<Map<string, Item>>(
    new Map()
  );

  const { toast } = useToast();

  React.useEffect(() => {
    // Open or create the database
    const initDB = async () => {
      const db = await openDB("fileStorageDB", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("files")) {
            db.createObjectStore("files", { keyPath: "imageName" });
          }
        },
      });
      setDb(db);
    };
    initDB();
  }, []);

  const updateSettings = (
    field: keyof SettingsState,
    val: boolean | "cover" | "contain"
  ) => {
    setSettings((prevVal: SettingsState) => {
      return {
        ...prevVal,
        [field]: val,
      };
    });
  };

  const downloadAllImages = async () => {
    var i = 0;
    const imagesToDownload = new Map();
    for (let [, item] of itemMaster) {
      if (!item.imageLink) continue;
      if (imagesToDownload.has(item.imageName)) continue;
      imagesToDownload.set(item.imageName, item);
    }
    for (let [, item] of imagesToDownload) {
      let res = await fetch(item.imageLink, {
        mode: "cors",
      });

      const blob = await res.blob();

      const fileEntry = {
        id: item.imageName,
        imageName: item.imageName,
        name: item.imageLink.split("/").pop(),
        type: blob.type,
        content: blob,
      };

      const tx = db?.transaction("files", "readwrite");
      const store = tx?.objectStore("files");
      const id = await store?.put(fileEntry);
      i++;
      setDownloadProgress(i / imagesToDownload.size);
      console.log("File saved:", id);
    }
  };

  // Retrieve file entry from IndexedDB
  const retrieveImage = async (barcode: string) => {
    if (!barcode) return;
    const item = itemMaster.get(barcode);
    if (item) {
      const tx = db?.transaction("files", "readonly");
      const store = tx?.objectStore("files");
      const fileEntry = await store?.get(item.imageName);
      if (fileEntry && fileEntry.type.startsWith("image/")) {
        const blob = new Blob([fileEntry.content], { type: fileEntry.type });
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const csvFileToArray = (text: any) => {
    const csvRows = text.slice(text.indexOf("\n") + 1).split("\n");
    const map = (csvRows as string[]).reduce(
      (acc: Map<string, Item>, i: string) => {
        const values = i.split(",");
        const item: Item = {
          barcode: values[0].trim(),
          itemDescription: values[1].trim(),
          styleCode: values[2].trim(),
          color: values[3].trim(),
          season: values[4].trim() === "Autumn Winter" ? "AW" : "SS",
          year: values[5].trim(),
          imageName: values[6].trim(),
          imageLink: values[7].trim(),
        };
        acc.set(values[0].trim().toUpperCase(), item);
        return acc;
      },
      new Map()
    );
    console.log(map);
    map.delete("BARCODE");
    setItemMaster(map);
  };

  const handleBarcodeDataUpload = (file: File | null) => {
    if (!file) {
    } else {
      const fileReader = new FileReader();
      if (file) {
        fileReader.onload = function (event) {
          try {
            const text = event?.target?.result;
            csvFileToArray(text);
            toast({
              variant: "default",
              title: "Success!",
              description: "CSV uploaded. Map generated.",
            });
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Error!",
              description: "CSV upload failed. Error during conversion.",
            });
          }
        };
        fileReader.readAsText(file);
      }
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        setSettingsModalOpen,
        settings,
        setSettings,
        updateSettings,
        handleBarcodeDataUpload,
        downloadAllImages,
        itemMaster,
        imageUrl,
        retrieveImage,
        downloadProgress,
        db,
      }}
    >
      {children}
      {/* Settings Modal */}
      <DialogNonTrigger
        open={settingsModalOpen}
        content={<SettingsModalContent />}
        onCancel={() => setSettingsModalOpen(false)}
        title="Settings"
      />
    </SettingsContext.Provider>
  );
};
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }
  return context;
}

export default SettingsProvider;
