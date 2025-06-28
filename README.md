
# Contentographer AI

Contentographer AI is a specialized AI assistant designed to help photographers and videographers overcome creative blocks and streamline their social media workflow. It generates tailored content ideas, from detailed Instagram posts to engaging TikTok video scripts, in just a few clicks.

## Target Audience

This tool is perfect for:
- Wedding Photographers
- Lifestyle & Portrait Photographers
- Food Photographers
- Fashion Photographers
- Product Photographers
- Travel Videographers
- Any creative professional looking to enhance their social media presence.

## Features

- **AI Content Generation:** Generate Instagram post ideas (image concepts, captions, hashtags) and full TikTok video scripts tailored to your niche.
- **User Authentication:** Secure registration and login system with mandatory email verification.
- **Personal Dashboard:** A dedicated space for users to view, manage, and access all their previously generated content, sorted by date.
- **Flexible Subscription Plans:** A three-tiered pricing model (Free, Pro, Ultimate) with features like a visual content calendar for premium users.
- **Monthly Subscription Cycle:** Paid plans are valid for 30 days and automatically revert to the Free plan upon expiration, ensuring users are never charged unexpectedly.
- **Informative Landing Page:** A comprehensive homepage featuring pricing details, an FAQ section, and a contact form.

## How to Set Up and Run

Follow these steps to get the project running on your local machine.

### 1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Firebase
- Create a new project in the [Firebase Console](https://console.firebase.google.com/).
- Go to **Project Settings** and add a new **Web App**.
- Copy the `firebaseConfig` object.
- In the Firebase Console, go to **Authentication** > **Sign-in method** and enable **Email/Password**.
- Go to **Firestore Database** and create a database. Start in test mode for easy setup.

### 4. Configure Environment Variables
- Create a `.env.local` file in the root of the project by copying the `.env` file.
- Add your Firebase and Google AI configuration keys to this file.

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"

# Google AI (Genkit)
# Get your key from Google AI Studio: https://aistudio.google.com/app/apikey
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
```

### 5. Run the Development Servers
The application uses Genkit for AI features, which runs as a separate process.

- **In one terminal**, start the Genkit development server:
  ```bash
  npm run genkit:watch
  ```
- **In another terminal**, start the Next.js development server:
  ```bash
  npm run dev
  ```

### 6. Open the Application
Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## Tech Stack Included

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **AI:** [Google AI (via Genkit)](https://ai.google.dev/genkit)
- **Database & Auth:** [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **UI:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Contact
For any questions, feedback, or support, please feel free to reach out via email at `aru.aram99@gmail.com`.
