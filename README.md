# update petition form

## Overview

This is a small React project created with Vite and typescript that contains a Modal Form component for updating a petition on a platform similar to innn.it. It was build with a focus on a11y and good UI/UX. Enjoy!

## Installation

To run, please clone the repo, navigate into the directory, install using `npm`, and then run!

```
git clone https://github.com/tomosim/petition-update-modal.git
cd petition-update-modal
npm install
npm run dev
```

to run the tests, simply run the command

```
npm run test
```
## Notes

 - I chose Vite here over Next.js as this project didn't need routing or server side rendering. 
 - Vite also allows for tests to be setup simply with Vitest and React Testing Library.
 - For styling I chose CSS modules for the zero setup and better dev experience in smaller projects. Another option could have been a CSS in JS solution like Emotion, as it is in your tech stack, but it felt over kill for a small feature. 
 - There is no localisation on innn.it as far as I am aware, so in the interest of time I somply hardcoded strings for now, but in the future it would be possible to use a lib like `react-i18next` to handle tranlations. It's definitely a nice TODO for this project.
 - If I had had time I would have liked to have created a storybook story for the flexible Input component.
 - I added unit tests for some pure functions, but I would have liked to have setup cypress to run some integration tests, especially to cover errors and loading states.

