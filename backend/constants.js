/**
 * @type {{ ADMIN: "admin"; MANAGER: "manager"; SUPERADMIN: "superadmin";} as const}
 */
export const UserTypesEnum = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
};
export const AvailableUserTypes = Object.values(UserTypesEnum);

/**
 * @type {{ PERCENTAGE: "percentage"; FLAT: "flat"} as const}
 */
export const ChangeValueEnum = {
  PERCENTAGE: "percentage",
  FLAT: "flat",
};
export const AvailableChangeValueEnum = Object.values(ChangeValueEnum);

/**
 * @type {{ GOOGLE: "GOOGLE";  EMAIL_PASSWORD: "EMAIL_PASSWORD"} as const}
 */
export const UserLoginType = {
  GOOGLE: "GOOGLE",
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
};
export const AvailableUserLoginType = Object.values(UserLoginType);

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes
export const MAXIMUM_SUB_IMAGE_COUNT = 4;
export const MAXIMUM_SOCIAL_POST_IMAGE_COUNT = 6;
export const SALT_WORK_FACTOR = 10;
export const DB_NAME = "sentinel";
export const PF_RATE = 0.12;
