-- Users table (extended from Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'online' CHECK (status IN ('online', 'idle', 'dnd', 'offline')),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Direct Messages
CREATE TABLE direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Channels (includes groups and news channel)
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('public', 'private', 'news')),
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Channel Members
CREATE TABLE channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- Channel Messages
CREATE TABLE channel_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Settings
CREATE TABLE user_settings (
  user_id UUID REFERENCES profiles(id) PRIMARY KEY,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  show_online_status BOOLEAN DEFAULT TRUE,
  allow_dms_from TEXT DEFAULT 'everyone' CHECK (allow_dms_from IN ('everyone', 'friends', 'none')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_dm_sender ON direct_messages(sender_id);
CREATE INDEX idx_dm_receiver ON direct_messages(receiver_id);
CREATE INDEX idx_dm_created ON direct_messages(created_at DESC);
CREATE INDEX idx_channel_messages_channel ON channel_messages(channel_id);
CREATE INDEX idx_channel_messages_created ON channel_messages(created_at DESC);
CREATE INDEX idx_profiles_username ON profiles(username);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: everyone can read, only owner can update
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Direct Messages: only sender and receiver can see
CREATE POLICY "Users can view their DMs" ON direct_messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send DMs" ON direct_messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their sent DMs" ON direct_messages FOR UPDATE 
  USING (auth.uid() = sender_id);

-- Channels: public viewable, members can see private
CREATE POLICY "Public channels viewable by all" ON channels FOR SELECT 
  USING (type = 'public' OR type = 'news' OR id IN (
    SELECT channel_id FROM channel_members WHERE user_id = auth.uid()
  ));
CREATE POLICY "Users can create channels" ON channels FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

-- Channel Members
CREATE POLICY "Channel members viewable" ON channel_members FOR SELECT USING (true);
CREATE POLICY "Channel owners can add members" ON channel_members FOR INSERT 
  WITH CHECK (
    EXISTS (SELECT 1 FROM channels WHERE id = channel_id AND owner_id = auth.uid())
  );

-- Channel Messages: members can read and send
CREATE POLICY "Channel members can view messages" ON channel_messages FOR SELECT 
  USING (
    channel_id IN (SELECT channel_id FROM channel_members WHERE user_id = auth.uid())
    OR channel_id IN (SELECT id FROM channels WHERE type = 'public' OR type = 'news')
  );
CREATE POLICY "Channel members can send messages" ON channel_messages FOR INSERT 
  WITH CHECK (
    channel_id IN (SELECT channel_id FROM channel_members WHERE user_id = auth.uid())
    OR channel_id IN (SELECT id FROM channels WHERE type = 'public')
  );

-- User Settings
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
