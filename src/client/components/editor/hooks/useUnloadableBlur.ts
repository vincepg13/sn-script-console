import { useWidget } from '@/context/widget-context';
import { useEffect } from 'react';

export function useUnloadableBlur() {
  const { widget, saveData, getScriptRef, setFieldValue } = useWidget();

  useEffect(() => {
    window.onbeforeunload = function (e) {
      (document.activeElement as HTMLElement).blur();

      if (saveData && Object.keys(saveData).length > 0) {
        e.preventDefault();
        return 'Unsaved Changes!';
      }

      const unloadChanges = widget.toggleButtons
        .filter(b => b.visible)
        .map(b => setFieldValue(b.field, getScriptRef(b.field).current?.getRawValue() || ''));

      if (unloadChanges.some(c => c)) {
        e.preventDefault();
        return 'Unsaved Changes!';
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
