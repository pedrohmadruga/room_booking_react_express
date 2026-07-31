import RegisterForm from "@/components/auth/RegisterForm";
import AuthPageLayout from "@/layout/AuthPageLayout";

export default function RegisterPage() {
    return (
        <AuthPageLayout authLink="register">
            <RegisterForm />
        </AuthPageLayout>
    )
}