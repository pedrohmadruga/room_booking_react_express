import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AdminRowActionsProps = Readonly<{
    onEdit?: () => void;
    onDelete?: () => void;
}>;

export default function AdminRowActions({ onEdit, onDelete }: AdminRowActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        type="button"
                        size="icon-sm"
                        className="border-slate-200 bg-white text-slate-500 shadow-none hover:bg-slate-50 hover:text-brand"
                        aria-label="Open actions"
                    />
                }
            >
                <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36 bg-white">
                <DropdownMenuItem onClick={onEdit} className="text-brand">Editar</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                    Deletar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
