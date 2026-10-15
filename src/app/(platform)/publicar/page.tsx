import { redirect } from "next/navigation";
import { PublishForm } from "@/components/publish-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Publicar" };

export default async function PublicarPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  return (
    <div className="mx-auto max-w-lg">
      <PublishForm />
    </div>
  );
}
