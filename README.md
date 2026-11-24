# SIGNAL — Developer Opportunity Workspace

SIGNAL is a developer workspace for discovering opportunities, tracking progress, and building a portable record of your work.

## Features

- Discover and save hackathons, internships, and other opportunities; track them in My Missions.
- Connect Gmail with read-only access to review likely opportunity emails.
- Manage developer profile details, projects with GitHub/live links and tech stacks, education, certifications, and attended events.
- Build editable, dated learning plans from built-in starter roadmaps.
- Preview and print a resume from your saved profile, experience, and portfolio records.
- Keep workspace data in browser storage and export a JSON backup.

## Run locally

```sh
npm install
npm run dev
```

For production output, run `npm run build`. The app stores profile and workspace data in the browser. Gmail sync requires a Google OAuth Client ID configured in the Email sync page; it uses read-only scope and works while the app is open.

## Deployment

Pushing to `main` builds and deploys SIGNAL to GitHub Pages through the workflow in `.github/workflows/deploy.yml`.