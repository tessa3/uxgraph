declare namespace gapi.drive.share {
  export function ShareClient(): void;

  interface ShareClient {
    setOAuthToken: (oauthToken: string) => void;
    setItemIds: (itemIds: string[]) => void;
    showSettingsDialog: () => void;
  }
}
