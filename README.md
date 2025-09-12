# bloolabb - AI Learning Platform

A Duolingo-style learning platform for kids aged 6-18 to learn AI and entrepreneurship through gamified experiences.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd bloolabb
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file with your Supabase credentials:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

4. **Run database migrations**
   Execute the SQL scripts in the `scripts/` folder in order:
   \`\`\`bash
   # Run these in your Supabase SQL editor
   scripts/001_create_database_schema.sql
   scripts/002_create_profile_trigger.sql
   scripts/003_seed_learning_content.sql
   scripts/004_seed_exercises.sql
   scripts/005_seed_badges.sql
   scripts/007_create_admin_system.sql
   scripts/008_security_improvements.sql
   scripts/009_create_admin_user.sql
   \`\`\`

5. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Row Level Security
- **Deployment**: Vercel

### Project Structure
\`\`\`
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   ├── learn/             # Learning content
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── dashboard/         # Dashboard-specific components
│   ├── exercises/         # Exercise components
│   ├── learn/             # Learning components
│   └── ui/                # Base UI components
├── lib/                   # Utility libraries
│   ├── supabase/          # Supabase client configuration
│   └── utils.ts           # Helper functions
└── scripts/               # Database migration scripts
\`\`\`

## 🎮 Features

### For Students
- **Gamified Learning**: XP points, streaks, badges, leaderboards
- **Interactive Exercises**: Multiple choice, fill-in-blank, case studies
- **Progress Tracking**: Visual progress bars and completion tracking
- **Multi-language Support**: English, Arabic, French
- **Responsive Design**: Works on desktop, tablet, and mobile

### For Administrators
- **Content Management**: Edit lessons, exercises, and learning tracks
- **User Management**: View and manage student accounts
- **Analytics Dashboard**: Track platform usage and student progress
- **Admin Authentication**: Secure role-based access control

## 🔧 Development Guide

### Adding New Learning Content

1. **Create a new lesson**:
   \`\`\`sql
   INSERT INTO lessons (module_id, title, content, xp_reward, order_index)
   VALUES ('module-id', 'Lesson Title', 'Lesson content...', 50, 1);
   \`\`\`

2. **Add exercises to the lesson**:
   \`\`\`sql
   INSERT INTO exercises (lesson_id, type, question, options, correct_answer, explanation)
   VALUES ('lesson-id', 'multiple_choice', 'Question?', 
           ARRAY['Option 1', 'Option 2', 'Option 3', 'Option 4'],
           'Option 1', 'Explanation...');
   \`\`\`

### Customizing the UI

1. **Colors**: Edit `app/globals.css` to modify the color scheme
2. **Components**: Modify components in `components/ui/` for base styling
3. **Layout**: Update `components/dashboard/` for dashboard-specific layouts

### Adding New Exercise Types

1. **Database**: Add new exercise type to the `exercise_type` enum
2. **Component**: Create new exercise component in `components/exercises/`
3. **Engine**: Update `components/exercises/exercise-engine.tsx` to handle the new type

### Admin Access

**Default Admin Credentials**:
- Email: `zvmmed@gmail.com`
- Password: `zvmmed@gmail.com`

Access the admin dashboard at `/admin/login`

### API Endpoints

- `GET /api/tracks` - Get all learning tracks
- `GET /api/user/profile` - Get user profile
- `POST /api/exercises/submit` - Submit exercise answers
- `GET /api/user/progress` - Get user progress
- `POST /api/badges/check` - Check for new badges

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**:
   \`\`\`bash
   vercel --prod
   \`\`\`

2. **Set environment variables** in Vercel dashboard

3. **Configure Supabase** redirect URLs for production

### Database Setup

1. **Create Supabase project**
2. **Run migration scripts** in order
3. **Enable Row Level Security** on all tables
4. **Configure authentication** settings

## 🔒 Security

- **Row Level Security (RLS)**: All database tables protected
- **Admin Role Verification**: Middleware checks admin permissions
- **Input Validation**: All user inputs validated and sanitized
- **Rate Limiting**: API endpoints protected against abuse

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Loop**: Check middleware configuration and Supabase setup
2. **Database Errors**: Ensure all migration scripts ran successfully
3. **Admin Access**: Verify admin user was created with correct permissions
4. **Styling Issues**: Check Tailwind CSS configuration and custom properties

### Debug Mode

Add console logs with `console.log("[v0] message")` for debugging.

## 📝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make changes** and test thoroughly
4. **Submit a pull request** with detailed description

## 📄 License

This project is proprietary software owned by bloolabb. All rights reserved.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

**Made with ❤️ for amazing kids learning AI and entrepreneurship!**
