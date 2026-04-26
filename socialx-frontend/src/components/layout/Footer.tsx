import FriendSuggestionWidget from "./FriendSuggestionWidget";

const Footer = () => {
  return (
    <div className="flex h-full w-full flex-col gap-10 px-6 py-4">
      <FriendSuggestionWidget />
      <div className="mt-auto mb-4 px-4">
        <p className="text-muted-foreground text-center text-sm">
          &copy; {new Date().getFullYear()} SocialX. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
