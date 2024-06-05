import JSZip from "jszip";
import { ImageFile } from "../components/ImagesProvider";

export type DownloadImage = { file: ImageFile; renamedFileName: string };

export const downloadImage = (url: string, fileName: string) => {
  const element = document.createElement("a");
  element.href = url;
  element.download = fileName;

  document.body.appendChild(element);
  element.click();
  element.remove();
};

export const downloadImageArray = (
  imageArray: DownloadImage[],
  downloadTuner: number = 300
) => {
  const downloadNext = (i: number) => {
    const arrLength = imageArray.length;
    if (arrLength > i) {
      downloadImage(imageArray[i].file.url, imageArray[i].renamedFileName);
    } else return;
    if (arrLength > i + 1) {
      downloadImage(
        imageArray[i + 1].file.url,
        imageArray[i + 1].renamedFileName
      );
    } else return;
    if (arrLength > i + 2) {
      downloadImage(
        imageArray[i + 2].file.url,
        imageArray[i + 2].renamedFileName
      );
    } else return;
    if (arrLength > i + 3) {
      downloadImage(
        imageArray[i + 3].file.url,
        imageArray[i + 3].renamedFileName
      );
    } else return;
    if (arrLength > i + 4) {
      downloadImage(
        imageArray[i + 4].file.url,
        imageArray[i + 4].renamedFileName
      );
    } else return;
    setTimeout(function () {
      downloadNext(i + 5);
    }, downloadTuner);
  };
  downloadNext(0);
};

export const downloadImageArrayAsZip = async (imageArray: DownloadImage[]) => {
  const zip = new JSZip();
  imageArray.forEach((img) => {
    zip.file(img.renamedFileName, img.file.file);
  });
  const zipFile = await zip.generateAsync({ type: "blob" });
  downloadImage(URL.createObjectURL(zipFile), "renamed imaged.zip");
};
