import { Role } from '@/shared/permissions';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  is_active: boolean;
  status: 'active' | 'inactive' | 'locked' | 'force_password_change';
  avatar_url?: string | null;
  must_change_password: boolean;
  failed_login_attempts: number;
  locked_at?: string | null;
  last_login_at?: string | null;
  created_at: string;
}

export interface AdminUserUpdate {
  name?: string;
  phone?: string | null;
  role?: Role;
  is_active?: boolean;
  status?: 'active' | 'inactive' | 'locked' | 'force_password_change';
  must_change_password?: boolean;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  category: string;
}

export interface NumberSequence {
  id: string;
  entity_type: string;
  prefix: string;
  suffix?: string | null;
  include_year: boolean;
  padding_digits: number;
  current_value: number;
  format_preview: string;
}

export interface SecurityPolicy {
  id: string;
  min_password_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_digits: boolean;
  require_special: boolean;
  password_expiry_days: number;
  max_failed_attempts: number;
  session_timeout_minutes: number;
  remember_me_days: number;
  two_factor_enabled: boolean;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes?: Record<string, any> | null;
  ip_address?: string | null;
  created_at: string;
}
