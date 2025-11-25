# 1L Gram - Futuristic Messenger

🚀 The most incredible messenger in human history.

## 🚀 Setup Instructions

### Required Environment Variables

Add these to Vercel (Project → Settings → Environment Variables):

```
VITE_SUPABASE_URL=https://flfcpfgklvxqlzoeyrrw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZmNwZmdrbHZ4cWx6b2V5cnJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MDkyMzcsImV4cCI6MjA3NjM4NTIzN30.-ne-np7K5m5_j69OLO69IQqd1hSiCTuVoFbJtB68NR8
```

### Adding Environment Variables to Vercel (Manual):

1. Go to: https://vercel.com/seninaulya90-7255s-projects/1l-gram/settings/environment-variables
2. Click "Add New" button
3. Enter:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://flfcpfgklvxqlzoeyrrw.supabase.co`
   - Select: ✅ Production ✅ Preview ✅ Development
4. Click "Save"
5. Add another:
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: (the long JWT token above)
   - Select: ✅ Production ✅ Preview ✅ Development
6. Click "Save"
7. Go to Deployments → Latest → Click "..." → "Redeploy"

---

## 📋 Database Setup (Already Done!)

The Supabase database has been set up with:
- ✅ User profiles
- ✅ Direct messages
- ✅ Channels (public/private/news)
- ✅ Channel memberships
- ✅ User settings
- ✅ Real-time subscriptions enabled
- ✅ Row Level Security configured

---

## 🎨 Features

- 🔐 Real authentication (signup/login)
- 💬 Direct messages (coming soon)
- 📢 Channels & Groups (coming soon)
- ⚙️ User settings (coming soon)
- 🔄 Real-time updates via WebSockets
- 🎭 Cyberpunk UI with glass morphism
- ✨ 3D particle effects
- 🖱️ Custom reactive cursor

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Vanilla CSS + Framer Motion
- **3D**: Three.js (React Three Fiber)
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Hosting**: Vercel
- **Fonts**: Orbitron + VT323

---

## 📝 To Do

- [ ] Build full messaging UI
- [ ] Add user search
- [ ] Create channel browse/create interface
- [ ] Add settings panel
- [ ] Implement news channel with moderation
- [ ] Add typing indicators
- [ ] Add read receipts
- [ ] Add emoji picker
- [ ] Add file uploads
- [ ] Add voice messages

