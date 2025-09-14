import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faSquareFacebook,
  faThreads,
} from "@fortawesome/free-brands-svg-icons";

const ProfileBlock = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Avatar>
        <AvatarImage src="/S__40583184_0.jpg" />
        <AvatarFallback>loading...</AvatarFallback>
      </Avatar>
      <div className="text-2xl font-bold mt-4">KJ</div>
      <div className="text-xl mt-2 text-gray-500">
        新創產品經理・登山野營・單車野營・自助旅行
      </div>
      <div className="flex items-center gap-3 mt-4">
        {[
          {
            href: "https://www.instagram.com/kj.h.730/",
            icon: faInstagram,
            label: "Instagram",
          },
          {
            href: "https://www.facebook.com/kj790730",
            icon: faSquareFacebook,
            label: "Facebook",
          },
          {
            href: "https://www.threads.com/@kj.h.730",
            icon: faThreads,
            label: "Threads",
          },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
          >
            <FontAwesomeIcon
              icon={link.icon}
              className="size-6 text-green-700 hover:text-green-600"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProfileBlock;
