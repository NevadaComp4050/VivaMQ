"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table";
import {
  columnsReceiveInvites,
  ReceiveInvite,
} from "./columns-receive-invites";
import { columnsSendInvites, SendInvite } from "./columns-send-invites";

export default function SettingsPage() {
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
    <div className="p-8">
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
    </div>
  );
}
