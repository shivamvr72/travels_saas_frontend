'use client';

import { ReactNode, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CrudModuleConfig } from './crud-types';
import { AppFormPage } from './app-form-page';
import { useForm, FormProvider, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSkeleton } from '@/components/shared/skeletons/form-skeleton';
import { FieldRenderer } from './field-renderer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface CrudFormProps {
  config: CrudModuleConfig<unknown, unknown, unknown, unknown>;
  form?: UseFormReturn<FieldValues>;
  isEditing: boolean;
  id?: string;
  children?: ReactNode;
  defaultValues?: Record<string, unknown>;
}

export function CrudForm({
  config,
  form,
  isEditing,
  id,
  children,
  defaultValues,
}: CrudFormProps) {
  const router = useRouter();

  const useCreate = config.hooks.useCreate;
  const useUpdate = config.hooks.useUpdate;


  if (!useCreate || !useUpdate) {
    throw new Error('useCreate and useUpdate hooks must be provided in config to use CrudForm');
  }

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  
  // If editing, fetch existing data
  const { data: initialData, isLoading: isFetchingDetail } = config.hooks.useDetail(id || '');
  const isLoadingInitial = isEditing ? isFetchingDetail : false;

  const computedDefaultValues = useMemo(() => {
    const defaults: Record<string, any> = { ...defaultValues };
    if (!isEditing && config.form?.sections) {
      config.form.sections.forEach(sec => {
        sec.fields.forEach(f => {
          if (f.type === 'switch' && defaults[f.name] === undefined) {
            defaults[f.name] = true;
          }
        });
      });
    }
    return defaults;
  }, [config.form?.sections, defaultValues, isEditing]);

  const internalForm = useForm<FieldValues>({
    mode: 'onChange',
    // @ts-expect-error schema typings mismatch
    resolver: config.schema ? zodResolver(config.schema) : undefined,
    defaultValues: computedDefaultValues,
    values: initialData || computedDefaultValues, // Auto-updates when initialData is fetched
  });

  const activeForm = form || internalForm;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      if (isEditing && id) {
        const payload = config.lifecycle?.beforeUpdate 
          ? await config.lifecycle.beforeUpdate(id, data) 
          : data;
          
        if (payload === false) return; // Hook cancelled execution

        updateMutation.mutate({ id, data: payload || data }, {
          onSuccess: async (res) => {
            if (config.lifecycle?.afterUpdate) {
              await config.lifecycle.afterUpdate(id, payload || data, res);
            }
            router.push(config.routeBase);
          }
        });
      } else {
        const payload = config.lifecycle?.beforeCreate
          ? await config.lifecycle.beforeCreate(data)
          : data;
          
        if (payload === false) return;

        createMutation.mutate(payload || data, {
          onSuccess: async (res) => {
            if (config.lifecycle?.afterCreate) {
              await config.lifecycle.afterCreate(payload || data, res);
            }
            router.push(config.routeBase);
          }
        });
      }
    } catch (e) {
      console.error('Lifecycle error:', e);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        activeForm.handleSubmit(onSubmit)();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeForm, isEditing, id, config, createMutation, updateMutation, router]);

  if (isLoadingInitial) {
    return <FormSkeleton />;
  }

  return (
    <AppFormPage
      title={isEditing ? `Edit ${config.entityName}` : `Add ${config.entityName}`}
      description={isEditing ? `Update the details of this ${config.entityName.toLowerCase()}` : `Create a new ${config.entityName.toLowerCase()}`}
      backUrl={config.routeBase}
    >
      <FormProvider {...activeForm}>
        <form onSubmit={activeForm.handleSubmit(onSubmit)} className="space-y-6">
        {children ? children : (
          config.form ? (
            <div className="space-y-6">
              {config.form.layout === 'tabs' && config.form.tabs ? (
                <Tabs defaultValue={config.form.tabs[0].title.toLowerCase().replace(/\s+/g, '-')}>
                  <TabsList className="mb-4">
                    {config.form.tabs.map(tab => (
                      <TabsTrigger key={tab.title} value={tab.title.toLowerCase().replace(/\s+/g, '-')}>
                        {tab.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {config.form.tabs.map(tab => (
                    <TabsContent key={tab.title} value={tab.title.toLowerCase().replace(/\s+/g, '-')}>
                      <div className="space-y-6">
                        {tab.groups.map((group, gIdx) => (
                          <div key={gIdx} className="space-y-4">
                            <h3 className="text-lg font-semibold">{group.title}</h3>
                            {group.sections.map((section, sIdx) => (
                              <Card key={sIdx}>
                                {section.title && (
                                  <CardHeader>
                                    <CardTitle className="text-lg">{section.title}</CardTitle>
                                    {section.description && <CardDescription>{section.description}</CardDescription>}
                                  </CardHeader>
                                )}
                                <CardContent className={section.title ? "" : "pt-6"}>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {section.fields.map(field => (
                                      <div key={field.name} className={field.span === 2 ? "md:col-span-2" : ""}>
                                        <FieldRenderer field={field} form={activeForm} />
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : config.form.layout === 'groups' && config.form.groups ? (
                <div className="space-y-8">
                  {config.form.groups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-4">
                      <h3 className="text-lg font-semibold">{group.title}</h3>
                      {group.sections.map((section, sIdx) => (
                        <Card key={sIdx}>
                          {section.title && (
                            <CardHeader>
                              <CardTitle className="text-lg">{section.title}</CardTitle>
                              {section.description && <CardDescription>{section.description}</CardDescription>}
                            </CardHeader>
                          )}
                          <CardContent className={section.title ? "" : "pt-6"}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {section.fields.map(field => (
                                <div key={field.name} className={field.span === 2 ? "md:col-span-2" : ""}>
                                  <FieldRenderer field={field} form={activeForm} />
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                // Default Sections Layout
                config.form.sections?.map((section, index) => (
                  <Card key={index}>
                    {section.title && (
                      <CardHeader>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        {section.description && <CardDescription>{section.description}</CardDescription>}
                      </CardHeader>
                    )}
                    <CardContent className={section.title ? "" : "pt-6"}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {section.fields.map(field => (
                          <div key={field.name} className={field.span === 2 ? "md:col-span-2" : ""}>
                            <FieldRenderer field={field} form={activeForm} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="p-4 border rounded-md bg-destructive/10 text-destructive text-sm">
              No form configuration or children provided.
            </div>
          )
        )}
        
        <div className="flex justify-end mt-6 space-x-2">
          <Button type="button" variant="outline" onClick={() => router.push(config.routeBase)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (isEditing ? 'Save Changes' : 'Create')}
          </Button>
        </div>
        </form>
      </FormProvider>
    </AppFormPage>
  );
}
