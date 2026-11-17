import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getAdminProject, getAllTags } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { updateProject } from "../../actions";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const [project, tags] = await Promise.all([getAdminProject(id), getAllTags()]);
  if (!project) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit: {project.title}</h1>
      <Link
  href={`/admin/projects/${project.id}/gallery`}
  className="-mt-3 mb-6 inline-block text-sm text-accent hover:underline"
>
  Manage snapshots →
</Link>
      <ProjectForm
        action={updateProject.bind(null, project.id)}
        project={project}
        tags={tags}
        submitLabel="Save changes"
      />
    </div>
  );
}