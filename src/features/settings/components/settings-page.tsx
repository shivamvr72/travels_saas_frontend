'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Loader2, 
  Building2, 
  Paintbrush, 
  Receipt, 
  MapPin, 
  Upload, 
  Trash2, 
  Check, 
  UserCircle, 
  Sun, 
  Moon, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

import { AppPageContainer } from '@/components/layout/crud/app-page-container';
import { AppToolbar } from '@/components/layout/crud/app-toolbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/shared/lib/axios';
import { useTenantStore } from '@/store/tenant-store';
import { applyThemeColors } from '@/shared/lib/theme-utils';

const COLOR_PRESETS = [
  { name: 'Royal Blue (Default)', primary: '#1e3fe6', secondary: '#06d08d' },
  { name: 'Emerald Fleet', primary: '#059669', secondary: '#f59e0b' },
  { name: 'Indigo Luxe', primary: '#4f46e5', secondary: '#ec4899' },
  { name: 'Crimson Express', primary: '#dc2626', secondary: '#3b82f6' },
  { name: 'Midnight Cyan', primary: '#0891b2', secondary: '#10b981' },
  { name: 'Amber Voyage', primary: '#d97706', secondary: '#2563eb' },
];

const formSchema = z.object({
  travel_name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  email: z.string().email('Invalid email').optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  website: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  gst_number: z.string().optional().nullable(),
  pan_number: z.string().optional().nullable(),
  
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color').optional().nullable().or(z.literal('')),
  secondary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color').optional().nullable().or(z.literal('')),
  logo_url: z.string().optional().nullable().or(z.literal('')),
  voucher_tagline: z.string().optional().nullable(),
  voucher_footer: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [previewDarkMode, setPreviewDarkMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setTenant } = useTenantStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      travel_name: '',
      slug: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      gst_number: '',
      pan_number: '',
      primary_color: '#1e3fe6', 
      secondary_color: '#06d08d',
      logo_url: '',
      voucher_tagline: '',
      voucher_footer: '',
    },
  });

  const primaryColorValue = form.watch('primary_color');
  const secondaryColorValue = form.watch('secondary_color');
  const logoUrlValue = form.watch('logo_url');
  const travelNameValue = form.watch('travel_name');

  // Real-time live application to the entire web application DOM!
  useEffect(() => {
    if (primaryColorValue || secondaryColorValue) {
      applyThemeColors(primaryColorValue, secondaryColorValue);
    }
  }, [primaryColorValue, secondaryColorValue]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await apiClient.get('/api/v1/my-company');
        const pri = data.primary_color || '#1e3fe6';
        const sec = data.secondary_color || '#06d08d';
        
        form.reset({
          travel_name: data.travel_name || '',
          slug: data.slug || '',
          email: data.email || '',
          phone: data.phone || '',
          website: data.website || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          gst_number: data.gst_number || '',
          pan_number: data.pan_number || '',
          primary_color: pri,
          secondary_color: sec,
          logo_url: data.logo_url || '',
          voucher_tagline: data.voucher_tagline || '',
          voucher_footer: data.voucher_footer || '',
        });

        // Apply immediately
        applyThemeColors(pri, sec);
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, [form]);

  // Handle Logo File Upload
  const handleLogoFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo image must be smaller than 5MB');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await apiClient.post('/api/v1/my-company/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newLogoUrl = data.logo_url;
      form.setValue('logo_url', newLogoUrl, { shouldDirty: true });
      
      // Update tenant store immediately for instant sidebar/topbar reflection
      setTenant(data);
      try {
        localStorage.setItem('tenantLogo', newLogoUrl);
      } catch {}

      toast.success('Logo uploaded successfully!');
    } catch (error: any) {
      // Fallback: Read as base64 data URL if backend logo endpoint encounters issues
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          form.setValue('logo_url', reader.result, { shouldDirty: true });
          toast.success('Logo loaded from device!');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    form.setValue('logo_url', '', { shouldDirty: true });
    try {
      localStorage.removeItem('tenantLogo');
    } catch {}
    toast.info('Logo removed. Save settings to confirm.');
  };

  async function onSubmit(values: FormValues) {
    setIsSaving(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, v === '' ? null : v])
      );
      
      const { data } = await apiClient.put('/api/v1/my-company', payload);
      
      // Update store and theme
      setTenant(data);
      applyThemeColors(data.primary_color, data.secondary_color);
      
      if (data.slug) localStorage.setItem('tenantSlug', data.slug);
      if (data.logo_url) localStorage.setItem('tenantLogo', data.logo_url);
      if (data.travel_name) {
        localStorage.setItem('tenantName', data.travel_name);
        document.title = `${data.travel_name} | SVR Travels SaaS`;
      }

      toast.success('Settings and theme updated successfully across all pages!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppPageContainer>
      <AppToolbar title="Organization Settings" />
      
      {isLoading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto mt-6 pb-24">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <Tabs defaultValue="branding" orientation="vertical" className="w-full gap-6">
                
                {/* Left Tabs List */}
                <TabsList className="w-full md:w-64 bg-transparent gap-2 p-0 justify-start items-stretch">
                  <TabsTrigger 
                    value="branding" 
                    className="justify-start px-4 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
                  >
                    <Paintbrush className="w-4 h-4 mr-2 text-primary" />
                    Theme & Branding
                  </TabsTrigger>
                  <TabsTrigger 
                    value="general" 
                    className="justify-start px-4 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    General Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="address" 
                    className="justify-start px-4 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Address & Contact
                  </TabsTrigger>
                  <TabsTrigger 
                    value="compliance" 
                    className="justify-start px-4 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Compliance & Vouchers
                  </TabsTrigger>
                </TabsList>

                {/* Right Content Area */}
                <div className="flex-1">
                  
                  {/* BRANDING TAB */}
                  <TabsContent value="branding" className="mt-0 space-y-6">
                    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
                      
                      <div className="space-y-6">
                        {/* Theme Colors Card */}
                        <Card className="border shadow-sm">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-primary" />
                              Theme & Brand Colors
                            </CardTitle>
                            <CardDescription>
                              Pick your primary and secondary colors. These apply globally across all pages, buttons, sidebars, badges, and headers in real time.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            
                            {/* Color Inputs */}
                            <div className="grid gap-4 sm:grid-cols-2">
                              <FormField 
                                control={form.control} 
                                name="primary_color" 
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="font-semibold flex items-center justify-between">
                                      <span>Primary Color</span>
                                      <span className="text-xs text-muted-foreground font-mono">{field.value}</span>
                                    </FormLabel>
                                    <FormControl>
                                      <div className="flex gap-2 items-center">
                                        <Input 
                                          type="color" 
                                          className="w-14 h-11 p-1 cursor-pointer rounded-lg border shadow-sm shrink-0" 
                                          {...field} 
                                          value={field.value || '#1e3fe6'} 
                                        />
                                        <Input 
                                          type="text" 
                                          className="font-mono uppercase h-11 tracking-wider" 
                                          placeholder="#1E3FE6"
                                          {...field} 
                                          value={field.value || ''} 
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                      Main action buttons, active navigation, highlights, and borders.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )} 
                              />

                              <FormField 
                                control={form.control} 
                                name="secondary_color" 
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="font-semibold flex items-center justify-between">
                                      <span>Secondary Color</span>
                                      <span className="text-xs text-muted-foreground font-mono">{field.value}</span>
                                    </FormLabel>
                                    <FormControl>
                                      <div className="flex gap-2 items-center">
                                        <Input 
                                          type="color" 
                                          className="w-14 h-11 p-1 cursor-pointer rounded-lg border shadow-sm shrink-0" 
                                          {...field} 
                                          value={field.value || '#06d08d'} 
                                        />
                                        <Input 
                                          type="text" 
                                          className="font-mono uppercase h-11 tracking-wider" 
                                          placeholder="#06D08D"
                                          {...field} 
                                          value={field.value || ''} 
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                      Accent highlights, success tags, secondary alerts, and badges.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )} 
                              />
                            </div>

                            {/* Preset Color Palettes */}
                            <div className="pt-2 border-t">
                              <p className="text-xs font-medium text-muted-foreground mb-3">
                                Quick Palette Presets:
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {COLOR_PRESETS.map((preset) => (
                                  <button
                                    key={preset.name}
                                    type="button"
                                    onClick={() => {
                                      form.setValue('primary_color', preset.primary, { shouldDirty: true });
                                      form.setValue('secondary_color', preset.secondary, { shouldDirty: true });
                                    }}
                                    className="flex items-center gap-2 p-2 rounded-lg border text-left text-xs hover:bg-muted/60 transition-all group"
                                  >
                                    <div className="flex -space-x-1 shrink-0">
                                      <div 
                                        className="w-4 h-4 rounded-full border border-background shadow-xs" 
                                        style={{ backgroundColor: preset.primary }} 
                                      />
                                      <div 
                                        className="w-4 h-4 rounded-full border border-background shadow-xs" 
                                        style={{ backgroundColor: preset.secondary }} 
                                      />
                                    </div>
                                    <span className="truncate group-hover:text-foreground text-muted-foreground font-medium">
                                      {preset.name.split(' ')[0]}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Logo Upload Card */}
                        <Card className="border shadow-sm">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Building2 className="w-5 h-5 text-primary" />
                              Company Logo
                            </CardTitle>
                            <CardDescription>
                              Upload your company logo to appear in the sidebar, header, invoices, and login screen.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            
                            {/* Current Logo Preview & Upload Dropzone */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-dashed bg-muted/20">
                              {logoUrlValue ? (
                                <div className="relative group shrink-0">
                                  <div className="w-24 h-24 rounded-lg border bg-background flex items-center justify-center p-2 overflow-hidden shadow-xs">
                                    <img 
                                      src={logoUrlValue} 
                                      alt="Logo Preview" 
                                      className="max-h-full max-w-full object-contain" 
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={handleRemoveLogo}
                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow hover:opacity-90"
                                    title="Remove Logo"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="w-24 h-24 rounded-lg border border-dashed bg-background flex flex-col items-center justify-center text-muted-foreground shrink-0">
                                  <Building2 className="w-8 h-8 opacity-40 mb-1 text-primary" />
                                  <span className="text-[10px]">No Logo</span>
                                </div>
                              )}

                              <div className="flex-1 text-center sm:text-left space-y-2">
                                <h4 className="text-sm font-semibold">
                                  {logoUrlValue ? 'Replace Company Logo' : 'Upload Logo Image'}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Select a PNG, JPG, SVG, or WEBP file from your device (up to 5MB). Transparent backgrounds look best.
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start pt-1">
                                  <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept="image/png,image/jpeg,image/svg+xml,image/webp" 
                                    className="hidden" 
                                    onChange={handleLogoFileUpload} 
                                  />
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    disabled={isUploadingLogo}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="gap-2"
                                  >
                                    {isUploadingLogo ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Upload className="w-4 h-4" />
                                    )}
                                    {isUploadingLogo ? 'Uploading...' : 'Choose File from Device'}
                                  </Button>
                                  {logoUrlValue && (
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={handleRemoveLogo}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      Remove Logo
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Direct URL input fallback */}
                            <FormField 
                              control={form.control} 
                              name="logo_url" 
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-muted-foreground">
                                    Or provide direct Image URL:
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="https://example.com/logo.png" 
                                      {...field} 
                                      value={field.value || ''} 
                                      className="text-xs"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} 
                            />
                          </CardContent>
                        </Card>
                      </div>

                      {/* Interactive Live Preview Card */}
                      <Card className="border shadow-md overflow-hidden flex flex-col h-fit sticky top-20">
                        <CardHeader className="bg-muted/40 pb-3 border-b flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-sm font-semibold">Live Theme Preview</CardTitle>
                            <CardDescription className="text-xs">Interactive demonstration</CardDescription>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreviewDarkMode(!previewDarkMode)}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                            title="Toggle preview dark/light background"
                          >
                            {previewDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                          </button>
                        </CardHeader>
                        
                        <CardContent className="p-0">
                          <div className={`p-5 transition-colors duration-200 ${previewDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
                            
                            {/* Mock Header */}
                            <div className={`flex items-center gap-2.5 mb-5 p-2.5 rounded-lg border shadow-xs ${previewDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
                              {logoUrlValue ? (
                                <img 
                                  src={logoUrlValue} 
                                  alt="Logo" 
                                  className="h-7 w-7 object-contain rounded" 
                                />
                              ) : (
                                <div 
                                  className="h-7 w-7 rounded-md flex items-center justify-center font-bold text-xs text-white" 
                                  style={{ backgroundColor: primaryColorValue || '#1e3fe6' }}
                                >
                                  {(travelNameValue || 'S').charAt(0)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-xs truncate" style={{ color: primaryColorValue || '#1e3fe6' }}>
                                  {travelNameValue || 'SVR Travels'}
                                </h4>
                                <p className="text-[10px] text-muted-foreground truncate">Travel Operations</p>
                              </div>
                            </div>
                            
                            {/* Mock Interactive Content */}
                            <div className="space-y-3.5">
                              {/* Primary Action Button */}
                              <div>
                                <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1">
                                  Primary Button
                                </label>
                                <button 
                                  type="button" 
                                  onClick={() => toast.success(`Primary Action clicked! Active color: ${primaryColorValue}`)}
                                  className="w-full py-2 px-3 rounded-lg text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer" 
                                  style={{ backgroundColor: primaryColorValue || '#1e3fe6' }}
                                >
                                  <span>Primary Action Button</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Secondary Tag & Badge */}
                              <div>
                                <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1">
                                  Secondary Accent Badge
                                </label>
                                <div className="flex items-center gap-2">
                                  <span 
                                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                                    style={{ 
                                      backgroundColor: secondaryColorValue || '#06d08d',
                                      color: '#ffffff'
                                    }}
                                  >
                                    <Check className="w-3 h-3" />
                                    Active Trip (Secondary)
                                  </span>
                                  <span 
                                    className="px-2 py-0.5 rounded text-[10px] font-mono font-medium"
                                    style={{ 
                                      backgroundColor: `${secondaryColorValue}25`,
                                      color: secondaryColorValue || '#06d08d'
                                    }}
                                  >
                                    #CONFIRMED
                                  </span>
                                </div>
                              </div>
                              
                              {/* Alert Box Card */}
                              <div 
                                className={`p-3 rounded-lg border-l-4 shadow-2xs ${previewDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`} 
                                style={{ borderLeftColor: primaryColorValue || '#1e3fe6' }}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-semibold text-xs" style={{ color: primaryColorValue || '#1e3fe6' }}>
                                    Live Theme Connected
                                  </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                  The entire application updates instantly with your brand colors.
                                </p>
                              </div>
                            </div>

                          </div>
                        </CardContent>
                      </Card>

                    </div>
                  </TabsContent>

                  {/* GENERAL INFO TAB */}
                  <TabsContent value="general" className="mt-0 space-y-6">
                    <Card className="border shadow-sm">
                      <CardHeader>
                        <CardTitle>General Information</CardTitle>
                        <CardDescription>Core organization details and identifier.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField control={form.control} name="travel_name" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl><Input placeholder="SVR Travels" {...field} value={field.value || ''} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="slug" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tenant Slug</FormLabel>
                              <FormControl><Input placeholder="svr-travels" {...field} value={field.value || ''} /></FormControl>
                              <FormDescription className="text-xs">Subdomain identifier used for branding lookup.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Contact Email</FormLabel>
                              <FormControl><Input type="email" placeholder="admin@svrtravels.com" {...field} value={field.value || ''} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl><Input placeholder="+91 9876543210" {...field} value={field.value || ''} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name="website" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl><Input placeholder="https://www.svrtravels.com" {...field} value={field.value || ''} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        {/* Personal Profile Notice */}
                        <div className="p-4 rounded-xl border bg-muted/30 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <UserCircle className="w-6 h-6 text-primary shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Looking for your personal profile?</p>
                              <p className="text-xs text-muted-foreground">Change your own user display name, avatar picture, or password.</p>
                            </div>
                          </div>
                          <Link href="/profile">
                            <Button type="button" variant="outline" size="sm" className="shrink-0 gap-1.5">
                              <span>Go to My Profile</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* ADDRESS TAB */}
                  <TabsContent value="address" className="mt-0">
                    <Card className="border shadow-sm">
                      <CardHeader>
                        <CardTitle>Physical Address</CardTitle>
                        <CardDescription>Location details for your main branch / office.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField control={form.control} name="address" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl><Input placeholder="Office 101, Main Road" {...field} value={field.value || ''} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        
                        <div className="grid gap-4 md:grid-cols-3">
                          <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl><Input placeholder="Hyderabad" {...field} value={field.value || ''} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="state" render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl><Input placeholder="Telangana" {...field} value={field.value || ''} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="pincode" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl><Input placeholder="500001" {...field} value={field.value || ''} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* COMPLIANCE TAB */}
                  <TabsContent value="compliance" className="mt-0 space-y-6">
                    <Card className="border shadow-sm">
                      <CardHeader>
                        <CardTitle>Tax & Registration</CardTitle>
                        <CardDescription>Tax registration numbers for billing and customer invoices.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField control={form.control} name="gst_number" render={({ field }) => (
                            <FormItem>
                              <FormLabel>GST Number</FormLabel>
                              <FormControl><Input placeholder="36AAAAA0000A1Z5" className="font-mono uppercase" {...field} value={field.value || ''} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="pan_number" render={({ field }) => (
                            <FormItem>
                              <FormLabel>PAN Number</FormLabel>
                              <FormControl><Input placeholder="ABCDE1234F" className="font-mono uppercase" {...field} value={field.value || ''} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                      <CardHeader>
                        <CardTitle>Voucher Customization</CardTitle>
                        <CardDescription>Custom header and footer text printed on trip sheets and customer vouchers.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField control={form.control} name="voucher_tagline" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Voucher Tagline</FormLabel>
                            <FormControl><Input placeholder="Your Premier Journey Partner" {...field} value={field.value || ''} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="voucher_footer" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Voucher Footer</FormLabel>
                            <FormControl><Input placeholder="Thank you for traveling with us. Terms and conditions apply." {...field} value={field.value || ''} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                </div>
              </Tabs>

              {/* Floating Bottom Action Bar */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t flex justify-end z-20 sm:left-64">
                <div className="w-full max-w-6xl mx-auto flex items-center justify-between pr-4">
                  <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Real-time theme engine active</span>
                  </div>
                  <Button type="submit" disabled={isSaving} size="lg" className="shadow-lg px-8 font-semibold">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save All Settings
                  </Button>
                </div>
              </div>

            </form>
          </Form>
        </div>
      )}
    </AppPageContainer>
  );
}
