import { Block, LayoutConfig } from "../store/slices/layoutSlice";

export function saveLayoutConfigToLocalStorage(config: LayoutConfig): void {
  try {
    const configWithTimestamp = {
      ...config,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(
      "contentful-layout-config",
      JSON.stringify(configWithTimestamp)
    );

    cleanupOldBackups();
  } catch (error) {
    console.error("Error saving layout config:", error);
  }
}

export function loadFromLocalStorage(): LayoutConfig | null {
  try {
    const raw = localStorage.getItem("contentful-layout-config");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Error loading layout config:", error);
    return null;
  }
}

function cleanupOldBackups(): void {
  if (typeof window === "undefined") return;

  try {
    const backupKeys = Object.keys(localStorage)
      .filter((key) => key.startsWith("contentful-layout-backup-"))
      .sort()
      .reverse();

    const keysToDelete = backupKeys.slice(5);
    keysToDelete.forEach((key) => {
      localStorage.removeItem(key);
      console.log("Cleaned up old backup:", key);
    });
  } catch (error) {
    console.error("Error cleaning up backups:", error);
  }
}
