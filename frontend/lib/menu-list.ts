import {
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  LucideFileQuestion,
  BookLock,
  BookOpenText,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname === "/dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Manage",
      menus: [
        {
          href: "/dashboard/assignments",
          label: "All Assignments",
          active: pathname === "/dashboard/assignments",
          icon: Bookmark,
          submenus: [],
        },
        {
          href: "/dashboard/rubrics",
          label: "Rubrics",
          active: pathname === "/dashboard/rubrics",
          icon: BookOpenText,
          submenus: [],
        },
        {
          href: "/dashboard/units/create",
          label: "Create Unit",
          active: pathname === "/dashboard/units/create",
          icon: SquarePen,
          submenus: [],
        },
      ],
    },
  ];
}
