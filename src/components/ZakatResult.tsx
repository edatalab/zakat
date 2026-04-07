import { motion, AnimatePresence } from "framer-motion";

interface ZakatResultProps {
  totalAssets: number;
  totalLiabilities: number;
  nisab: number;
  zakatDue: number;
  isEligible: boolean;
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const ZakatResult = ({ totalAssets, totalLiabilities, nisab, zakatDue, isEligible }: ZakatResultProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="rounded-xl border border-accent/30 bg-gradient-to-br from-card to-secondary p-4 md:p-5"
  >
    <h2 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
      <span className="text-accent">◆</span> Your Zakat Summary
    </h2>

    <div className="space-y-1.5 mb-4">
      <Row label="Total Assets" value={fmt(totalAssets)} />
      <Row label="Total Liabilities" value={`- ${fmt(totalLiabilities)}`} />
      <div className="border-t border-border my-2" />
      <Row label="Net Zakatable Wealth" value={fmt(totalAssets - totalLiabilities)} bold />
      <Row label="Nisab Threshold (Silver)" value={fmt(nisab)} />
    </div>

    <AnimatePresence mode="wait">
      <motion.div
        key={isEligible ? "due" : "not-due"}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`rounded-lg p-4 text-center ${
          isEligible
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        {isEligible ? (
          <>
            <p className="text-sm font-body opacity-80 mb-1">Zakat Due (2.5%)</p>
            <p className="text-2xl font-display font-bold">{fmt(zakatDue)}</p>
          </>
        ) : (
          <>
            <p className="text-sm font-body opacity-80 mb-1">Your wealth is below Nisab</p>
            <p className="text-xl font-display font-semibold">No Zakat Due</p>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  </motion.div>
);

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className="flex justify-between items-center">
    <span className={`text-sm font-body ${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
      {label}
    </span>
    <span className={`text-sm font-body ${bold ? "font-bold text-foreground" : "text-foreground"}`}>
      {value}
    </span>
  </div>
);

export default ZakatResult;
