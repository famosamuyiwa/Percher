import { useState } from "react";
import * as MediaPicker from "expo-image-picker";
import useStorageBucket from "./useBackblazeStorageBucket";
import { MediaType } from "expo-image-picker";
import { ImagePickerMediaTypes } from "@/constants/common";

const useImagePicker = () => {
  const [imageUris, setImageUris] = useState<string[]>([]);
  const { uploadMultimedia, progress } = useStorageBucket();

  async function pickMultimedia(
    isUpload: boolean,
    editable?: boolean,
    allowMultiple?: boolean,
    mediaType?: MediaType | MediaType[]
  ) {
    return new Promise(async (resolve, reject) => {
      // No permissions request is necessary for launching the image library
      let result: any = await MediaPicker.launchImageLibraryAsync({
        mediaTypes: mediaType ?? ImagePickerMediaTypes.Images,
        allowsEditing: editable,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: allowMultiple,
      });
      if (result.canceled) return resolve(null);

      const newMedia = {
        uri: result.assets.map((asset: any) => asset.uri),
      };

      setImageUris((prevImages) => [...prevImages, newMedia.uri]);

      if (isUpload) {
        await uploadMultimedia(
          imageUris.map((uri) => ({ uri })),

          function (downloadUrls: any) {
            setImageUris([]);

            //return promise resolve on successful upload
            resolve({
              downloadUrls,
            });
          }
        );
      } else {
        resolve(newMedia);
      }
    });
  }

  return { imageUris, pickMultimedia, setImageUris, progress };
};

export default useImagePicker;
