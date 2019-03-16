/**
 * Represents a single Google Drive file.
 *
 * This object is just metadata for the file. Data for the file is stored in
 * the Realtime Document.
 * 
 * https://developers.google.com/drive/api/v3/reference/files
 */
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  kind: string;
}
