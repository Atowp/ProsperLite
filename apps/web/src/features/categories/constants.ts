import type { Category } from "@/schemas";

// Using unplugin-icons for tree-shakeable icon imports
import ChefHatIcon from "~icons/lucide/chef-hat";
import ShoppingBagIcon from "~icons/lucide/shopping-bag";
import CarFrontIcon from "~icons/lucide/car-front";
import Gamepad2Icon from "~icons/lucide/gamepad-2";
import HospitalIcon from "~icons/lucide/hospital";
import SmileIcon from "~icons/lucide/smile";
import WifiIcon from "~icons/lucide/wifi";
import CoffeeIcon from "~icons/lucide/coffee";
import UtensilsIcon from "~icons/lucide/utensils";
import PizzaIcon from "~icons/lucide/pizza";
import BeerIcon from "~icons/lucide/beer";
import IceCreamIcon from "~icons/lucide/ice-cream";
import ShoppingCartIcon from "~icons/lucide/shopping-cart";
import TagIcon from "~icons/lucide/tag";
import GiftIcon from "~icons/lucide/gift";
import BusIcon from "~icons/lucide/bus";
import TrainIcon from "~icons/lucide/train";
import BikeIcon from "~icons/lucide/bike";
import PlaneIcon from "~icons/lucide/plane";
import MusicIcon from "~icons/lucide/music";
import FilmIcon from "~icons/lucide/film";
import CameraIcon from "~icons/lucide/camera";
import TvIcon from "~icons/lucide/tv";
import WalletIcon from "~icons/lucide/wallet";
import BanknoteIcon from "~icons/lucide/banknote";
import CreditCardIcon from "~icons/lucide/credit-card";
import LandmarkIcon from "~icons/lucide/landmark";
import HeartIcon from "~icons/lucide/heart";
import ActivityIcon from "~icons/lucide/activity";
import StethoscopeIcon from "~icons/lucide/stethoscope";
import PillIcon from "~icons/lucide/pill";

export const ALL_CATEGORY_ICONS_MAP = {
  chefHat: ChefHatIcon,
  shoppingBag: ShoppingBagIcon,
  carFront: CarFrontIcon,
  gamepad2: Gamepad2Icon,
  hospital: HospitalIcon,
  smile: SmileIcon,
  wifi: WifiIcon,
  coffee: CoffeeIcon,
  utensils: UtensilsIcon,
  pizza: PizzaIcon,
  beer: BeerIcon,
  iceCream: IceCreamIcon,
  shoppingCart: ShoppingCartIcon,
  tag: TagIcon,
  gift: GiftIcon,
  bus: BusIcon,
  train: TrainIcon,
  bike: BikeIcon,
  plane: PlaneIcon,
  music: MusicIcon,
  film: FilmIcon,
  camera: CameraIcon,
  tv: TvIcon,
  wallet: WalletIcon,
  banknote: BanknoteIcon,
  creditCard: CreditCardIcon,
  landmark: LandmarkIcon,
  heart: HeartIcon,
  activity: ActivityIcon,
  stethoscope: StethoscopeIcon,
  pill: PillIcon,
};

export const ALL_CATEGORY_ICON_KEYS = Object.keys(
  ALL_CATEGORY_ICONS_MAP
) as (keyof typeof ALL_CATEGORY_ICONS_MAP)[];

export const DEFAULT_CATEGORY_ID = "0";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: DEFAULT_CATEGORY_ID,
    name: "Default",
    iconKey: "smile",
    createdAt: Date.now(),
    isSystem: true,
  },
  // { id: nanoid(), name: "Meals", iconKey: "chefHat", createdAt: Date.now() },
  // { id: nanoid(), name: "Shopping", iconKey: "shoppingBag", createdAt: Date.now() },
  // { id: nanoid(), name: "Transport", iconKey: "carFront", createdAt: Date.now() },
  // {
  //   id: nanoid(),
  //   name: "Entertainment",
  //   iconKey: "gamepad2",
  //   createdAt: Date.now(),
  // },
  // { id: nanoid(), name: "Medical", iconKey: "hospital", createdAt: Date.now() },
];
