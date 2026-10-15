import { redirect } from "next/navigation";
import { updateProfileAction } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";
import { USER_TYPES } from "@/lib/constants";

export const metadata = { title: "Editar perfil" };

export default async function EditProfilePage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  const p = me.profile;
  return (
    <form action={updateProfileAction} className="mx-auto max-w-lg space-y-3">
      <h1 className="font-display text-2xl font-semibold">Editar perfil</h1>
      <input name="displayName" defaultValue={p.displayName} className="input" />
      <input name="roleTitle" defaultValue={p.roleTitle} className="input" />
      <select name="userType" defaultValue={p.userType} className="input">
        {USER_TYPES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>
      <input name="neighborhood" defaultValue={p.neighborhood} className="input" />
      <input name="phone" defaultValue={p.phone ?? ""} placeholder="Teléfono" className="input" />
      <textarea name="bio" defaultValue={p.bio} rows={4} className="input" />
      <button className="btn-primary w-full py-3.5">Guardar</button>
    </form>
  );
}
