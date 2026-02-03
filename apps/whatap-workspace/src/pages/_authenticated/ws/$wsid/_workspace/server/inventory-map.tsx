/**
 * Server Inventory Map Page Route
 * @route /ws/:wsid/server/inventory-map
 */
import { ServerInventoryMapPage } from '@/widgets/server-inventory-map';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/server/inventory-map')({
  component: ServerInventoryMapRoute,
});

function ServerInventoryMapRoute() {
  return (
    <div className='container py-6'>
      <ServerInventoryMapPage />
    </div>
  );
}
