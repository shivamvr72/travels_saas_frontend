/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const modules = [
  { path: 'companies', key: 'companies' },
  { path: 'customers', key: 'customers' },
  { path: 'drivers', key: 'drivers' },
  { path: 'vehicles', key: 'vehicles' },
  { path: 'routes', key: 'routes' },
  { path: 'trips', key: 'trips' },
  { path: 'expenses', key: 'expenses' },
  { path: 'payments', key: 'payments' },
  { path: 'external-hiring', key: 'external-hiring' },
  { path: 'profitability', key: 'profitability' },
  { path: 'settings', key: 'settings' },
];

const basePath = path.join(__dirname, 'src/app/(protected)');

modules.forEach(mod => {
  const modDir = path.join(basePath, mod.path);
  const newDir = path.join(modDir, 'new');
  const idDir = path.join(modDir, '[id]');
  const editDir = path.join(idDir, 'edit');

  [modDir, newDir, idDir, editDir].forEach(d => {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  });

  // 1. List Page
  fs.writeFileSync(path.join(modDir, 'page.tsx'), `import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function ${mod.key.replace(/-/g, '')}ListPage() {
  return <MetadataCrudView feature="${mod.key}" view="list" />;
}
`);

  // 2. New Page
  fs.writeFileSync(path.join(newDir, 'page.tsx'), `import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function New${mod.key.replace(/-/g, '')}Page() {
  return <MetadataCrudView feature="${mod.key}" view="form" />;
}
`);

  // 3. Details Page
  fs.writeFileSync(path.join(idDir, 'page.tsx'), `import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function ${mod.key.replace(/-/g, '')}DetailsPage({ params }: { params: { id: string } }) {
  return <MetadataCrudView feature="${mod.key}" view="details" id={params.id} />;
}
`);

  // 4. Edit Page
  fs.writeFileSync(path.join(editDir, 'page.tsx'), `import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function Edit${mod.key.replace(/-/g, '')}Page({ params }: { params: { id: string } }) {
  return <MetadataCrudView feature="${mod.key}" view="form" id={params.id} isEditing />;
}
`);
});

console.log('Pages refactored successfully!');
