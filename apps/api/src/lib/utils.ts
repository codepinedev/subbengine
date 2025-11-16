export enum LeaderboardStatus {
  ARCHIVED = "archived",
  ACTIVE = "active",
}

export enum ApiKeyStatus {
  ENABLED = "enabled",
  REVOKED = "revoked",
}

export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}
