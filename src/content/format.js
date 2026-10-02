// Replaces {years} and {projects} inside any text with the numbers from "General".
export function fmt(text, general) {
  return String(text ?? "")
    .replaceAll("{years}", general.yearsExperience)
    .replaceAll("{projects}", general.projectsCompleted);
}

export const telLink = (phone) => `tel:${String(phone).replace(/[^\d+]/g, "")}`;
