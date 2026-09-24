import { SignupForm } from "@/components/signup-form";
import { DocuMindLogo } from "@/components/ui/logo";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account on DocuMind to start chatting with your enterprise and financial documents.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10 bg-muted/60">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium group">
          <DocuMindLogo size={32} showText={true} />
        </Link>
        <SignupForm />
      </div>
    </div>
  );
}
