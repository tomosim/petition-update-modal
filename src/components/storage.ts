import type { UpdatePetitionInput } from "./PetitionUpdateValidation";

const emptyForm: UpdatePetitionInput = {
    title: "",
    newUpdate: "",
    author: "Petra Petitionstarterin",
};

export function loadSavedForm(): UpdatePetitionInput {
    try {
        const raw = localStorage.getItem("formData");
        if (!raw) return emptyForm;

        const parsed: unknown = JSON.parse(raw);
        if (
            typeof parsed === "object" &&
            parsed !== null &&
            "title" in parsed &&
            typeof parsed.title === "string" &&
            "newUpdate" in parsed &&
            typeof parsed.newUpdate === "string" &&
            "author" in parsed &&
            typeof parsed.author === "string"
        ) {
            return {
                title: parsed.title,
                newUpdate: parsed.newUpdate,
                author: parsed.author,
            };
        }
    } catch {
        return emptyForm;
    }

    return emptyForm;
}
