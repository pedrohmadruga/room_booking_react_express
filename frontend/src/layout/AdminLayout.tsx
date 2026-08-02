import { Outlet } from "react-router-dom";
import PageLayout from "@/layout/PageLayout";

export default function AdminLayout() {
    return (
        <PageLayout
            variant="admin"
            mainClassName="mx-auto w-full max-w-7xl bg-slate-50 px-4 py-8 md:px-8"
        >
            <Outlet />
        </PageLayout>
    );
}
