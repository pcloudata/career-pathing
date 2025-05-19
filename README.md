# Career Pathing Platform

A platform for skill assessment and career pathing.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account (free tier available)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/career-pathing.git
cd career-pathing
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase

   a. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   b. Copy your Firebase configuration from the Firebase Console
   c. Create a `.env` file in the root directory (copy from `.env.example`)
   d. Fill in your Firebase configuration values in the `.env` file

4. Seed initial data
```bash
npm run seed
```

5. Test API functionality
```bash
npm run test:api
```

6. Start the development server
```bash
npm start
```

### Environment Variables

Create a `.env` file in the root directory and add your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

NEXT_PUBLIC_API_URL=https://api.careerpathing.com
```

### Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Copy your Firebase configuration from the Firebase Console
4. Create a `.env` file in the root directory (copy from `.env.example`)
5. Fill in your Firebase configuration values in the `.env` file
6. Deploy the security rules:
```bash
firebase deploy --only firestore:rules
```
7. Deploy the indexes:
```bash
firebase deploy --only firestore:indexes
```

Note: Never commit your `.env` file to version control. Use `.env.example` as a template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
