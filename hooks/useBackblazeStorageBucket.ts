import axios from "axios";
import { useState } from "react";
import * as FileSystem from "expo-file-system";

const B2_KEY_ID = process.env.EXPO_PUBLIC_BACKBLAZE_KEY_ID!;
const B2_APPLICATION_KEY = process.env.EXPO_PUBLIC_BACKBLAZE_APPLICATION_KEY!;
const B2_BUCKET_ID = process.env.EXPO_PUBLIC_BACKBLAZE_BUCKET_ID!;
const B2_BUCKET_NAME =
  process.env.EXPO_PUBLIC_BACKBLAZE_BUCKET_NAME || "percher-multimedia";

const useStorageBucket = () => {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  async function uploadMultimedia(
    files: any[],
    callback: (urls: string[]) => void
  ) {
    try {
      setError(null);
      // Step 1: Authenticate & Get Authorization Token
      const authResponse = await axios.get(
        "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
        {
          auth: {
            username: B2_KEY_ID,
            password: B2_APPLICATION_KEY,
          },
        }
      );

      const { apiUrl, authorizationToken, downloadUrl } = authResponse.data;

      // Step 2: Get Upload URL
      const uploadUrlResponse = await axios.post(
        `${apiUrl}/b2api/v2/b2_get_upload_url`,
        { bucketId: B2_BUCKET_ID },
        { headers: { Authorization: authorizationToken } }
      );

      const { uploadUrl, authorizationToken: uploadAuthToken } =
        uploadUrlResponse.data;

      let uploadedUrls: string[] = [];

      // Step 3: Upload Each File in Parallel
      await Promise.all(
        files.map(async (file, index) => {
          try {
            // Step 2: Get fresh Upload URL for each file
            console.log(`Getting upload URL for file`);
            const uploadUrlResponse = await axios({
              method: "post",
              url: `${apiUrl}/b2api/v2/b2_get_upload_url`,
              data: { bucketId: B2_BUCKET_ID },
              headers: { Authorization: authorizationToken },
              timeout: 10000,
            });

            const { uploadUrl, authorizationToken: uploadAuthToken } =
              uploadUrlResponse.data;

            // Step 3: Prepare file for upload
            console.log(`Processing file: ${file.uri}`);

            // Get file info
            const fileInfo = await FileSystem.getInfoAsync(file.uri);
            if (!fileInfo.exists || fileInfo.size === 0) {
              throw new Error(`File doesn't exist or is empty: ${file.uri}`);
            }

            // Determine file extension and mime type
            const fileExt = getFileExtension(file.uri);
            const mimeType = getMimeType(fileExt);

            // Generate a unique filename
            const timestamp = new Date().getTime();
            const fileName = `upload_${timestamp}.${fileExt}`;

            console.log(
              `Uploading ${fileName}, size: ${fileInfo.size} bytes, type: ${mimeType}`
            );

            // Use direct file upload method
            const uploadResponse = await FileSystem.uploadAsync(
              uploadUrl,
              file.uri,
              {
                headers: {
                  Authorization: uploadAuthToken,
                  "X-Bz-File-Name": encodeURIComponent(fileName),
                  "Content-Type": mimeType,
                  "X-Bz-Content-Sha1": "do_not_verify",
                },
                uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
                httpMethod: "POST",
              }
            );

            if (uploadResponse.status !== 200) {
              throw new Error(
                `Upload failed with status ${uploadResponse.status}: ${uploadResponse.body}`
              );
            }

            // Parse response
            const responseData = JSON.parse(uploadResponse.body);

            // Construct the proper download URL
            const fileUrl = `${downloadUrl}/file/${B2_BUCKET_NAME}/${encodeURIComponent(
              responseData.fileName
            )}`;

            console.log("Successfully uploaded file: ", fileUrl);
            uploadedUrls.push(fileUrl);

            // Update progress
            setProgress((prev) => ({
              ...prev,
              [file.uri]: 100,
            }));
          } catch (error: any) {
            console.error(`Upload failed for ${file.uri}:`, error);
            setError(`Upload failed: ${error.message}`);
          }
        })
      );

      if (uploadedUrls.length > 0) {
        callback(uploadedUrls);
      } else {
        setError("No files were successfully uploaded");
      }
    } catch (error: any) {
      console.error("Bulk upload failed:", error);
      setError(`Upload initialization failed: ${error.message}`);
    }
  }

  // Helper function to get file extension
  const getFileExtension = (uri: string): string => {
    const parts = uri.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() || "jpg" : "jpg";
  };

  return { uploadMultimedia, progress, error };
};

// Helper function to get MIME type based on file extension
const getMimeType = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    mp4: "video/mp4",
    mov: "video/quicktime",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    pdf: "application/pdf",
  };

  return mimeTypes[extension] || "application/octet-stream";
};

export default useStorageBucket;
