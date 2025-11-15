import { parseProject } from "./parseProject";
import { projectRepository } from "./project.repository";

export const projectService = {
  parseAndSave: async (text: string) => {
    const parsed = await parseProject(text);
    return projectRepository.save(parsed);
  }
};
