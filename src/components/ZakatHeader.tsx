import { motion } from "framer-motion";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

interface ZakatHeaderProps {
  zakatDue?: number;
  isEligible?: boolean;
}

const ZakatHeader = ({ zakatDue = 0, isEligible = false }: ZakatHeaderProps) => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center py-4 px-4"
  >
    <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-0.5">
      Zakat Calculator
    </h1>
    <p className="text-[10px] font-body tracking-widest uppercase text-accent mb-1.5">BY 4YMTA.org</p>
    <p className="text-muted-foreground font-body text-xs max-w-lg mx-auto leading-relaxed mb-2">
      Enter your assets below to compute the 2.5% Zakat due above Nisab.
    </p>
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-block rounded-md bg-primary text-primary-foreground px-4 py-2"
    >
      <p className="text-[9px] font-body opacity-80">Total Zakat Due (2.5%)</p>
      <p className="text-lg font-display font-bold">{fmt(zakatDue)}</p>
    </motion.div>
  </motion.header>
);

export default ZakatHeader;
