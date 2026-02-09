import { useState } from "react";
import { ALL_CATEGORY_ICON_KEYS, ALL_CATEGORY_ICONS_MAP } from "../constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import SearchIcon from "~icons/lucide/search";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/ui";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryIconPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
}

export function CategoryIconPicker({
  value,
  onChange,
  error,
}: CategoryIconPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const IconComponent =
    ALL_CATEGORY_ICONS_MAP[value as keyof typeof ALL_CATEGORY_ICONS_MAP] ||
    ALL_CATEGORY_ICONS_MAP.smile;

  const filteredIcons = ALL_CATEGORY_ICON_KEYS.filter((key) =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between h-10",
            error && "border-destructive text-destructive"
          )}
        >
          <div className="flex items-center gap-2 pl-2.5">
            <IconComponent className="h-4 w-4" />
            <span className="capitalize">{value || "Select icon"}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search icons..."
                className="pl-9 h-9 bg-background focus-visible:ring-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-64 px-3 py-3">
            <div className="grid grid-cols-5 gap-2">
              {filteredIcons.map((key) => {
                const Icon =
                  ALL_CATEGORY_ICONS_MAP[
                    key as keyof typeof ALL_CATEGORY_ICONS_MAP
                  ];
                const isSelected = value === key;

                return (
                  <Button
                    key={key}
                    type="button"
                    variant="ghost"
                    className={cn(
                      "h-11 w-11 p-0 rounded-md transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground hover:shadow-sm"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => {
                      onChange?.(key);
                      setOpen(false);
                    }}
                    title={key}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                );
              })}
            </div>
            {filteredIcons.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <p className="text-sm">No icons found</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
