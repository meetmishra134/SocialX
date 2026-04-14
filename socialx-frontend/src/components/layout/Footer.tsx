import { Input } from "../ui/input";
import FriendSuggestionWidget from "./FriendSuggestionWidget";

const Footer = () => {
  return (
    <div className="flex h-full w-full flex-col gap-10 px-6 py-4">
      <div className="w-76">
        <Input
          type="text"
          placeholder="Search post with #topics"
          className="bg-secondary focus:ring-primary focus:ring-offset-secondary border-border w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-offset-2"
        />
      </div>
      <FriendSuggestionWidget />
    </div>
  );
};

export default Footer;
