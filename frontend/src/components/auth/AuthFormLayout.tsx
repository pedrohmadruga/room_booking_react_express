import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type AuthFormLayoutProps = Readonly<{
    title: string;
    description: string;
    children: React.ReactNode;
}>;

export default function AuthFormLayout({ title, description, children }: AuthFormLayoutProps) {
    return (
        <Card className="w-full max-w-md bg-white shadow-lg text-brand">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}