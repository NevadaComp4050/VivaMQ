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
          href: "/dashboard/units",
          label: "Units",
          active: pathname.startsWith("/dashboard/units"),
          icon: SquarePen,
          submenus: [],
        },
        {
          href: "/dashboard/assignments",
          label: "All Assignments",
          active: pathname === "/dashboard/assignments",
          icon: Bookmark,
          submenus: [],
        },
        {
          href: " /dashboard/quality-assurance",
          label: "Quality Assurance",
          active: pathname.startsWith("/dashboard/quality-assurance"),
          icon: BookLock,
          submenus: [],
        },
        // {
        //   href: "/dashboard/rubrics",
        //   label: "Rubrics",
        //   active: pathname === "/dashboard/rubrics",
        //   icon: BookOpenText,
        //   submenus: [],
        // },
      ],
    },
    /* {
      groupLabel: "Users",
      menus: [
        {
          href: "/dashboard/tutors",
          label: "Tutors",
          active: pathname === "/dashboard/tutors",
          icon: Users,
          submenus: [],
        },
      ],
    }, */
    /* {
      groupLabel: "System",
      menus: [
        {
          href: "/dashboard/settings",
          label: "Settings",
          active: pathname === "/dashboard/settings",
          icon: Settings,
          submenus: [],
        },
      ],
    }, */
  ];
}
