import React, { useEffect, useState } from "react";
import { z } from "zod";
import { mockUpdatePetition } from "../api/mocks";
import Input from "./Input";

const UpdatePetitionSchema = z.object({
    title: z.string().nonempty("Title is required").max(100, "Title must be at most 100 characters"),
    newUpdate: z.string().nonempty("Please write a few words about your update.").max(10000, "Update must be at most 10,000 characters"),
    author: z.string().nonempty("Author is required")
})
export type UpdatePetitionInput = z.infer<typeof UpdatePetitionSchema>;

export default function PetitionUpdateForm({ onClose, title }: { onClose: () => void; title: string }) {
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
            <div style={{ padding: 16 }} role="status">
                <h2>Update Published!</h2>
                <p>Your petition update has been successfully published.</p>
                <button onClick={onClose}>Close</button>
            </div>
        ) : (
            <>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
                    <h2 id="update-petition-title">{title}</h2>
                    <button onClick={onClose} aria-label="Close modal" style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>
                        &times;
                    </button>
                </header>
                <form noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }} onSubmit={handleSubmit}>

                    <Input
                        id="title"
                        name="title"
                        label="Titel"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        error={errors.title}
                        charCount={formData.title.length}
                        charLimit={100}
                    />

                    <Input
                        as="textarea"
                        id="newUpdate"
                        name="newUpdate"
                        label="Deine Neuigkeiten"
                        placeholder="Bitte schreibe ein paar Worte zu deinem Update."
                        value={formData.newUpdate}
                        onChange={handleInputChange}
                        required
                        error={errors.newUpdate}
                        charCount={formData.newUpdate.length}
                        charLimit={10000}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 8 }}>
                        <h3>Absender</h3>
                        <span style={{ justifySelf: 'end' }}>
                            <input
                                type="checkbox"
                                id="author-edit"
                                checked={isAuthorEditable}
                                onChange={(e) => setIsAuthorEditable(e.target.checked)}
                            />
                            <label htmlFor="author-edit">Edit author</label>
                        </span>
                        <Input
                            id="author"
                            name="author"
                            label="Absender"
                            value={formData.author}
                            onChange={handleInputChange}
                            readOnly={!isAuthorEditable}
                            required
                            error={errors.author}
                        />
                    </div>

                    <span style={{ display: 'flex', justifyContent: 'space-around', gap: 8 }}>

                        <button type="button" onClick={onClose} style={{ backgroundColor: 'transparent', border: '1px solid #C9B2F9', borderRadius: 24, height: 48, fontSize: 18, padding: '0 16px', cursor: 'pointer' }}>
                            Abbrechnung
                        </button>
                        <button type="button" onClick={handleSaveData} style={{ backgroundColor: '#C9B2F9', border: '1px solid black', borderRadius: 24, height: 48, fontSize: 18, padding: '0 16px', cursor: 'pointer' }}>
                            Save Data
                        </button>
                        <button type="submit" disabled={isLoading} style={{ backgroundColor: '#F87535', border: '1px solid black', borderRadius: 24, height: 48, fontSize: 18, padding: '0 16px', cursor: isLoading ? 'not-allowed' : 'pointer', color: 'white' }}>
                            {isLoading ? "Publishing..." : "Publish Update"}
                        </button>
                    </span>
                    {isError && <p style={{ color: 'red' }}>An error occurred while publishing the update. Please try again.</p>}
                </form >
            </>
        )
    );
}
