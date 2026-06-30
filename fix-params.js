/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const modules = [
  'companies', 'customers', 'drivers', 'vehicles', 'routes',
  'trips', 'expenses', 'payments', 'external-hiring', 'profitability', 'settings',
];

const basePath = path.join(__dirname, 'src/app/(protected)');

modules.forEach(mod => {
  const key = mod;
  const fnName = mod.replace(/-/g, '');

  // [id]/page.tsx — details view
  const detailsPath = path.join(basePath, mod, '[id]', 'page.tsx');
  fs.writeFileSync(detailsPath, `import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function ${fnName}DetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="${key}" view="details" id={id} />;
}
`);

  // [id]/edit/page.tsx — edit form
  const editPath = path.join(basePath, mod, '[id]', 'edit', 'page.tsx');
  fs.writeFileSync(editPath, `import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function Edit${fnName}Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="${key}" view="form" id={id} isEditing />;
}
`);
});

console.log('All [id] pages fixed for Next.js 15 async params!');
