# Discover-Bharat

A full-stack MERN application celebrating India's culture, heritage, and innovations through an interactive platform for states, products, and community content.

## 🚀 Features

- **Interactive India Map** - Explore states with detailed cultural information
- **Product Discovery** - Browse Swadeshi products by category and state
- **Community Innovations** - Share and vote on innovative ideas
- **Article Publishing** - Write and publish articles about Indian culture
- **User Authentication** - Register, login, and bookmark favorite states
- **Admin Dashboard** - Manage content with full CRUD operations
- **Responsive Design** - Mobile-friendly interface with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Axios
- React Toastify
- React Simple Maps

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Express Session
- bcrypt
- CORS

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or cloud instance like MongoDB Atlas)
- npm or yarn

### MongoDB Setup

#### Option 1: Local MongoDB
1. **Install MongoDB Community Server** from [mongodb.com](https://www.mongodb.com/try/download/community)
2. **Start MongoDB service:**
   ```bash
   # On Windows (run as Administrator)
   net start MongoDB

   # On macOS/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```
3. **Create database and collections:**
   ```bash
   # Connect to MongoDB shell
   mongosh

   # Create database
   use discover-bharat

   # The collections will be created automatically when you first run the application
   ```

#### Option 2: MongoDB Atlas (Cloud)
1. **Create account** at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create a cluster** and get your connection string
3. **Whitelist your IP** and create a database user
4. **Update `.env`** file with your Atlas connection string

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd discover-bharat
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd server
npm install
```

#### Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/discover-bharat
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

#### Start Development Server
```bash
npm run dev
```
Server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../client
npm install
```

#### Environment Variables
Create a `.env` file in the `client` directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

#### Start Development Server
```bash
npm start

Frontend will run on `http://localhost:3000`

## 🚀 Production Deployment

### Backend Deployment
1. Set environment variables in your hosting platform:
   ```
   PORT=5000
   MONGO_URI=your-production-mongodb-uri
   SESSION_SECRET=your-production-session-secret
   NODE_ENV=production
   ```

2. Build and deploy:
   ```bash
   cd server
   npm install --production
   npm start
   ```

### Frontend Deployment
1. Update the production API URL in `client/.env`:
   ```
   REACT_APP_API_URL=https://your-api-domain.com
   ```

2. Build the production bundle:
   ```bash
   cd client
   npm run build
   ```

3. Deploy the `build` folder to your static hosting service (Netlify, Vercel, etc.)

## 📁 Project Structure

```
discover-bharat/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── api/           # Axios configuration
│   │   └── data/          # Static data files
│   └── package.json
├── server/                 # Express backend
│   ├── config/            # Database configuration
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   └── package.json
└── README.md
```

## 🔐 Authentication

- **Session-based authentication** with express-session
- **Password hashing** using bcrypt
- **Role-based access control** (user/admin)
- **Protected routes** for admin operations

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `POST /api/auth/bookmark/:stateId` - Toggle state bookmark

### States
- `GET /api/states` - Get all states
- `GET /api/states/:id` - Get state by ID
- `POST /api/states` - Create state (admin)
- `PUT /api/states/:id` - Update state (admin)
- `DELETE /api/states/:id` - Delete state (admin)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Innovations
- `GET /api/innovations` - Get all innovations
- `GET /api/innovations/:id` - Get innovation by ID
- `POST /api/innovations` - Create innovation (authenticated users)
- `PUT /api/innovations/:id` - Update innovation (admin)
- `PUT /api/innovations/vote/:id` - Vote on innovation (authenticated users)
- `DELETE /api/innovations/:id` - Delete innovation (admin)

### Articles
- `GET /api/articles` - Get published articles
- `GET /api/articles?status=pending` - Get pending articles (admin)
- `GET /api/articles/:id` - Get article by ID
- `POST /api/articles` - Create article (authenticated users)
- `PUT /api/articles/:id` - Update article (admin)
- `PUT /api/articles/approve/:id` - Approve article (admin)
- `DELETE /api/articles/:id` - Delete article (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Celebrating India's rich cultural heritage and innovative spirit
- Built with modern web technologies for educational purposes

