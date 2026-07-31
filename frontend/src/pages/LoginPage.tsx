import LoginForm from "@/components/auth/LoginForm";
import AuthPageLayout from "@/layout/AuthPageLayout";

export default function LoginPage() {
    return (
        <AuthPageLayout authLink="login">
            <LoginForm />
        </AuthPageLayout>
    );
}
