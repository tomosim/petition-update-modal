import React from "react";

export default function PetitionUpdateForm() {
    const [formData, setFormData] = React.useState({
        title: '',
        newUpdate: '',
        author: 'Petra Petitionstarterin',
    });
    const [isAuthorEditable, setIsAuthorEditable] = React.useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
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

            <button type="submit">Submit</button>
        </form>
    );
}
