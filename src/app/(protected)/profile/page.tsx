'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, UserCircle, Briefcase, Hash, Activity, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [editName, setEditName] = useState(user?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);

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
    // Simulate API call for now since update profile endpoint isn't wired yet
    setTimeout(() => {
      if (user) {
        setUser({ ...user, full_name: editName });
        toast.success('Profile updated successfully');
      }
      setIsSaving(false);
      setOpen(false);
    }, 600);
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
            <div className="mx-auto mb-4 relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-blue-500 blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
              <Avatar className="h-28 w-28 mx-auto border-4 border-background relative shadow-xl">
                <AvatarImage src="" alt={user.full_name} />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                  {getInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl transition-all">{user.full_name}</CardTitle>
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
                <span className="font-medium text-lg">{user.full_name}</span>
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
      </div>
    </div>
  );
}
