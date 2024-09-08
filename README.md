# Giftme

**Giftme** is a profile-sharing and gift-receiving platform designed for creators. Built using modern web technologies like **Next.js**, **Tailwind CSS**, and **MongoDB**, it enables creators to showcase their profiles and receive gifts from their audience.

## Features

- **Profile Sharing**: Easily signup and share profiles.
- **Gift Receiving**: Allows creators to receive gifts and monetary support from their audience.
- **Wallet Dashboard**: Users can track wallet balance, recent gifts, and total gifts received.
- **Responsive Design**: Built with Tailwind CSS, the platform offers a seamless experience across all devices.
- **Authentication**: Login and authentication for creators secured using jwt.
  
## Tech Stack

- **Next.js**: A React framework for server-side rendering and static site generation.
- **Tailwind CSS**: A utility-first CSS framework for fast UI development.
- **MongoDB**: NoSQL database used to store user profiles and gifts.
- **Axios**: For handling API requests.

## Installation

1. Clone the repository:

 ```bash
   git clone https://github.com/tilakjain619/Giftme.git
 ```
 
2. Navigate to the project directory:

```bash
cd giftme
```
3. Install the dependencies:

```bash
npm install
```
4. Create a .env file and add the following environment variables:

```bash
MONGODB_URI = mongo_db_uri
JWT_SECRET = example@123
PUBLIC_API_URL = http://localhost:3000/api
STRIPE_SECRET_KEY = your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = your_publishable_key
```

5. Run the development server:

```bash
npm run dev
```
6. Open http://localhost:3000 in your browser to see the application.

## Usage
- Creators can sign up and create a profile.
- Audience can visit creator profiles, send gifts, and view past gifts received by the creator.
- Creator can track their wallet, recent gifts, and total gifts received via the dashboard.

### Folder Structure
```bash
.
├── public        # Static assets
├── src
│   ├── components    # Reusable UI components
│   ├── app           # Next.js routes
│   ├── styles        # Global and component-specific styles
│   ├── utils         # Utility functions 
│   ├── lib           # Predefined config functions
│   ├── context       # Context API setup for global state
│   ├── models        # Defined schemas for db collections
└── .env              # Environment variables
```
## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any features, bug fixes, or improvements.