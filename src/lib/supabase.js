import { createClient } from '@supabase/supabase-js';

// These will be set from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
});

// Auth helpers
export const auth = {
    signUp: async (email, password, username) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });

        if (error) throw error;

        // Create profile
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: data.user.id,
                    username,
                    display_name: username
                });

            if (profileError) throw profileError;

            // Create default settings
            await supabase
                .from('user_settings')
                .insert({ user_id: data.user.id });
        }

        return data;
    },

    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange(callback);
    }
};

// Profile helpers
export const profiles = {
    getProfile: async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    updateProfile: async (userId, updates) => {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    searchUsers: async (query) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, display_name, avatar_url, status')
            .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
            .limit(20);

        if (error) throw error;
        return data;
    }
};

// Direct Messages
export const directMessages = {
    getConversations: async (userId) => {
        // Get all users we have DMs with
        const { data, error } = await supabase
            .from('direct_messages')
            .select(`
        *,
        sender:profiles!sender_id(id, username, display_name, avatar_url, status),
        receiver:profiles!receiver_id(id, username, display_name, avatar_url, status)
      `)
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Group by conversation partner
        const conversations = new Map();
        data?.forEach(msg => {
            const partner = msg.sender_id === userId ? msg.receiver : msg.sender;
            if (!conversations.has(partner.id)) {
                conversations.set(partner.id, {
                    user: partner,
                    lastMessage: msg,
                    unreadCount: 0
                });
            }
            if (!msg.is_read && msg.receiver_id === userId) {
                conversations.get(partner.id).unreadCount++;
            }
        });

        return Array.from(conversations.values());
    },

    getMessages: async (userId, otherUserId) => {
        const { data, error } = await supabase
            .from('direct_messages')
            .select(`
        *,
        sender:profiles!sender_id(id, username, display_name, avatar_url)
      `)
            .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    sendMessage: async (senderId, receiverId, content) => {
        const { data, error } = await supabase
            .from('direct_messages')
            .insert({
                sender_id: senderId,
                receiver_id: receiverId,
                content
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    markAsRead: async (messageIds) => {
        const { error } = await supabase
            .from('direct_messages')
            .update({ is_read: true })
            .in('id', messageIds);

        if (error) throw error;
    },

    subscribeToMessages: (userId, otherUserId, callback) => {
        return supabase
            .channel(`dm:${userId}:${otherUserId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'direct_messages',
                filter: `sender_id=eq.${otherUserId}`
            }, payload => {
                if (payload.new.receiver_id === userId) {
                    callback(payload.new);
                }
            })
            .subscribe();
    }
};

// Channels
export const channels = {
    getChannels: async (userId) => {
        const { data, error } = await supabase
            .from('channels')
            .select(`
        *,
        owner:profiles!owner_id(username),
        members:channel_members(count)
      `)
            .or(`type.eq.public,type.eq.news,id.in.(select channel_id from channel_members where user_id = ${userId})`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    createChannel: async (ownerId, name, description, type) => {
        const { data: channel, error } = await supabase
            .from('channels')
            .insert({
                owner_id: ownerId,
                name,
                description,
                type
            })
            .select()
            .single();

        if (error) throw error;

        // Add owner as member
        await supabase
            .from('channel_members')
            .insert({
                channel_id: channel.id,
                user_id: ownerId,
                role: 'owner'
            });

        return channel;
    },

    joinChannel: async (channelId, userId) => {
        const { error } = await supabase
            .from('channel_members')
            .insert({
                channel_id: channelId,
                user_id: userId
            });

        if (error) throw error;
    },

    getChannelMessages: async (channelId) => {
        const { data, error } = await supabase
            .from('channel_messages')
            .select(`
        *,
        sender:profiles!sender_id(id, username, display_name, avatar_url)
      `)
            .eq('channel_id', channelId)
            .order('created_at', { ascending: true })
            .limit(100);

        if (error) throw error;
        return data;
    },

    sendChannelMessage: async (channelId, senderId, content) => {
        const { data, error } = await supabase
            .from('channel_messages')
            .insert({
                channel_id: channelId,
                sender_id: senderId,
                content
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    subscribeToChannel: (channelId, callback) => {
        return supabase
            .channel(`channel:${channelId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'channel_messages',
                filter: `channel_id=eq.${channelId}`
            }, payload => {
                callback(payload.new);
            })
            .subscribe();
    }
};

// Settings
export const settings = {
    getSettings: async (userId) => {
        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            // Create default settings if they don't exist
            const { data: newSettings } = await supabase
                .from('user_settings')
                .insert({ user_id: userId })
                .select()
                .single();
            return newSettings;
        }
        return data;
    },

    updateSettings: async (userId, updates) => {
        const { data, error } = await supabase
            .from('user_settings')
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
