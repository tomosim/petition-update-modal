import { describe, expect, it } from 'vitest';
import { validateForm, type UpdatePetitionInput } from './PetitionUpdateValidation';

const validForm: UpdatePetitionInput = {
    title: 'Petition update',
    newUpdate: 'We have reached our goal.',
    author: 'Petra Petitionstarterin',
};

describe('validateForm', () => {
    it('returns no errors for valid form data', () => {
        expect(validateForm(validForm)).toEqual({
            title: '',
            newUpdate: '',
            author: '',
        });
    });

    it('reports required-field errors for empty values', () => {
        expect(validateForm({ title: '', newUpdate: '', author: '' })).toEqual({
            title: 'Title is required',
            newUpdate: 'Please write a few words about your update.',
            author: 'Author is required',
        });
    });

    it('accepts values at the maximum allowed lengths', () => {
        expect(validateForm({
            title: 't'.repeat(100),
            newUpdate: 'u'.repeat(10000),
            author: 'a',
        })).toEqual({
            title: '',
            newUpdate: '',
            author: '',
        });
    });

    it('reports errors for values exceeding the maximum allowed lengths', () => {
        expect(validateForm({
            title: 't'.repeat(101),
            newUpdate: 'u'.repeat(10001),
            author: 'Petra Petitionstarterin',
        })).toEqual({
            title: 'Title must be at most 100 characters',
            newUpdate: 'Update must be at most 10,000 characters',
            author: '',
        });
    });
});
