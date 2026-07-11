import { Role, ROLE_PERMISSION_MATRIX } from '@/shared/permissions';

export class PermissionService {
  private role: Role;
  private permissions: Set<string>;

  constructor(role: Role) {
    this.role = role;
    this.permissions = this.buildPermissionSet(role);
  }

  can(key: string): boolean {
    if (this.permissions.has('*')) return true;
    if (this.permissions.has(key)) return true;
    
    // Check wildcard (e.g., trips:* for trips:edit)
    const [module] = key.split(':');
    if (this.permissions.has(`${module}:*`)) return true;

    return false;
  }

  canAny(keys: string[]): boolean {
    return keys.some(key => this.can(key));
  }

  canAll(keys: string[]): boolean {
    return keys.every(key => this.can(key));
  }
  
  private buildPermissionSet(role: Role): Set<string> {
    const perms = ROLE_PERMISSION_MATRIX[role] || [];
    return new Set(perms);
  }
}
