export type ThemeKey = "neon" | "dark" | "retro";

export interface SettingsData {
  playerName: string;
  masterVolume: number; // 0..1
  musicOn: boolean;
  sfxOn: boolean;
  avatarDataUrl: string;
  theme: ThemeKey;
}

export const DEFAULT_SETTINGS: SettingsData = {
  playerName: "Player",
  masterVolume: 0.5,
  musicOn: true,
  sfxOn: true,
  avatarDataUrl: "",
  theme: "neon",
};