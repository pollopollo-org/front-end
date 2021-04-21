import { UserModel, UserTypes } from "src/ts/models/UserModel";
import { isProducerUser, isReceiverUser } from "src/ts/utils/verifyUserModel";

/**
 * Simple helper that returns the userType of a given user, or falling back to
 * an optionally defined fallback.
 */
export function getUserType(
  user: UserModel | null | undefined,
  fallback?: UserTypes
) {
  if (!user) return UserTypes.UNDEFINED;
  if (isProducerUser(user)) return UserTypes.PRODUCER;
  if (isReceiverUser(user)) return UserTypes.RECEIVER;
  return UserTypes.UNDEFINED;
}
