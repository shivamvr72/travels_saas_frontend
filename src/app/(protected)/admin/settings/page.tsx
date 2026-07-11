'use client';

import { useState } from 'react';
import { useSystemSettings, useSecurityPolicy, useUpdateSystemSetting, useUpdateSecurityPolicy } from '@/features/admin/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Plus, Pencil } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

function GeneralSettingsTab() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateSetting = useUpdateSystemSetting();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ key: '', value: '', category: 'general' });
  const [isEdit, setIsEdit] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.key || !form.value) return toast.error("Key and Value are required");
    try {
      await updateSetting.mutateAsync(form);
      toast.success("Setting saved successfully");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to save setting");
    }
  };

  const handleEdit = (s: any) => {
    setForm({ key: s.key, value: s.value, category: s.category || 'general' });
    setIsEdit(true);
    setOpen(true);
  };

  const handleAdd = () => {
    setForm({ key: '', value: '', category: 'general' });
    setIsEdit(false);
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>System-wide configuration variables.</CardDescription>
        </div>
        <Button size="sm" onClick={handleAdd}><Plus className="h-4 w-4 mr-2" /> Add Setting</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : (
          <div className="space-y-4 text-sm text-gray-600">
            {settings?.length ? (
              <div className="grid gap-4">
                {settings.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-semibold text-gray-900">{s.key}</div>
                      <div className="text-gray-500">{s.value}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No general settings configured.</p>
            )}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Edit Setting' : 'Add Setting'}</DialogTitle>
              <DialogDescription>Add or update a system setting key-value pair.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Setting Key</Label>
                {isEdit ? (
                  <Input value={form.key} disabled={true} />
                ) : (
                  <Select value={form.key} onValueChange={v => setForm({...form, key: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a system setting..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COMPANY_NAME">Company Name</SelectItem>
                      <SelectItem value="COMPANY_ADDRESS">Company Address</SelectItem>
                      <SelectItem value="SUPPORT_EMAIL">Support Email</SelectItem>
                      <SelectItem value="SUPPORT_PHONE">Support Phone</SelectItem>
                      <SelectItem value="DEFAULT_CURRENCY">Default Currency</SelectItem>
                      <SelectItem value="TAX_PERCENTAGE">Tax Percentage</SelectItem>
                      <SelectItem value="TIMEZONE">Timezone</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input value={form.value} onChange={e => setForm({...form, value: e.target.value})} placeholder="Enter the value for this setting..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={updateSetting.isPending}>
                {updateSetting.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function SecurityPolicyTab() {
  const { data: security, isLoading } = useSecurityPolicy();
  const updatePolicy = useUpdateSecurityPolicy();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    min_password_length: 8,
    require_uppercase: true,
    require_digits: true,
    require_special: true,
    max_failed_attempts: 5,
    session_timeout_minutes: 60
  });

  const handleEdit = () => {
    if (security) {
      setForm({
        min_password_length: security.min_password_length,
        require_uppercase: security.require_uppercase,
        require_digits: security.require_digits,
        require_special: security.require_special,
        max_failed_attempts: security.max_failed_attempts,
        session_timeout_minutes: security.session_timeout_minutes
      });
    }
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePolicy.mutateAsync(form);
      toast.success("Security policy updated");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to update security policy");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Security Policy</CardTitle>
          <CardDescription>Password and authentication rules.</CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={handleEdit}><Pencil className="h-4 w-4 mr-2" /> Edit Policy</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : security ? (
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div className="flex flex-col"><span className="text-gray-500">Min Password Length</span><span className="font-medium">{security.min_password_length} characters</span></div>
            <div className="flex flex-col"><span className="text-gray-500">Require Uppercase</span><span className="font-medium">{security.require_uppercase ? 'Yes' : 'No'}</span></div>
            <div className="flex flex-col"><span className="text-gray-500">Require Numbers</span><span className="font-medium">{security.require_digits ? 'Yes' : 'No'}</span></div>
            <div className="flex flex-col"><span className="text-gray-500">Require Symbols</span><span className="font-medium">{security.require_special ? 'Yes' : 'No'}</span></div>
            <div className="flex flex-col"><span className="text-gray-500">Max Failed Attempts</span><span className="font-medium">{security.max_failed_attempts} attempts</span></div>
            <div className="flex flex-col"><span className="text-gray-500">Session Timeout</span><span className="font-medium">{security.session_timeout_minutes} minutes</span></div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No security policy defined.</p>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Security Policy</DialogTitle>
              <DialogDescription>Update authentication and password requirements.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-2">Min Password Length</Label>
                <Input type="number" min={4} max={32} className="col-span-2" value={form.min_password_length} onChange={e => setForm({...form, min_password_length: parseInt(e.target.value)})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-2">Max Failed Attempts</Label>
                <Input type="number" min={3} max={10} className="col-span-2" value={form.max_failed_attempts} onChange={e => setForm({...form, max_failed_attempts: parseInt(e.target.value)})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-2">Session Timeout (mins)</Label>
                <Input type="number" min={15} max={1440} className="col-span-2" value={form.session_timeout_minutes} onChange={e => setForm({...form, session_timeout_minutes: parseInt(e.target.value)})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-2">Require Uppercase</Label>
                <select className="col-span-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.require_uppercase ? "true" : "false"} onChange={e => setForm({...form, require_uppercase: e.target.value === "true"})}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-2">Require Numbers</Label>
                <select className="col-span-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.require_digits ? "true" : "false"} onChange={e => setForm({...form, require_digits: e.target.value === "true"})}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-2">Require Symbols</Label>
                <select className="col-span-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.require_special ? "true" : "false"} onChange={e => setForm({...form, require_special: e.target.value === "true"})}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={updatePolicy.isPending}>
                {updatePolicy.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
        <p className="text-sm text-gray-500">Configure global preferences and policies.</p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security Policy</TabsTrigger>
          <TabsTrigger value="sequences">Number Sequences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralSettingsTab />
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityPolicyTab />
        </TabsContent>
        
        <TabsContent value="sequences">
          <Card>
            <CardHeader>
              <CardTitle>Number Sequences</CardTitle>
              <CardDescription>Manage auto-generated identifiers for entities.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Feature under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
