import { RenameState } from "../components/ImagesProvider";
import { DownloadImage } from "./downloading";

export const getImagesFromRenameState = (rs: RenameState) => {
  const renamedImageArray: DownloadImage[] = [];
  const { styleCode, color, photoType, photoshootType, season, year } =
    rs.styleParams;

  rs.frontImages.forEach((file, idx) => {
    renamedImageArray.push({
      file,
      renamedFileName: `${season}${year.slice(
        -2
      )}-${styleCode}-${color}-${photoType}-${photoshootType}-1F${idx + 1}.jpg`,
    });
  });

  rs.backImages.forEach((file, idx) => {
    renamedImageArray.push({
      file,
      renamedFileName: `${season}${year.slice(
        -2
      )}-${styleCode}-${color}-${photoType}-${photoshootType}-2B${idx + 1}.jpg`,
    });
  });

  rs.sideImages.forEach((file, idx) => {
    renamedImageArray.push({
      file,
      renamedFileName: `${season}${year.slice(
        -2
      )}-${styleCode}-${color}-${photoType}-${photoshootType}-3S${idx + 1}.jpg`,
    });
  });

  rs.zoomImages.forEach((file, idx) => {
    renamedImageArray.push({
      file,
      renamedFileName: `${season}${year.slice(
        -2
      )}-${styleCode}-${color}-${photoType}-${photoshootType}-4Z${idx + 1}.jpg`,
    });
  });

  rs.extraImages.forEach((file, idx) => {
    renamedImageArray.push({
      file,
      renamedFileName: `${season}${year.slice(
        -2
      )}-${styleCode}-${color}-${photoType}-${photoshootType}-5E${idx + 1}.jpg`,
    });
  });
  return renamedImageArray;
};
