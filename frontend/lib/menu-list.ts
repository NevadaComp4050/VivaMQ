import {
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  LucideFileQuestion,
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
          href: "/units",
          label: "Units",
          active: pathname.startsWith("/units"),
          icon: SquarePen,
          submenus: [],
        },
        {
          href: "/assignments",
          label: "All Assignments",
          active: pathname === "/assignments",
          icon: Bookmark,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Users",
      menus: [
        {
          href: "/tutors",
          label: "Tutors",
          active: pathname === "/tutors",
          icon: Users,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "System",
      menus: [
        {
          href: "/settings",
          label: "Settings",
          active: pathname === "/settings",
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
