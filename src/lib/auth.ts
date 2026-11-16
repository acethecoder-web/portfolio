import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const requireAdmin = cache(async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) redirect("/");

  return { email: claims.email as string | undefined };
});