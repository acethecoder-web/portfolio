import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getAdminProject, getAllTags } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { updateProject } from "../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const [project, tags] = await Promise.all([getAdminProject(id), getAllTags()]);
  if (!project) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit: {project.title}</h1>
      <ProjectForm
        action={updateProject.bind(null, project.id)}
        project={project}
        tags={tags}
        submitLabel="Save changes"
      />
    </div>
  );
}