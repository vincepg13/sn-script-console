import { LinterCard } from './LinterCard';
import { PrettierCard } from './PrettierCard';
import { SnOptionsCard } from './SnOptionCard';
import { useQueryClient } from '@tanstack/react-query';

export function ScriptConfig() {
  const qc = useQueryClient();

  const resync = () => qc.invalidateQueries({ queryKey: ['appConfig'] });

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-3xl tracking-tighter font-bold">My Script Config</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <PrettierCard resync={resync}/>
        <LinterCard resync={resync}/>
        <SnOptionsCard resync={resync}/>
      </div>
    </div>
  );
}
