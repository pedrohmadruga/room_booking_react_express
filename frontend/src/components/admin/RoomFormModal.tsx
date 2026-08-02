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
import type { Room } from "@/types/room";
import { createRoom, updateRoom } from "@/services/rooms";
import { resolveRoomImageUrl } from "@/lib/roomImage";

type RoomFormModalProps = Readonly<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    room?: Room | null;
    onSaved: (room: Room) => void;
}>;

type FormState = {
    name: string;
    description: string;
    capacity: string;
    price: string;
};

const emptyForm: FormState = {
    name: "",
    description: "",
    capacity: "",
    price: "",
};

const fieldClassName =
    "h-10 border border-slate-300 bg-white shadow-none focus-visible:border-brand focus-visible:ring-brand/20";

function getErrorMessage(err: unknown, fallback: string) {
    const data = (err as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data;
    return data?.message ?? data?.error ?? fallback;
}

function getSubmitLabel(saving: boolean, isEditing: boolean) {
    if (saving) return "Saving...";
    if (isEditing) return "Save changes";
    return "Create room";
}

export default function RoomFormModal({
    open,
    onOpenChange,
    room = null,
    onSaved,
}: RoomFormModalProps) {
    const isEditing = Boolean(room);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        setError(null);
        setImageFile(null);

        if (room) {
            setForm({
                name: room.name,
                description: room.description ?? "",
                capacity: String(room.capacity),
                price: String(room.price),
            });
            setPreviewUrl(resolveRoomImageUrl(room.imageUrl));
        } else {
            setForm(emptyForm);
            setPreviewUrl(null);
        }
    }, [open, room]);

    useEffect(() => {
        if (!imageFile) return;

        const objectUrl = URL.createObjectURL(imageFile);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [imageFile]);

    function handleOpenChange(nextOpen: boolean) {
        if (saving) return;
        onOpenChange(nextOpen);
    }

    function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleImageChange(fileList: FileList | null) {
        const file = fileList?.[0] ?? null;
        if (!file) {
            setImageFile(null);
            return;
        }

        const isAllowed =
            file.type === "image/png" ||
            file.type === "image/jpeg" ||
            file.type === "image/jpg";

        if (!isAllowed) {
            setError("Only PNG and JPG images are allowed");
            return;
        }

        setError(null);
        setImageFile(file);
    }

    async function handleSubmit(event: { preventDefault: () => void }) {
        event.preventDefault();
        setError(null);

        const name = form.name.trim();
        const capacity = Number(form.capacity);
        const price = Number(form.price);

        if (!name) {
            setError("Name is required");
            return;
        }
        if (!Number.isFinite(capacity) || capacity < 0) {
            setError("Capacity must be a valid number");
            return;
        }
        if (!Number.isFinite(price) || price < 0) {
            setError("Price must be a valid number");
            return;
        }

        const payload = {
            name,
            description: form.description.trim() || null,
            capacity,
            price,
        };

        setSaving(true);
        try {
            const result =
                isEditing && room
                    ? await updateRoom(room.id, payload, imageFile)
                    : await createRoom(payload, imageFile);

            onSaved(result.room);
            onOpenChange(false);
        } catch (err: unknown) {
            setError(
                getErrorMessage(
                    err,
                    isEditing ? "Failed to update room" : "Failed to create room",
                ),
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-white p-6 text-brand sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-brand">
                        {isEditing ? "Edit Room" : "Add Room"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the room details below."
                            : "Fill in the details to create a new room."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="room-name">Name</Label>
                        <Input
                            id="room-name"
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            placeholder="Meeting Room"
                            disabled={saving}
                            className={fieldClassName}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="room-description">Description</Label>
                        <textarea
                            id="room-description"
                            value={form.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Ideal for team meetings..."
                            disabled={saving}
                            rows={3}
                            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/20 disabled:opacity-50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="room-capacity">Capacity</Label>
                            <Input
                                id="room-capacity"
                                type="number"
                                min={0}
                                step={1}
                                value={form.capacity}
                                onChange={(e) => updateField("capacity", e.target.value)}
                                placeholder="20"
                                disabled={saving}
                                className={fieldClassName}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="room-price">Price</Label>
                            <Input
                                id="room-price"
                                type="number"
                                min={0}
                                step="0.01"
                                value={form.price}
                                onChange={(e) => updateField("price", e.target.value)}
                                placeholder="100.00"
                                disabled={saving}
                                className={fieldClassName}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="room-image">Photo</Label>
                        <Input
                            id="room-image"
                            type="file"
                            accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                            disabled={saving}
                            className={`${fieldClassName} cursor-pointer pt-1.5 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs file:font-medium file:text-brand`}
                            onChange={(e) => handleImageChange(e.target.files)}
                        />
                        <p className="text-xs text-slate-400">PNG or JPG, max 5MB.</p>
                        {previewUrl ? (
                            <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                <img
                                    src={previewUrl}
                                    alt="Room preview"
                                    className="aspect-video w-full object-cover"
                                />
                            </div>
                        ) : null}
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
