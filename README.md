# CheckInn - Hotel Booking App

CheckInn is a full-stack hotel booking application built with **Next.js**, **Mongoose**, and **Zustand** for state management. It provides a seamless experience for users to book hotels, manage their profiles, and make secure payments via **Stripe**.

## Features

✅ User authentication (JWT-based login & signup)  
✅ Hotel listing & search functionality  
✅ Secure payment integration with Stripe  
✅ Profile management  
✅ Review and rating system (Backend completed)  
✅ Image upload via backend API  
✅ Forgot password feature  
✅ Global state management with Zustand  

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js, Mongoose (MongoDB)
- **Authentication**: JWT
- **State Management**: Zustand
- **Payments**: Stripe
- **Database**: MongoDB
- **Deployment**: Vercel (Frontend), Render/Fly.io (Backend)

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- Node.js (>=16)
- MongoDB
- pnpm (Package Manager)

### Steps to Run Locally

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/checkinn.git
   cd checkinn
   ```

2. **Install dependencies**
   ```sh
   pnpm install
   ```

3. **Set up environment variables** (Create a `.env.local` file and add the required variables)
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start the development server**
   ```sh
   pnpm dev
   ```
   The app will be available at `http://localhost:3000`.

## API Routes

| Method | Endpoint          | Description |
|--------|------------------|-------------|
| POST   | `/api/auth/signup` | Register a new user |
| POST   | `/api/auth/login`  | Authenticate user |
| GET    | `/api/hotels`     | Fetch all hotels |
| GET    | `/api/hotels/:id` | Fetch hotel details |
| POST   | `/api/bookings`   | Book a hotel |
| POST   | `/api/reviews`    | Submit a review |

## Future Enhancements

- [ ] Implement frontend for the review & rating system
- [ ] Add an admin panel for hotel management
- [ ] Enable social login (Google, Facebook)
- [ ] Improve UI/UX for better user experience

## Contributions
Contributions are welcome! Feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

