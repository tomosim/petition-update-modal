import type { UpdatePetitionInput } from "../components/PetitionUpdateForm";

export async function mockUpdatePetition(input: UpdatePetitionInput): Promise<Response> {
    console.log("Mock API called with input:", input);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (input.author === "fail") {
        console.error("Mock API error: Simulated failure for author 'fail'");
        throw new Response(null, { status: 500, statusText: "Internal Server Error" });
    }

    return new Response(null, { status: 200 });
}
