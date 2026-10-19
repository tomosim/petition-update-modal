import { z } from "zod";

const UpdatePetitionSchema = z.object({
    title: z.string().nonempty("Title is required").max(100, "Title must be at most 100 characters"),
    newUpdate: z.string().nonempty("Please write a few words about your update.").max(10000, "Update must be at most 10,000 characters"),
    author: z.string().nonempty("Author is required"),
});

export type UpdatePetitionInput = z.infer<typeof UpdatePetitionSchema>;

export const validateForm = (formData: UpdatePetitionInput) => {
    const result = UpdatePetitionSchema.safeParse(formData);
    if (!result.success) {
        const treeifiedError = z.treeifyError(result.error);
        return {
            title: treeifiedError.properties?.title?.errors[0] || "",
            newUpdate: treeifiedError.properties?.newUpdate?.errors[0] || "",
            author: treeifiedError.properties?.author?.errors[0] || "",
        };
    }
    return { title: "", newUpdate: "", author: "" };
};
