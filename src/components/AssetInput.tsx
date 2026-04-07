import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AssetInputProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  weightUnit?: string;
  ratePerUnit?: number;
  rateCurrency?: string;
  variant?: "asset" | "deduction";
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const AssetInput = ({ label, description, value, onChange, icon, weightUnit, ratePerUnit, rateCurrency, variant = "asset" }: AssetInputProps) => {
  const isWeightBased = !!weightUnit && ratePerUnit !== undefined;
  const weight = parseFloat(value || "0") || 0;
  const computedValue = isWeightBased ? weight * ratePerUnit : 0;

  const bgClass = variant === "deduction"
    ? "bg-red-500/10 border-red-500/30 hover:border-red-500/50 dark:bg-red-500/10 dark:border-red-500/30"
    : "bg-green-600/10 border-green-600/30 hover:border-green-600/50 dark:bg-green-600/10 dark:border-green-600/30";

  return (
    <div className={`group relative px-3 py-2.5 rounded-lg transition-colors ${bgClass}`}>
      <Label className="font-body font-medium text-foreground text-sm leading-tight block mb-1.5">{label}</Label>
      {isWeightBased ? (
        <div>
          <div className="relative">
            <Input
              type="number"
              min="0"
              placeholder="0.00"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-9 text-sm pr-12 font-body bg-background border-border focus:border-accent focus:ring-accent/20"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-body">
              {weightUnit}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs font-body">
            <span className="text-foreground font-semibold">Rate: {fmt(ratePerUnit)}/{rateCurrency}</span>
            <span className="text-foreground font-semibold">Value: {fmt(computedValue)}</span>
            {weight > 0 && <span className="text-green-800 dark:text-green-400 font-bold">Zakat: {fmt(computedValue * 0.025)}</span>}
          </div>
        </div>
      ) : (
        <div>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-body">$</span>
            <Input
              type="number"
              min="0"
              placeholder="0.00"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-9 text-sm pl-5 font-body bg-background border-border focus:border-accent focus:ring-accent/20"
            />
          </div>
          {weight > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs font-body">
              <span className="text-green-800 dark:text-green-400 font-bold">Zakat: {fmt(weight * 0.025)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetInput;
