export interface ProfilePayload {
  user_id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  social_links: Record<string, string | null> | null;
  gear_dashboard_title: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProfileRecord {
  user_id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  social_links: Record<string, string | null> | null;
  gear_dashboard_title: string | null;
  created_at: Date;
  updated_at: Date;
}

export function mapProfile(record: ProfileRecord): ProfilePayload {
  return {
    user_id: record.user_id,
    username: record.username,
    display_name: record.display_name,
    bio: record.bio,
    avatar_url: record.avatar_url,
    social_links: record.social_links,
    gear_dashboard_title: record.gear_dashboard_title,
    created_at: record.created_at,
    updated_at: record.updated_at,
  };
}
