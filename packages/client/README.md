# Client

React frontend for the TaskFlow TODO application, built with Vite.

## Prerequisites

- **Node.js** `^20.19.0` or `>= 22.12.0` (required by Vite 8)
- **npm** >= 7 (for workspaces support)
- The [backend](../server/README.md) running on `http://localhost:5000` — the client has no mock data and needs the API to show anything

## Setup

Dependencies are installed from the monorepo root via npm workspaces:

```bash
# From the root of the monorepo
npm install
```

### Environment variables (optional)

Defaults are committed in `packages/client/.env`. To override one, put it in `packages/client/.env.local` (git-ignored), which takes precedence.

| Variable         | Default               | Description                                 |
|------------------|-----------------------|---------------------------------------------|
| `VITE_APP_TITLE` | `TaskFlow - Todo App` | Browser tab title (the `<title>` in `index.html`) |

The title is injected into `index.html` at dev-server start and build time by a small plugin in [vite.config.js](vite.config.js), so restart `npm run dev` after changing it. You can also set it inline: `VITE_APP_TITLE="My Tasks" npm run build`.

## Running

```bash
# From the root of the monorepo

npm run dev           # Frontend + backend together
npm run dev:client    # Frontend only (start the backend separately)
```

The dev server runs on http://localhost:3000. Requests to `/api/*` are proxied to the backend at `http://localhost:5000` (see [vite.config.js](vite.config.js)).

### Other scripts

Run from `packages/client`, or from the root with `-w packages/client`:

| Command           | Description                                                        |
|-------------------|--------------------------------------------------------------------|
| `npm run build`   | Production build into `dist/` (also available as `npm run build` at the root) |
| `npm run preview` | Serve the production build locally on http://localhost:4173 (uses the same `/api` proxy) |
| `npm run lint`    | Lint with oxlint                                                   |

## Structure

```
src/
├── components/
│   ├── TodoForm.jsx    # Form for creating new TODOs
│   ├── TodoItem.jsx    # Individual TODO item with edit/delete/toggle
│   └── TodoList.jsx    # List container with loading/error/empty states
├── hooks/
│   └── useTodos.js     # Custom hook for TODO state management
├── i18n/
│   ├── index.js        # i18next setup (languages, fallback)
│   └── locales/
│       └── en/translation.json  # English strings
├── services/
│   └── api.js          # Axios API client
├── App.jsx             # Root component
├── App.css             # Application styles
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Features

- **Optimistic UI Updates**: Instant feedback on edit/toggle/delete with rollback on error
- **Form Validation**: Client-side validation with user-friendly error messages
- **Toast Notifications**: Success and error feedback via react-hot-toast
- **Keyboard Shortcuts**: Enter to save, Escape to cancel when editing
- **Responsive Design**: Works on mobile and desktop
- **Smooth Animations**: Subtle transitions for a polished experience

## Internationalization (i18n)

All UI text is translated with [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/). Only **English** (`en`) is available for now.

Use the `useTranslation` hook in components instead of hardcoding text:

```jsx
const { t } = useTranslation();
<h2>{t('form.heading')}</h2>
<span>{t('validation.titleMax', { max: 200 })}</span>
```

To add a language (e.g. French):

1. Copy `src/i18n/locales/en/translation.json` to `src/i18n/locales/fr/translation.json` and translate the values (keep the keys).
2. In [src/i18n/index.js](src/i18n/index.js), import it, add `fr: { translation: fr }` to `resources` and `'fr'` to `SUPPORTED_LANGUAGES`.
3. Translate the `serverErrors` section too — it holds messages for the API's error codes.
4. Switch at runtime with `i18n.changeLanguage('fr')`; `<html lang>` and date formatting follow automatically.

### Server errors

The API returns an error `code` (see the [server README](../server/README.md#error-codes)) instead of text to display. [src/i18n/serverError.js](src/i18n/serverError.js) turns it into a message using the `serverErrors.<CODE>` keys, preferring the first field-level error. Unknown codes and network failures fall back to a generic `errors.*` message.

## Assumptions

- The backend is served on the same origin under `/api`. In development this is handled by the Vite proxy; the API base URL is hardcoded to `/api` in [src/services/api.js](src/services/api.js).
- The backend runs on port `5000`. If you change the server `PORT`, update the proxy `target` in [vite.config.js](vite.config.js) too.
- Client-side validation mirrors the server limits (title required, max 200 chars; description max 1000 chars). The server remains the source of truth.

## Limitations

- **No production API configuration**: there is no `VITE_API_URL`-style variable. To deploy the built `dist/` folder, serve it behind a reverse proxy (e.g. Nginx) that forwards `/api` to the backend, or change `baseURL` in `api.js`.
- **Single user, no authentication**: everyone using the same backend sees and edits the same list.
- **No pagination, search, filtering or sorting controls**: all TODOs are loaded at once, newest first.
- **Create is not optimistic**: new TODOs appear only after the server responds.
- **No offline support**: changes made while the backend is unreachable are rolled back, not queued.
- **English only**: there is no language switcher or browser-language detection yet. The page `<title>` in `index.html` is not translated.
- **No automated tests** for the client.
