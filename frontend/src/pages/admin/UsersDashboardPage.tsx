import { Plus, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { StatsGrid } from "@/components/admin/StatsGrid";
import StatCard from "@/components/admin/StatCard";
import { useEffect, useState } from "react";
import type { AdminUser } from "@/types/user";
import { deleteUser, getUsers } from "@/services/users";
import AdminDataPanel from "@/components/admin/AdminDataPanel";
import AdminRowActions from "@/components/admin/AdminRowActions";
import UserFormModal from "@/components/admin/UserFormModal";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

function wasCreatedInLastMonth(createdAt: string) {
    const created = new Date(createdAt);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return created >= monthAgo;
}

function formatCreatedAt(createdAt: string) {
    return new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function UsersDashboardPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

    useEffect(() => {
        getUsers()
            .then((data) => setUsers(data.users))
            .finally(() => setLoading(false));
    }, []);

    const totalUsers = users.length;
    const usersLastMonth = users.filter((user) =>
        wasCreatedInLastMonth(user.createdAt),
    ).length;

    function openCreateModal() {
        setEditingUser(null);
        setFormOpen(true);
    }

    function openEditModal(user: AdminUser) {
        setEditingUser(user);
        setFormOpen(true);
    }

    function handleUserSaved(savedUser: AdminUser) {
        setUsers((prev) => {
            const exists = prev.some((user) => user.id === savedUser.id);
            if (exists) {
                return prev.map((user) =>
                    user.id === savedUser.id ? savedUser : user,
                );
            }
            return [savedUser, ...prev];
        });
    }

    async function handleDeleteUser() {
        if (!userToDelete) return;
        await deleteUser(userToDelete.id);
        setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
    }

    if (loading) {
        return <p className="text-sm text-slate-500">Loading...</p>;
    }

    return (
        <>
            <AdminPageHeader
                title="Users Overview"
                description="Manage all users in your space. Add, edit or remove users."
                action={
                    <Button
                        type="button"
                        size="lg"
                        className="gap-2 bg-brand px-5 text-white hover:bg-brand-hover"
                        onClick={openCreateModal}
                    >
                        <Plus className="size-4" />
                        Add User
                    </Button>
                }
            />

            <StatsGrid>
                <StatCard
                    label="Total Users"
                    value={totalUsers}
                    helper="All users in the system"
                    icon={<Users className="size-4" />}
                    iconClassName="bg-blue-100 text-blue-600"
                />
                <StatCard
                    label="New This Month"
                    value={usersLastMonth}
                    helper="Users created in the last month"
                    icon={<UserPlus className="size-4" />}
                    iconClassName="bg-emerald-100 text-emerald-600"
                />
            </StatsGrid>

            <AdminDataPanel title="All Users">
                <table className="w-full min-w-[800px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500">
                            <th className="px-6 py-3.5 font-medium">Name</th>
                            <th className="px-6 py-3.5 font-medium">Email</th>
                            <th className="px-6 py-3.5 font-medium">CPF</th>
                            <th className="px-6 py-3.5 font-medium">Phone</th>
                            <th className="px-6 py-3.5 font-medium">Role</th>
                            <th className="px-6 py-3.5 font-medium">City</th>
                            <th className="px-6 py-3.5 font-medium">Created</th>
                            <th className="w-14 px-6 py-3.5 font-medium" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="bg-white transition-colors hover:bg-slate-50/60"
                            >
                                <td className="px-6 py-4 font-semibold text-brand">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                    {user.cpf}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                    {user.phone || "—"}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={
                                            user.isAdmin
                                                ? "rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand"
                                                : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                                        }
                                    >
                                        {user.isAdmin ? "Admin" : "User"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {user.address.city}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                                    {formatCreatedAt(user.createdAt)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <AdminRowActions
                                        onEdit={() => openEditModal(user)}
                                        onDelete={() => setUserToDelete(user)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </AdminDataPanel>

            <UserFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                user={editingUser}
                onSaved={handleUserSaved}
            />

            <ConfirmDeleteModal
                open={Boolean(userToDelete)}
                onOpenChange={(open) => {
                    if (!open) setUserToDelete(null);
                }}
                title={
                    userToDelete
                        ? `Delete ${userToDelete.name}?`
                        : "Delete user?"
                }
                description="This action cannot be undone. Bookings linked to this user may also be affected."
                onConfirm={handleDeleteUser}
            />
        </>
    );
}
