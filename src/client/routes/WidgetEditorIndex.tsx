import { Navigate, useSearchParams } from 'react-router';
import RecentWidgetsPage from './RecentWidgetsPage';
import { useAppData } from '@/context/app-context';

export default function WidgetEditorIndex() {
  const { config } = useAppData();
  const { preferences } = config;
  const [searchParams] = useSearchParams();

  const showRecent = searchParams.get('recent') === 'true';
  if (showRecent) return <RecentWidgetsPage />;

  const direct = preferences.directToWidget;
  const lastId = preferences.lastWidget;

  if (direct && lastId) {
    return <Navigate to={`/widget_editor/${lastId}`} replace />;
  }

  return <RecentWidgetsPage />;
}
