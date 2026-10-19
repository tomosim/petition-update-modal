import React, { useEffect } from "react";
import { z } from "zod";

export default function PetitionUpdateForm() {
    const UpdatePetitionSchema = z.object({
        title: z.string().nonempty("Title is required").max(100, "Title must be at most 100 characters"),
        newUpdate: z.string().nonempty("Please write a few words about your update.").max(10000, "Update must be at most 10,000 characters"),
        author: z.string().nonempty("Author is required")
    })
    type UpdatePetitionInput = z.infer<typeof UpdatePetitionSchema>;

    const [formData, setFormData] = React.useState<UpdatePetitionInput>({
        title: '',
        newUpdate: '',
        author: 'Petra Petitionstarterin',
    });
    const [isAuthorEditable, setIsAuthorEditable] = React.useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem("formData");
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }

    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = UpdatePetitionSchema.safeParse(formData);
        if (!result.success) {
            console.error(result.error.format());
            return;
        }
        console.log("Form submitted successfully:", result.data);
    };

    const handleSaveData = () => {
        localStorage.setItem("formData", JSON.stringify(formData));
    }

    return (
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }} onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} />

            <label htmlFor="new-update">New update</label>
            <textarea id="new-update" name="newUpdate" value={formData.newUpdate} onChange={handleInputChange} />

            <label htmlFor="author-edit">Edit author</label>
            <input
                type="checkbox"
                id="author-edit"
                checked={isAuthorEditable}
                onChange={(e) => setIsAuthorEditable(e.target.checked)}
            />

            <label htmlFor="author">Author</label>
            <input id="author" name="author" type="text" value={formData.author} onChange={handleInputChange} readOnly={!isAuthorEditable} />

            <button type="button" onClick={handleSaveData}>Save Data</button>
            <button type="submit" >Submit</button>

        </form>
    );
}
