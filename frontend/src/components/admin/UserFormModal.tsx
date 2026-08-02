import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminUser } from "@/types/user";
import { createUser, updateUser } from "@/services/users";

type UserFormModalProps = Readonly<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: AdminUser | null;
    onSaved: (user: AdminUser) => void;
}>;

type FormState = {
    name: string;
    email: string;
    password: string;
    phone: string;
    cpf: string;
    isAdmin: boolean;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    cep: string;
    city: string;
    state: string;
};

const emptyForm: FormState = {
    name: "",
    email: "",
    password: "",
    phone: "",
    cpf: "",
    isAdmin: false,
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    cep: "",
    city: "",
    state: "",
};

const fieldClassName =
    "h-10 border border-slate-300 bg-white shadow-none focus-visible:border-brand focus-visible:ring-brand/20";

function getErrorMessage(err: unknown, fallback: string) {
    const data = (
        err as { response?: { data?: { message?: string; error?: string } } }
    )?.response?.data;
    return data?.message ?? data?.error ?? fallback;
}

function getSubmitLabel(saving: boolean, isEditing: boolean) {
    if (saving) return "Saving...";
    if (isEditing) return "Save changes";
    return "Create user";
}

export default function UserFormModal({
    open,
    onOpenChange,
    user = null,
    onSaved,
}: UserFormModalProps) {
    const isEditing = Boolean(user);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        setError(null);
        if (user) {
            setForm({
                name: user.name,
                email: user.email,
                password: "",
                phone: user.phone ?? "",
                cpf: user.cpf,
                isAdmin: user.isAdmin,
                street: user.address.street,
                number: user.address.number,
                complement: user.address.complement ?? "",
                neighborhood: user.address.neighborhood,
                cep: user.address.cep,
                city: user.address.city,
                state: user.address.state,
            });
        } else {
            setForm(emptyForm);
        }
    }, [open, user]);

    function handleOpenChange(nextOpen: boolean) {
        if (saving) return;
        onOpenChange(nextOpen);
    }

    function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(event: { preventDefault: () => void }) {
        event.preventDefault();
        setError(null);

        const name = form.name.trim();
        const email = form.email.trim();
        const cpf = form.cpf.trim();
        const password = form.password;

        if (!name || !email || !cpf) {
            setError("Name, email and CPF are required");
            return;
        }
        if (!isEditing && !password) {
            setError("Password is required");
            return;
        }

        const address = {
            street: form.street.trim(),
            number: form.number.trim(),
            complement: form.complement.trim() || null,
            neighborhood: form.neighborhood.trim(),
            cep: form.cep.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
        };

        if (
            !address.street ||
            !address.number ||
            !address.neighborhood ||
            !address.cep ||
            !address.city ||
            !address.state
        ) {
            setError("Please fill in all required address fields");
            return;
        }

        setSaving(true);
        try {
            if (isEditing && user) {
                const payload = {
                    name,
                    email,
                    cpf,
                    phone: form.phone.trim() || null,
                    isAdmin: form.isAdmin,
                    address,
                    ...(password ? { password } : {}),
                };
                const result = await updateUser(user.id, payload);
                onSaved(result.user);
            } else {
                const result = await createUser({
                    name,
                    email,
                    password,
                    cpf,
                    phone: form.phone.trim() || null,
                    isAdmin: form.isAdmin,
                    address,
                });
                onSaved(result.user);
            }
            onOpenChange(false);
        } catch (err: unknown) {
            setError(
                getErrorMessage(
                    err,
                    isEditing ? "Failed to update user" : "Failed to create user",
                ),
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-white p-6 text-brand sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-brand">
                        {isEditing ? "Edit User" : "Add User"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the user details below."
                            : "Fill in the details to create a new user."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="user-name">Name</Label>
                            <Input
                                id="user-name"
                                value={form.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                disabled={saving}
                                className={fieldClassName}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="user-email">Email</Label>
                            <Input
                                id="user-email"
                                type="email"
                                value={form.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                disabled={saving}
                                className={fieldClassName}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="user-password">
                                Password{isEditing ? " (optional)" : ""}
                            </Label>
                            <Input
                                id="user-password"
                                type="password"
                                value={form.password}
                                onChange={(e) => updateField("password", e.target.value)}
                                disabled={saving}
                                className={fieldClassName}
                                required={!isEditing}
                                placeholder={isEditing ? "Leave blank to keep" : ""}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="user-cpf">CPF</Label>
                            <Input
                                id="user-cpf"
                                value={form.cpf}
                                onChange={(e) => updateField("cpf", e.target.value)}
                                disabled={saving}
                                className={fieldClassName}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="user-phone">Phone</Label>
                            <Input
                                id="user-phone"
                                value={form.phone}
                                onChange={(e) => updateField("phone", e.target.value)}
                                disabled={saving}
                                className={fieldClassName}
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-brand">
                        <input
                            type="checkbox"
                            checked={form.isAdmin}
                            onChange={(e) => updateField("isAdmin", e.target.checked)}
                            disabled={saving}
                            className="size-4 rounded border-slate-300"
                        />
                        <span>Admin user</span>
                    </label>

                    <div className="border-t border-slate-100 pt-4">
                        <p className="mb-3 text-sm font-semibold text-brand">Address</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="user-street">Street</Label>
                                <Input
                                    id="user-street"
                                    value={form.street}
                                    onChange={(e) => updateField("street", e.target.value)}
                                    disabled={saving}
                                    className={fieldClassName}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="user-number">Number</Label>
                                <Input
                                    id="user-number"
                                    value={form.number}
                                    onChange={(e) => updateField("number", e.target.value)}
                                    disabled={saving}
                                    className={fieldClassName}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="user-complement">Complement</Label>
                                <Input
                                    id="user-complement"
                                    value={form.complement}
                                    onChange={(e) =>
                                        updateField("complement", e.target.value)
                                    }
                                    disabled={saving}
                                    className={fieldClassName}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="user-neighborhood">Neighborhood</Label>
                                <Input
                                    id="user-neighborhood"
                                    value={form.neighborhood}
                                    onChange={(e) =>
                                        updateField("neighborhood", e.target.value)
                                    }
                                    disabled={saving}
                                    className={fieldClassName}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="user-cep">CEP</Label>
                                <Input
                                    id="user-cep"
                                    value={form.cep}
                                    onChange={(e) => updateField("cep", e.target.value)}
                                    disabled={saving}
                                    className={fieldClassName}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="user-city">City</Label>
                                <Input
                                    id="user-city"
                                    value={form.city}
                                    onChange={(e) => updateField("city", e.target.value)}
                                    disabled={saving}
                                    className={fieldClassName}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="user-state">State</Label>
                                <Input
                                    id="user-state"
                                    value={form.state}
                                    onChange={(e) => updateField("state", e.target.value)}
                                    disabled={saving}
                                    className={fieldClassName}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {error ? (
                        <div className="rounded-xl bg-brand px-4 py-3 text-sm text-white shadow-sm">
                            <p className="font-semibold">Could not save</p>
                            <p className="mt-0.5 text-white/80">{error}</p>
                        </div>
                    ) : null}

                    <DialogFooter className="mx-0 mb-0 mt-2 gap-2 border-0 bg-transparent px-0 pb-2 pt-4 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-slate-300 bg-white text-brand hover:bg-slate-50"
                            onClick={() => handleOpenChange(false)}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-brand text-white hover:bg-brand-hover"
                            disabled={saving}
                        >
                            {getSubmitLabel(saving, isEditing)}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
