export const parseProject = async (text: string) => {
  return {
    projectName: "Dummy Project",
    description: text,
    skills: ["javascript", "express"]
  };
};
