"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  AArrowDown,
  AArrowUp,
  ChevronsUpDown,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export type ReceiveInvite = {
  id: string;
  name: string;
  email: string;
  unit: string;
  assignment: string;
  status: "Pending" | "Accepted" | "Declined";
};

export const columnsReceiveInvites: ColumnDef<ReceiveInvite>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Inviter name
          <ChevronsUpDown className="ml-2 h-4 w-4"></ChevronsUpDown>
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Inviter name
          <ChevronsUpDown className="ml-2 h-4 w-4"></ChevronsUpDown>
        </Button>
      );
    },
  },
  {
    accessorKey: "unit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unit name
          <ChevronsUpDown className="ml-2 h-4 w-4"></ChevronsUpDown>
        </Button>
      );
    },
  },
  {
    accessorKey: "assignment",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignment
          <ChevronsUpDown className="ml-2 h-4 w-4"></ChevronsUpDown>
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invite status
          <ChevronsUpDown className="ml-2 h-4 w-4"></ChevronsUpDown>
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const col = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            <DropdownMenuItem>Accept invite</DropdownMenuItem>
            <DropdownMenuItem>Decline invite</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
