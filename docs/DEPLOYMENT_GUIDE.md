# School Platform Deployment Guide 🚀

This guide will walk you through deploying the School Platform using our complete cloud-based infrastructure.

## 📋 Prerequisites

Before starting, ensure you have accounts and access to:
- [GitHub](https://github.com) (for code repository and CI/CD)
- [Vercel](https://vercel.com) (for frontend hosting)
- [Render](https://render.com) (for backend hosting)
- [Supabase](https://supabase.com) (for PostgreSQL database)
- [MongoDB Atlas](https://cloud.mongodb.com) (for MongoDB - optional)
- [Cloudinary](https://cloudinary.com) (for media storage)

## 🚀 Deployment Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/school-platform.git
   cd school-platform
   ```

2. **Set Up Environment Variables**
   - Create a `.env` file in the root of the project.
   - Add the following variables:
     ```
     DATABASE_URL=your_supabase_database_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     CLOUDINARY_URL=your_cloudinary_url
     MONGODB_URI=your_mongodb_uri (optional)
     ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run Migrations**
   ```bash
   npx supabase migration:run
   ```

5. **Seed the Database (Optional)**
   ```bash
   npx supabase db seed
   ```

6. **Start the Development Server**
   ```bash
   npm run dev
   ```
   - Open your browser and go to `http://localhost:3000`

7. **Build and Deploy to Vercel**
   - Push your code to GitHub.
   - Connect your GitHub repository to Vercel.
   - Set up the environment variables in Vercel's dashboard.
   - Deploy the application.

8. **Deploy the Backend to Render**
   - Create a new web service on Render.
   - Connect your GitHub repository.
   - Set the build and start commands.
   - Configure the environment variables.

9. **Set Up Supabase**
   - Create a new project on Supabase.
   - Configure the database and authentication settings.
   - Import the initial schema and data.

10. **Configure Cloudinary (Optional)**
    - Set up a Cloudinary account.
    - Configure the upload presets and security settings.

11. **Monitor and Maintain**
    - Set up monitoring for performance and errors.
    - Regularly back up your database and media files.

**🎉 Congratulations!** Your School Platform is now deployed and ready for use!
