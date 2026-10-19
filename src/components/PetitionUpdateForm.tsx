import React, { useEffect, useState } from "react";
import { z } from "zod";
import { mockUpdatePetition } from "../api/mocks";
import Input from "./Input";
import styles from "./PetitionUpdateForm.module.css";

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
            <div className={styles.success} role="status">
                <h2>Update Published!</h2>
                <p>Your petition update has been successfully published.</p>
                <button onClick={onClose}>Close</button>
            </div>
        ) : (
            <>
                <header className={styles.header}>
                    <h2 id="update-petition-title">{title}</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                        &times;
                    </button>
                </header>
                <form noValidate className={styles.form} onSubmit={handleSubmit}>

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

                    <div className={styles.authorSection}>
                        <h3>Absender</h3>
                        <span className={styles.authorEdit}>
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

                    <span className={styles.actionButtons}>

                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            Abbrechnung
                        </button>
                        <button type="button" className={styles.saveButton} onClick={handleSaveData}>
                            Save Data
                        </button>
                        <button type="submit" className={styles.publishButton} disabled={isLoading}>
                            {isLoading ? "Publishing..." : "Publish Update"}
                        </button>
                    </span>
                    {isError && <p className={styles.errorMessage}>An error occurred while publishing the update. Please try again.</p>}
                </form >
            </>
        )
    );
}
