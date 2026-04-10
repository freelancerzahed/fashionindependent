"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const users = [
    {
      id: "1",
      name: "Jane Designer",
      email: "jane@example.com",
      role: "creator",
      status: "active",
      joinedAt: "2025-09-01",
      campaigns: 2,
    },
    {
      id: "2",
      name: "John Smith",
      email: "john@example.com",
      role: "creator",
      status: "active",
      joinedAt: "2025-09-15",
      campaigns: 1,
    },
    {
      id: "3",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "backer",
      status: "active",
      joinedAt: "2025-10-01",
      campaigns: 0,
    },
    {
      id: "4",
      name: "Mike Influencer",
      email: "mike@example.com",
      role: "influencer",
      status: "active",
      joinedAt: "2025-10-05",
      campaigns: 0,
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <main className="flex-1 bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>

        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Joined</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-neutral-100">
                  <td className="py-3 px-4 font-semibold">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <Badge>{user.role}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{user.status}</Badge>
                  </td>
                  <td className="py-3 px-4">{user.joinedAt}</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
