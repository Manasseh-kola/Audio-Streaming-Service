const createTokenUser = (user) => {
  return {
    name: user.name,
    user_name: user.user_name,
    rating: user.rating,
    bio: user.bio,
    followers_count: user.followers_count,
    following_count: user.following_count,
    userId: user._id,
    email: user.email,
  };
};

module.exports = createTokenUser;
