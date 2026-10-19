import React, { useEffect, useState } from "react";
import { z } from "zod";
import { mockUpdatePetition } from "../api/mocks";

const UpdatePetitionSchema = z.object({
    title: z.string().nonempty("Title is required").max(100, "Title must be at most 100 characters"),
    newUpdate: z.string().nonempty("Please write a few words about your update.").max(10000, "Update must be at most 10,000 characters"),
    author: z.string().nonempty("Author is required")
})
export type UpdatePetitionInput = z.infer<typeof UpdatePetitionSchema>;

export default function PetitionUpdateForm({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = useState<UpdatePetitionInput>({
        title: '',
        newUpdate: '',
        author: 'Petra Petitionstarterin',
    });
    const [isAuthorEditable, setIsAuthorEditable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState<{ [key in "title" | "newUpdate" | "author"]: string }>({ title: "", newUpdate: "", author: "" });

    useEffect(() => {
        const firstInvalidField = (['title', 'newUpdate', 'author'] as const).find((field) => errors[field]);
        if (firstInvalidField) {
            document.getElementById(firstInvalidField)?.focus();
        }
    }, [errors]);

    useEffect(() => {
        const savedData = localStorage.getItem("formData");
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }

    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsError(false); // Reset error state on input change
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = UpdatePetitionSchema.safeParse(formData);
        if (!result.success) {
            const treeifiedError = z.treeifyError(result.error);
            setErrors({
                title: treeifiedError.properties?.title?.errors[0] || "",
                newUpdate: treeifiedError.properties?.newUpdate?.errors[0] || "",
                author: treeifiedError.properties?.author?.errors[0] || "",
            });
            return;
        }
        try {
            setIsLoading(true);
            await mockUpdatePetition(formData);
            setIsSuccess(true);
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveData = () => {
        localStorage.setItem("formData", JSON.stringify(formData));
    }

    return (
        isSuccess ? (
            <div style={{ padding: 16 }}>
                <h2>Update Published!</h2>
                <p>Your petition update has been successfully published.</p>
                <button onClick={onClose}>Close</button>
            </div>
        ) : (
            <form style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }} onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} />
                {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>}

                <label htmlFor="newUpdate">New update</label>
                <textarea id="newUpdate" name="newUpdate" value={formData.newUpdate} onChange={handleInputChange} />
                {errors.newUpdate && <p style={{ color: 'red' }}>{errors.newUpdate}</p>}

                <label htmlFor="author-edit">Edit author</label>
                <input
                    type="checkbox"
                    id="author-edit"
                    checked={isAuthorEditable}
                    onChange={(e) => setIsAuthorEditable(e.target.checked)}
                />

                <label htmlFor="author">Author</label>
                <input id="author" name="author" type="text" value={formData.author} onChange={handleInputChange} readOnly={!isAuthorEditable} />
                {errors.author && <p style={{ color: 'red' }}>{errors.author}</p>}

                <button onClick={onClose}>Cancel</button>
                <button type="button" onClick={handleSaveData}>Save Data</button>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Publishing..." : "Publish Update"}
                </button>
                {isError && <p style={{ color: 'red' }}>An error occurred while publishing the update. Please try again.</p>}
            </form>
        )
    );
}
