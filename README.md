**Notes Manager App** 
A simple MERN stack application for managing personal notes with secure JWT authentication.
**How to Run the Project**
1. Clone the Repository
``` bash
git clone <repo-url>
cd notes-manager
```
 **Backend Setup**
1. Go to backend folder
``` bash
cd backend
```
2. Install libraries
``` bash
npm install express mongoose dotenv cors  jsonwebtoken
```
3. Create .env file in backend folder:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
4.Run backend
``` bash
node server.js
```
**Frontend Setup**
1.Go to client folder
``` bash
cd client
```
2.Install libraries
``` bash
npm install react-icons react-toastify
```
3. Run frontend
``` bash
npm run dev
```


   
   
