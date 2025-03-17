// import { config, storage } from "@/lib/appwrite";
// import { useState } from "react";

// const BUCKET_ID = config.storageBucketId!;

// const useStorageBucket = () => {
//   const [progress, setProgress] = useState(0);

//   async function uploadMultimedia(details: any, callback: (url: URL) => void) {
//     try {
//       const fileId = new Date().getTime().toString(); // Generate unique file ID
//       // Create file metadata for Appwrite Storage
//       const file = {
//         name: `upload_${fileId}.jpg`,
//         type: "image/jpeg", // Adjust based on your file type
//         size: 0, // Appwrite calculates this, so it's fine to leave as 0
//         uri: details.uri, // This is required for React Native
//       };
//       // Upload to Appwrite Storage
//       const uploadedFile = await storage.createFile(BUCKET_ID, fileId, file);

//       // Get file URL
//       const fileUrl = storage.getFilePreview(BUCKET_ID, uploadedFile.$id);

//       callback(fileUrl);
//     } catch (error) {
//       console.error("Upload failed:", error);
//     }
//   }

//   return { uploadMultimedia, progress };
// };

// export default useStorageBucket;
