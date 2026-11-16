import { ProjectForm } from "@/components/admin/ProjectForm";
import { getAllTags } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { createProject } from "../actions";

export default async function NewProjectPage() {
  await requireAdmin();
  const tags = await getAllTags();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New project</h1>
      <ProjectForm action={createProject} tags={tags} submitLabel="Create project" />
    </div>
  );
}