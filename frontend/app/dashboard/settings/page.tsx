"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useTheme } from "next-themes";

import { ReceiveInvite, columnsReceiveInvites } from "./columns-receive-invites";
import { SendInvite, columnsSendInvites } from "./columns-send-invites";
import { DataTable } from "../../../components/ui/data-table";

export default function SettingsPage() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john~example.com",
    notifications: {
      email: true,
      push: false,
    },
  });

  const { setTheme, theme } = useTheme();

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic here
    console.log("Profile updated:", user);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic here
    console.log("Password change attempted");
  };

  // interface Invite {
  //   id: string;
  //   name: string;
  //   email: string;
  //   unit: string;
  //   assignment: string;
  //   status: "Pending" | "Accepted" | "Declined";
  // }
  async function getReceiveInviteData(): Promise<ReceiveInvite[]> {
    return [
      {
        id: "1",
        name: "Jane Doe",
        email: "jane~example.com",
        unit: "Unit 1",
        assignment: "Project 1 for Software Architecture",
        status: "Pending",
      },
      {
        id: "2",
        name: "Joe Doe",
        email: "joe~example.com",
        unit: "Unit 2",
        assignment: "Midterm for Distributed Systems",
        status: "Accepted",
      },
      {
        id: "3",
        name: "Jack Doe",
        email: "jack~example.com",
        unit: "Unit 3",
        assignment: "Project 1 for Machine Learning Engineering	",
        status: "Pending",
      },
    ];
  }

  async function getSendInviteData(): Promise<SendInvite[]> {
    return [
      {
        id: "1",
        name: "Jane Doe",
        email: "jane~example.com",
        role: "Tutor",
      },
      {
        id: "2",
        name: "Joe Doe",
        email: "joe~example.com",
        role: "Tutor",
      },
      {
        id: "3",
        name: "Jack Doe",
        email: "jack~example.com",
        role: "Convener",
      },
    ];
  }

  const [receiveData, setReceiveData] = useState<ReceiveInvite[]>([]);
  const [sendData, setSendData] = useState<SendInvite[]>([]);

  useEffect(() => {
    async function fetchData() {
      const receiveInviteData = await getReceiveInviteData();
      const SendInviteData = await getSendInviteData();
      setReceiveData(receiveInviteData);
      setSendData(SendInviteData);
    }
    fetchData();
  }, []);

  return (
    <div className="p-8 space-y-5">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="general" className="space-y-4 w-full">
        <TabsList className="grid grid-cols-4 w-fit">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
          <TabsTrigger value="team">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="space-y-4 w-full max-w-96">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>
                  Change basic functionality of the website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="self-center">
                  <Label
                    htmlFor="airplane-mode"
                    className="pr-5 align-text-top"
                  >
                    Toggle Dark Mode
                  </Label>
                  <Switch
                    defaultChecked={false}
                    id="Enable Dark Mode"
                    onCheckedChange={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className=""
                  ></Switch>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage your notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">
                      Email Notifications
                    </Label>
                    <Switch
                      id="email-notifications"
                      checked={user.notifications.email}
                      onCheckedChange={(checked) =>
                        setUser({
                          ...user,
                          notifications: {
                            ...user.notifications,
                            email: checked,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">
                      Push Notifications
                    </Label>
                    <Switch
                      id="push-notifications"
                      checked={user.notifications.push}
                      onCheckedChange={(checked) =>
                        setUser({
                          ...user,
                          notifications: {
                            ...user.notifications,
                            push: checked,
                          },
                        })
                      }
                    />
                  </div>
                  <Button
                    onClick={() =>
                      console.log(
                        "Notification preferences saved:",
                        user.notifications
                      )
                    }
                  >
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <div className="space-y-4 md:min-w-96 md:w-1/4 w-96">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                  </div>
                  <Button type="submit">Update Profile</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button type="submit">Change Password</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invites">
          <div className="space-y-4 place-items-start w-full">
            <Card>
              <CardHeader>
                <CardTitle>Pending Invites</CardTitle>
                <CardDescription>Joining or declining invites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="container mx-auto py-5">
                  <DataTable columns={columnsReceiveInvites} data={receiveData} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sending Invites</CardTitle>
                <CardDescription>
                  Invite other teachers to join the assignment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="container mx-auto py-5">
                  <DataTable columns={columnsSendInvites} data={sendData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team"></TabsContent>
      </Tabs>
    </div>
  );
}
