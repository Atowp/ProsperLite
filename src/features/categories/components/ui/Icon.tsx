import { type LucideIcon } from "lucide-react";
import { ALL_CATEGORY_ICONS_MAP } from "../../constants";

interface CategoryIconProps extends React.ComponentProps<LucideIcon> {
  iconKey: string;
  className?: string;
  size?: number;
}

export const CategoryIcon = ({ iconKey, ...props }: CategoryIconProps) => {
  const IconComponent =
    ALL_CATEGORY_ICONS_MAP[iconKey as keyof typeof ALL_CATEGORY_ICONS_MAP];
  if (!IconComponent) {
    return <ALL_CATEGORY_ICONS_MAP.default {...props} />;
  }
  return <IconComponent {...props} />;
};
