import FriendSuggestionWidget from "../user/FriendSuggestionWidget";
// import ProfileWidget from "../user/ProfileWidget";

const Footer = () => {
  return (
    <div className="flex h-full w-full flex-col gap-6 px-6 py-4">
      {/* <ProfileWidget /> */}
      <FriendSuggestionWidget />
    </div>
  );
};

export default Footer;
