'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Camera, Mail, UserCircle, Briefcase, Hash, Activity, Pencil, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiClient as api } from '@/shared/lib/axios';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [editName, setEditName] = useState(user?.full_name || user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const [avatarOpen, setAvatarOpen] = useState(false);
  const [editAvatarUrl, setEditAvatarUrl] = useState(user?.avatar_url || '');
  const [passwordOpen, setPasswordOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const { data } = await api.patch('/auth/me', { name: editName, phone: editPhone });
      // The API returns the updated user which maps 'name' in backend to 'full_name' if needed, or we just spread it
      if (user) {
        setUser({ ...user, ...data });
        toast.success('Profile updated successfully');
      }
      setOpen(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await api.patch('/auth/me', { avatar_url: editAvatarUrl });
      if (user) {
        setUser({ ...user, ...data });
        toast.success('Avatar updated successfully');
      }
      setAvatarOpen(false);
    } catch (error) {
      toast.error('Failed to update avatar');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords don't match");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      await api.patch('/auth/me/password', {
        current_password: passwords.current,
        new_password: passwords.new
      });
      toast.success("Password updated successfully");
      setPasswords({ current: '', new: '', confirm: '' });
      setPasswordOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          My Profile
        </h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button variant="outline" className="hover:scale-105 transition-transform" />}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. +1 234 567 890"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="col-span-3 text-muted-foreground bg-muted/50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="text-center pb-4 relative z-10">
            <div className="mx-auto mb-4 relative w-28 h-28 group/avatar cursor-pointer" onClick={() => setAvatarOpen(true)}>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-blue-500 blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
              <Avatar className="h-28 w-28 mx-auto border-4 border-background relative shadow-xl">
                <AvatarImage src={user.avatar_url || ''} alt={user.full_name || user.name} />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                  {getInitials(user.full_name || user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center border-4 border-transparent z-20">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>

            <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update Profile Picture</DialogTitle>
                  <DialogDescription>
                    Enter a URL for your new profile picture.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Image URL</Label>
                    <Input
                      id="avatarUrl"
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleAvatarSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Update Picture'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <CardTitle className="text-2xl transition-all">{user.full_name || user.name}</CardTitle>
            <CardDescription className="text-base flex items-center justify-center gap-2 mt-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {user.email}
            </CardDescription>
            <div className="mt-4 flex justify-center">
              <Badge variant={user.is_active ? 'default' : 'secondary'} className="px-3 py-1 text-sm rounded-full capitalize shadow-sm">
                {user.is_active ? (
                  <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> Active</span>
                ) : (
                  'Inactive'
                )}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Details Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              Account Details
            </CardTitle>
            <CardDescription>
              Your personal information and system access levels.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex flex-col space-y-1.5 p-4 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-primary/70" />
                  Full Name
                </span>
                <span className="font-medium text-lg">{user.full_name || user.name}</span>
              </div>

              <div className="flex flex-col space-y-1.5 p-4 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary/70" />
                  Email Address
                </span>
                <span className="font-medium text-lg">{user.email}</span>
              </div>

              <div className="flex flex-col space-y-1.5 p-4 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary/70" />
                  System Role
                </span>
                <span className="font-medium text-lg capitalize">{user.role}</span>
              </div>

              <div className="flex flex-col space-y-1.5 p-4 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary/70" />
                  Company ID
                </span>
                <span className="font-medium font-mono text-muted-foreground truncate" title={user.travel_company_id}>
                  {user.travel_company_id}
                </span>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Security & Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </div>
            <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"><Lock className="w-4 h-4 mr-2" /> Change Password</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handlePasswordSubmit}>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>Update your account password. Use a strong password.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="current">Current Password</Label>
                      <Input
                        id="current"
                        type="password"
                        value={passwords.current}
                        onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new">New Password</Label>
                      <Input
                        id="new"
                        type="password"
                        value={passwords.new}
                        onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                        required
                        minLength={8}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm">Confirm New Password</Label>
                      <Input
                        id="confirm"
                        type="password"
                        value={passwords.confirm}
                        onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setPasswordOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? 'Updating...' : 'Change Password'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password was last updated recently. Protect your account with a strong password.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
