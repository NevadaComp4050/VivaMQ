"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { UserPlusIcon, TrashIcon } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, email: "tutor1~example.com", role: "Tutor" },
    { id: 2, email: "marker1~example.com", role: "Marker" },
  ]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("");

  const handleAddUser = () => {
    if (newUserEmail.trim() && newUserRole) {
      setUsers([
        ...users,
        { id: users.length + 1, email: newUserEmail, role: newUserRole },
      ]);
      setNewUserEmail("");
      setNewUserRole("");
    }
  };

  const handleRemoveUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
            <Select value={newUserRole} onValueChange={setNewUserRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tutor">Tutor</SelectItem>
                <SelectItem value="Marker">Marker</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddUser}>
              <UserPlusIcon className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
