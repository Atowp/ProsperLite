import {
  BusFront,
  Gift,
  Hamburger,
  Hospital,
  MicVocal,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";

const ICON_MAP = {
  meals: Hamburger,
  shopping: ShoppingBag,
  transport: BusFront,
  entertainment: MicVocal,
  medical: Hospital,
  other: Gift,
};

interface Props {
  iconKey: string;
  className?: string;
  size?: number;
}

export const CategoryIcon = ({ iconKey, ...props }: Props) => {
  const IconComponent =
    ICON_MAP[iconKey as keyof typeof ICON_MAP] || HelpCircle;
  return <IconComponent {...props} />;
};
