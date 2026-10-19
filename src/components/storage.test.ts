import { describe, expect, it } from "vitest";
import { loadSavedForm } from "./storage";

describe("loadSavedForm", () => {
    it("returns the default form when no saved data exists", () => {
        expect(loadSavedForm()).toEqual({
            title: "",
            newUpdate: "",
            author: "Petra Petitionstarterin",
        });
    });

    it("loads saved form data with the expected shape", () => {
        const savedForm = {
            title: "Petition update",
            newUpdate: "We have reached our goal.",
            author: "Petra",
        };
        localStorage.setItem("formData", JSON.stringify(savedForm));

        expect(loadSavedForm()).toEqual(savedForm);
    });

    it("returns the default form when saved data is invalid JSON", () => {
        localStorage.setItem("formData", "{invalid");

        expect(loadSavedForm()).toEqual({
            title: "",
            newUpdate: "",
            author: "Petra Petitionstarterin",
        });
    });

    it("returns the default form when saved data has an invalid shape", () => {
        localStorage.setItem("formData", JSON.stringify({
            title: "Petition update",
            content: "Old field name",
            authorName: "Petra",
        }));

        expect(loadSavedForm()).toEqual({
            title: "",
            newUpdate: "",
            author: "Petra Petitionstarterin",
        });
    });
});
