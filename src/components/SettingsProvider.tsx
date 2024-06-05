import React, { useContext } from "react";

import { DialogNonTrigger } from "../shadcn/ui/dialog";
import { SettingsModalContent } from "./SettingsModal";
import { useToast } from "../shadcn/ui/use-toast";

export type SettingsState = {
  asZip: boolean;
  downloadTuner: number;
};

export type ItemNoToStyleMap = {
  fgItemNo: string;
  styleNo: string;
  sapColor: string;
  styleCode: string;
  season: "SS" | "AW";
  year: string;
  approvedColor: string;
};

export type Item = {
  barcode: string;
  itemNo: string;
  color: string;
  styleCode: string;
  season: "SS" | "AW";
  year: string;
};

const DEFAULT_SETTINGS_STATE: SettingsState = {
  asZip: true,
  downloadTuner: 2000,
};

type SettingsContextProps = {
  settings: SettingsState;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
  updateSettings: (field: keyof SettingsState, val: number | boolean) => void;
  setSettingsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  itemNoToStyleMap: Map<string, ItemNoToStyleMap> | undefined;
  createFGtoStyleMap: (file: File) => void;
  itemMasterMap: Map<string, Item> | undefined;
  createItemMasterMap: (file: File) => void;
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
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const [itemNoToStyleMap, setItemNoToStyleMap] =
    React.useState<Map<string, ItemNoToStyleMap>>();
  const [itemMasterMap, setItemMasterMap] = React.useState<Map<string, Item>>();

  const { toast } = useToast();

  const updateSettings = (
    field: keyof SettingsState,
    val: number | boolean
  ) => {
    setSettings((prevVal) => {
      return {
        ...prevVal,
        [field]: val,
      };
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const csvFileToArray = (text: any) => {
    const csvRows = text.slice(text.indexOf("\n") + 1).split("\n");
    const map = (csvRows as string[]).reduce(
      (acc: Map<string, ItemNoToStyleMap>, i: string) => {
        const values = i.split(",");
        const style: ItemNoToStyleMap = {
          fgItemNo: values[0].trim(),
          styleNo: values[1].trim(),
          sapColor: values[2].trim().replace(/ /g, ""),
          styleCode: values[3].trim(),
          season: values[4].trim() === "Autumn Winter" ? "AW" : "SS",
          year: values[5].trim(),
          approvedColor: values[6].trim(),
        };
        acc.set(values[0].trim().toUpperCase(), style);
        return acc;
      },
      new Map()
    );
    setItemNoToStyleMap(map);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemMasterToArray = (text: any) => {
    const csvRows = text.slice(text.indexOf("\n") + 1).split("\n");
    const map = (csvRows as string[]).reduce(
      (acc: Map<string, Item>, i: string) => {
        const values = i.split(",");
        if (values.length === 6) {
          const style: Item = {
            barcode: values[0].trim(),
            itemNo: values[1].trim(),
            color: values[3].trim().replace(/ /g, ""),
            styleCode: values[2].trim(),
            season: values[4].trim() === "Autumn Winter" ? "AW" : "SS",
            year: values[5].trim(),
          };
          acc.set(values[0].trim(), style);
        }
        return acc;
      },
      new Map()
    );
    setItemMasterMap(map);
  };

  const createFGtoStyleMap = (file: File) => {
    try {
      const fileReader = new FileReader();
      if (file) {
        fileReader.onload = function (event) {
          const text = event?.target?.result;
          csvFileToArray(text);
        };
        fileReader.readAsText(file);
      }
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

  const createItemMasterMap = (file: File) => {
    try {
      const fileReader = new FileReader();
      if (file) {
        fileReader.onload = function (event) {
          const text = event?.target?.result;
          itemMasterToArray(text);
        };
        fileReader.readAsText(file);
      }
      toast({
        variant: "default",
        title: "Success!",
        description: "CSV uploaded. Item master map generated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "CSV upload failed. Error during conversion. Retry!",
      });
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        setSettingsModalOpen,
        settings,
        setSettings,
        updateSettings,
        itemNoToStyleMap,
        createFGtoStyleMap,
        itemMasterMap,
        createItemMasterMap,
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
