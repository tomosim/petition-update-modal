import React, { useEffect, useState } from "react";
import { mockUpdatePetition } from "../api/mocks";
import Input from "./Input";
import styles from "./PetitionUpdateForm.module.css";
import { validateForm, type UpdatePetitionInput } from "./PetitionUpdateValidation";
import { loadSavedForm } from "./storage";

export type { UpdatePetitionInput } from "./PetitionUpdateValidation";

export default function PetitionUpdateForm({ onClose, title }: { onClose: () => void; title: string }) {
    const [formData, setFormData] = useState<UpdatePetitionInput>(loadSavedForm);
    const [isAuthorEditable, setIsAuthorEditable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState("");
    const [errors, setErrors] = useState<{ [key in "title" | "newUpdate" | "author"]: string }>({ title: "", newUpdate: "", author: "" });

    useEffect(() => {
        const firstInvalidField = (['title', 'newUpdate', 'author'] as const).find((field) => errors[field]);
        if (firstInvalidField) {
            document.getElementById(firstInvalidField)?.focus();
        }
    }, [errors]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setServerError(""); // Reset error state on input change
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formErrors = validateForm(formData);
        if (Object.values(formErrors).some((error) => error)) {
            setErrors(formErrors);
            return;
        }


        try {
            setIsLoading(true);
            await mockUpdatePetition(formData);
            setIsSuccess(true);
        } catch (error) {
            if (error instanceof Response) {
                setServerError(`Server error: ${error.status} ${error.statusText}`);
            }
            else {
                setServerError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveData = () => {
        const formErrors = validateForm(formData);
        if (Object.values(formErrors).some((error) => error)) {
            setErrors(formErrors);
            return;
        }
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
                    {serverError && <p className={styles.errorMessage}>An error occurred while publishing the update. Please try again.</p>}
                </form >
            </>
        )
    );
}
