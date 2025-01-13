export const languages = ["en-US", "ko"] as const;
export type Language = (typeof languages)[number];