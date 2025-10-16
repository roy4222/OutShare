/**
 * SocialLinks 組件
 * 
 * 顯示社交媒體連結列表
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SocialLinksProps } from "@/lib/types/profile";
import { cn } from "@/lib/utils";

const SocialLinks = ({ links, className }: SocialLinksProps) => {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="transition-colors duration-200"
        >
          <FontAwesomeIcon
            icon={link.icon}
            className="text-green-700 hover:text-green-600 text-2xl"
          />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;

