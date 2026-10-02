export interface SharePayload {
  title: string;
  text: string;
  url?: string;
  copiedAlertMessage?: string;
}

export const shareOrCopy = async (payload: SharePayload): Promise<boolean> => {
  const { title, text, url = window.location.href, copiedAlertMessage } = payload;

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      // User dismissed or share failed, fallback to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    if (copiedAlertMessage) {
      alert(copiedAlertMessage);
    }
    return true;
  } catch {
    return false;
  }
};
