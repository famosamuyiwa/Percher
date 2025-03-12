import { useState } from "react";
import * as MediaPicker from "expo-image-picker";
import { compressImage } from "./useImageManipulator";
import useStorageBucket from "./useStorageBucket";

const useImagePicker = () => {
  const [image, setImage] = useState<string[]>([]);
  const { uploadMultimedia, progress } = useStorageBucket();

  async function pickMultimedia(
    isUpload: boolean,
    editable?: boolean,
    allowMultiple?: boolean
  ) {
    return new Promise(async (resolve, reject) => {
      // No permissions request is necessary for launching the image library
      let result: any = await MediaPicker.launchImageLibraryAsync({
        mediaTypes: MediaPicker.MediaTypeOptions.Images,
        allowsEditing: editable,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: allowMultiple,
      });
      if (result.canceled) return resolve(null);

      const newMedia = {
        uri: result.assets.map((asset: any) => asset.uri),
        fileType: result.assets[0].type,
        fileName: result.assets[0].fileName,
      };

      setImage((prevImages) => [...prevImages, newMedia.uri]);

      if (isUpload) {
        await uploadMultimedia(
          {
            uri: result.assets[0].uri,
            fileType: result.assets[0].type,
          },
          function (downloadUrl: any) {
            setImage([]);

            //return promise resolve on successful upload
            resolve({
              downloadUrl,
              fileType: result.assets[0].type,
              fileName: result.assets[0].fileName,
            });
          }
        );
      } else {
        resolve(newMedia);
      }
    });
  }

  return { image, pickMultimedia, setImage, progress };
};

export default useImagePicker;
