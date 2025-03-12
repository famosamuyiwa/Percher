import * as ImageManipulator from "expo-image-manipulator";

async function compressImage(uri: string) {
  try {
    const result = await ImageManipulator.manipulateAsync(uri, [], {
      compress: 0.3, // Adjust compression level (0 to 1, where 1 is no compression)
      format: ImageManipulator.SaveFormat.JPEG, // Choose format
    });
    return result.uri; // Returns the URI of the compressed image
  } catch (error) {
    console.error("Error compressing image:", error);
    return null;
  }
}

export { compressImage };
