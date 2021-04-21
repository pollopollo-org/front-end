import { UserModel, UserTypes } from "src/ts/models/UserModel";
import { isDonerUser, isProducerUser, isReceiverUser } from "src/ts/utils/verifyUserModel";

/**
 * Simple helper that returns the userType of a given user, or falling back to
 * an optionally defined fallback.
 */
export function getUserType(
  user: UserModel | null | undefined,
) {
  if (!user) return UserTypes.UNDEFINED;
  if (isProducerUser(user)) return UserTypes.PRODUCER;
  if (isReceiverUser(user)) return UserTypes.RECEIVER;
  if (isDonerUser(user)) return UserTypes.DONOR;
  return UserTypes.UNDEFINED;
}
