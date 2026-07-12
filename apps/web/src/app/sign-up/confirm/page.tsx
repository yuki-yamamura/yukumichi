import { redirect } from "next/navigation";

import { ConfirmSignUpFormContainer } from "@/features/account/components/confirm-sign-up-form-container";

export default async function ConfirmSignUpPage({ searchParams }: PageProps<"/sign-up/confirm">) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : undefined;

  if (!email) {
    redirect("/sign-up");
  }

  return (
    <main>
      <h1>Verify your email</h1>
      <p>
        A verification code has been sent to <strong>{email}</strong>. Enter it below to finish
        signing up.
      </p>
      <ConfirmSignUpFormContainer email={email} />
    </main>
  );
}
