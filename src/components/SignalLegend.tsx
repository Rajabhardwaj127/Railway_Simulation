import { BookOpen } from 'lucide-react';

interface LegendItem {
  label: string;
  desc: string;
  color: string;
}

const SIGNAL_TYPES: LegendItem[] = [
  { label: 'Distant (D)', desc: 'Advance warning — yellow = caution ahead, green = line clear', color: 'border-yellow-500' },
  { label: 'Home (H)', desc: 'Controls entry to station limits — must be passed only at clear aspect', color: 'border-blue-400' },
  { label: 'Starter (MS/LS)', desc: 'Authorises departure from platform or loop section', color: 'border-emerald-400' },
];

const INTERLOCKING_RULES = [
  'Points must be set and LOCKED before any signal can be cleared.',
  'Conflicting routes are mutually exclusive — only one route can be set at a time.',
  'Track circuits detect train presence and replace signals to DANGER automatically.',
  'A route cannot be cancelled while a train is in the route section.',
];

export default function SignalLegend() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={14} className="text-slate-400" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Signal Types & Interlocking Rules</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Signal Types</div>
          <div className="flex flex-col gap-2">
            {SIGNAL_TYPES.map((item) => (
              <div key={item.label} className={`flex items-start gap-2 pl-2 border-l-2 ${item.color}`}>
                <div>
                  <div className="text-xs font-semibold text-slate-200">{item.label}</div>
                  <div className="text-[10px] text-slate-500 leading-snug">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Interlocking Principles</div>
          <div className="flex flex-col gap-1.5">
            {INTERLOCKING_RULES.map((rule, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-[10px] font-bold text-blue-500 mt-0.5">{i + 1}.</span>
                <span className="text-[10px] text-slate-400 leading-snug">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
