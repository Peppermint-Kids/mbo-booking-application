import { ImageFile } from "../components/ImagesProvider";

export type ImageType = {
  id: string;
  angle: string;
  file: ImageFile;
};

export type ColumnType = {
  id: string;
  title: string;
  images: ImageType[];
};

export type ImageBoardType = {
  columns: ColumnType[];
};

export const api: ImageBoardType = {
  columns: [
    {
      id: "image-gallery",
      title: "Image Gallery",
      images: [],
    },
    {
      id: "front-images",
      title: "Front",
      images: [],
    },
    {
      id: "back-images",
      title: "Back",
      images: [],
    },
    {
      id: "side-images",
      title: "Side",
      images: [],
    },
    {
      id: "zoom-images",
      title: "Zoom",
      images: [],
    },
    {
      id: "extra-images",
      title: "Extras",
      images: [],
    },
  ],
};
