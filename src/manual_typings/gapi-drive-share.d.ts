declare namespace gapi.drive.share {
  export class ShareClient {}

  interface ShareClient {
    setOAuthToken: (oauthToken: string) => void;
    setItemIds: (itemIds: string[]) => void;
    showSettingsDialog: () => void;
  }
}
