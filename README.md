# Bouldering-1.0

Fullstack-app för att logga och utforska boulders.

Projektet består av:

- Frontend: React + TypeScript + Vite + MUI
- Backend: Express + TypeScript + MongoDB + Cloudinary

## Funktionalitet i korthet

- Registrering och inloggning med JWT.
- Skapa, visa och hantera boulders.
- Ladda upp bilder för boulders via Cloudinary.
- Historikvy för tidigare loggade klättringar.
- Mobilanpassad navigering med bottom navigation.

## Projektstruktur

```text
Bouldering-1.0/
	Backend/
	Frontend/
```

## Förkrav

- Node.js 20+
- npm
- MongoDB (lokalt eller via molntjänst)
- Cloudinary-konto (för bilduppladdning)

## 1. Installera beroenden

Kör i projektroten:

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

## 2. Miljövariabler

### Backend

Skapa filen `Backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=din_hemliga_nyckel

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend

Skapa filen `Frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 3. Starta projektet (utvecklingsläge)

Öppna två terminaler.

Terminal 1 (backend):

```bash
cd Backend
npm run dev
```

Terminal 2 (frontend):

```bash
cd Frontend
npm run dev
```

Appen kör normalt på:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

Hälsokontroll backend:

- GET http://localhost:5000/health

## Tester

Backend:

```bash
cd Backend
npm test
```

Frontend:

```bash
cd Frontend
npm test
```

## Hur appen fungerar

1. Frontend skickar API-anrop till backend via `VITE_API_BASE_URL`.
2. Vid inloggning returnerar backend en JWT-token.
3. Token sparas i klienten och skickas med i `Authorization` header vid skyddade anrop.
4. Backend validerar token och hanterar routes för auth, user, boulders och history.
5. Bilder laddas upp till Cloudinary via backend och URL sparas tillsammans med boulderdata i MongoDB.

## Vanliga scripts

Frontend:

- `npm run dev` startar utvecklingsserver
- `npm run dev:mobile` startar dev-server tillgänglig i lokalt nätverk
- `npm run build` bygger frontend
- `npm run test` kör tester med coverage

Backend:

- `npm run dev` startar API med nodemon + ts-node
- `npm run test` kör tester med coverage

## Deployment (kort)

- Frontend kan hostas statiskt (exempelvis S3/CloudFront).
- Backend behöver hostas som separat Node-tjänst.
- Sätt `VITE_API_BASE_URL` i frontend till backendens publika URL.
