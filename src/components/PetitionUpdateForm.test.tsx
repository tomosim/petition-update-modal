import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PetitionUpdateForm from "./PetitionUpdateForm";
import { mockUpdatePetition } from "../api/mocks";

vi.mock("../api/mocks", () => ({
    mockUpdatePetition: vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    cleanup();
    localStorage.clear();
});

describe("invalid submit", () => {
    it("shows errors, focuses the first invalid field, and does not call the API", async () => {
        const user = userEvent.setup();
        render(<PetitionUpdateForm onClose={() => { }} title="Test Petition" />);

        await user.click(screen.getByRole("button", { name: /Publish Update/i }));

        expect(await screen.findByText("Title is required")).toBeInTheDocument();
        expect(screen.getByLabelText("Titel")).toHaveAttribute("aria-invalid", "true");
        expect(screen.getByLabelText("Titel")).toHaveFocus();
        expect(mockUpdatePetition).not.toHaveBeenCalled();
    });
});

describe("valid submit", () => {
    it("calls the API and shows success message", async () => {
        const user = userEvent.setup();
        render(<PetitionUpdateForm onClose={() => { }} title="Test Petition" />);

        await user.type(screen.getByLabelText("Titel"), "My Update Title");
        await user.type(screen.getByLabelText("Deine Neuigkeiten"), "This is the content of the update.");
        await user.click(screen.getByRole("button", { name: /Publish Update/i }));

        expect(mockUpdatePetition).toHaveBeenCalledWith({
            title: "My Update Title",
            newUpdate: "This is the content of the update.",
            author: "Petra Petitionstarterin",
        });
    });
});

describe("invalid save", () => {
    it("shows errors, focuses the first invalid field, and does not save to localStorage", async () => {
        const user = userEvent.setup();
        render(<PetitionUpdateForm onClose={() => { }} title="Test Petition" />);

        await user.click(screen.getByRole("button", { name: /Save Data/i }));

        expect(await screen.findByText("Title is required")).toBeInTheDocument();
        expect(screen.getByLabelText("Titel")).toHaveAttribute("aria-invalid", "true");
        expect(screen.getByLabelText("Titel")).toHaveFocus();
        expect(localStorage.getItem("formData")).toBeNull();
    });
});

describe("valid save", () => {
    it("saves to localStorage", async () => {
        const user = userEvent.setup();
        render(<PetitionUpdateForm onClose={() => { }} title="Test Petition" />);

        await user.type(screen.getByLabelText("Titel"), "My Update Title");
        await user.type(screen.getByLabelText("Deine Neuigkeiten"), "This is the content of the update.");
        await user.click(screen.getByRole("button", { name: /Save Data/i }));

        const savedData = JSON.parse(localStorage.getItem("formData") || "{}");
        expect(savedData).toEqual({
            title: "My Update Title",
            newUpdate: "This is the content of the update.",
            author: "Petra Petitionstarterin",
        });
    });
});
