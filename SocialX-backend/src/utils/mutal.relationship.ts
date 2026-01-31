import { User } from "../models/user.model";

const hasMutualFollowing = async (userA: string, userB: string) => {
  const mutual =
    (await User.exists({
      _id: userA,
      following: userB,
    })) &&
    (await User.exists({
      _id: userB,
      following: userA,
    }));
  return Boolean(mutual);
};
export { hasMutualFollowing };
