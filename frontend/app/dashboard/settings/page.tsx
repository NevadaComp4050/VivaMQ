"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useTheme } from "next-themes";

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

  return (
    <div className="p-8 space-y-5">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Change basic functionality of the website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="self-center">
              <Label htmlFor="airplane-mode" className="pr-5 align-text-top">
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
      </div>

      <div className="space-y-4">
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
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <Button type="submit">Update Profile</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
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
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button type="submit">Change Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage your notification settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
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
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Switch
                  id="push-notifications"
                  checked={user.notifications.push}
                  onCheckedChange={(checked) =>
                    setUser({
                      ...user,
                      notifications: { ...user.notifications, push: checked },
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
    </div>
  );
}