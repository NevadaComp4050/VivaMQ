import React from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useSidebarToggle } from "~/hooks/use-sidebar-toggle";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-auto place-content-center p-10">
        <CardTitle>Login</CardTitle>
        <CardContent className="mt-5">
          <Input placeholder="OneID" className="flex md:w-96 sm:w-auto mb-5" />
          <Input
            type="password"
            placeholder="Password"
            className="flex md:w-96 sm:w-auto mb-5"
          />
          <Button className="float-right" variant="default" type="submit" size="default">
            <Link href={"/dashboard"}>Login</Link>
          </Button>
          <p className="text-xs opacity-50">
            Can't log in?{" "}
            <a
              href="https://students.mq.edu.au/support/technology/service-desk"
              className=""
            >
              Contact Help Desk
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
