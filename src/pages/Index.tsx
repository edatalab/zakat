import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import ZakatHeader from "@/components/ZakatHeader";
import AssetInput from "@/components/AssetInput";
import ZakatResult from "@/components/ZakatResult";
import { Coins, Landmark, Home, TrendingUp, Wallet, CreditCard, Banknote, Gem } from "lucide-react";

// Nisab based on silver standard
const NISAB_SILVER_GRAMS = 595;
const GOLD_PRICE_PER_GRAM = 95; // approximate USD
const GOLD_PRICE_PER_OUNCE = GOLD_PRICE_PER_GRAM * 31.1035; // troy ounce
const SILVER_PRICE_PER_GRAM = 2.5; // USD per gram
const SILVER_PRICE_PER_OUNCE = SILVER_PRICE_PER_GRAM * 31.1035; // gram to troy ounce
const NISAB = NISAB_SILVER_GRAMS * SILVER_PRICE_PER_GRAM;
const ZAKAT_RATE = 0.025;

const assetFields = [
  { key: "checking", label: "Amount in Checking Account", desc: "Checking and current account deposits", icon: <Wallet className="w-5 h-5" /> },
  { key: "savings", label: "Amount in Savings Account", desc: "Savings account balances", icon: <Landmark className="w-5 h-5" /> },
  { key: "cashInHand", label: "Cash in Hand", desc: "Physical cash you currently hold", icon: <Banknote className="w-5 h-5" /> },
  
  { key: "goldJewelry", label: "Weight of Gold Jewelry", desc: "Gold jewelry weight — valued at current gold price", icon: <Gem className="w-5 h-5" />, weightUnit: "grams", ratePerUnit: GOLD_PRICE_PER_GRAM, rateCurrency: "gram" },
  { key: "goldCoins", label: "Weight of Gold Coins", desc: "Gold coins weight — valued at current gold price", icon: <Coins className="w-5 h-5" />, weightUnit: "oz", ratePerUnit: GOLD_PRICE_PER_OUNCE, rateCurrency: "oz" },
  { key: "silverItems", label: "Weight of Silver Items (Ounces)", desc: "Silver items weight — valued at current silver price", icon: <Coins className="w-5 h-5" />, weightUnit: "oz", ratePerUnit: SILVER_PRICE_PER_OUNCE, rateCurrency: "oz" },
  { key: "silverGrams", label: "Weight of Silver Items (Grams)", desc: "Silver items weight in grams — valued at current silver price", icon: <Coins className="w-5 h-5" />, weightUnit: "grams", ratePerUnit: SILVER_PRICE_PER_GRAM, rateCurrency: "gram" },
  { key: "investments", label: "Investments & Stocks", desc: "Shares, mutual funds, and bonds", icon: <TrendingUp className="w-5 h-5" /> },
  
  { key: "business", label: "Business Assets", desc: "Inventory, receivables, and business cash", icon: <Landmark className="w-5 h-5" /> },
  { key: "rentalIncome", label: "Rental Income from Investment Properties", desc: "Accumulated rental income from investment properties", icon: <Home className="w-5 h-5" /> },
  { key: "iraPension", label: "Total IRA & Pension Funds", desc: "IRA, 401(k), pension, and other retirement account balances", icon: <Landmark className="w-5 h-5" /> },
];

const liabilityFields = [
  
  { key: "shortTermLoans", label: "Total Short-Term Loans, Credit Cards, etc.", desc: "Credit card balances, personal loans, and other short-term debts — do not include home loans", icon: <CreditCard className="w-5 h-5" /> },
];

const Index = () => {
  const [values, setValues] = useState<Record<string, string>>({});

  const update = (key: string) => (val: string) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const num = (key: string) => parseFloat(values[key] || "0") || 0;

  const { totalAssets, totalLiabilities, netWealth, isEligible, zakatDue } = useMemo(() => {
    const goldJewelryValue = num("goldJewelry") * GOLD_PRICE_PER_GRAM;
    const goldCoinsValue = num("goldCoins") * GOLD_PRICE_PER_OUNCE;
    const silverItemsValue = num("silverItems") * SILVER_PRICE_PER_OUNCE;
    const silverGramsValue = num("silverGrams") * SILVER_PRICE_PER_GRAM;
    const weightBasedKeys = ["goldJewelry", "goldCoins", "silverItems", "silverGrams"];
    const totalAssets = assetFields.reduce((s, f) => s + (weightBasedKeys.includes(f.key) ? 0 : num(f.key)), 0) + goldJewelryValue + goldCoinsValue + silverItemsValue + silverGramsValue;
    const totalLiabilities = liabilityFields.reduce((s, f) => s + num(f.key), 0);
    const netWealth = totalAssets - totalLiabilities;
    const isEligible = netWealth >= NISAB;
    const zakatDue = isEligible ? netWealth * ZAKAT_RATE : 0;
    return { totalAssets, totalLiabilities, netWealth, isEligible, zakatDue };
  }, [values]);

  return (
    <div className="min-h-screen geometric-pattern">
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <ZakatHeader zakatDue={zakatDue} isEligible={isEligible} />

        <div className="space-y-4">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="font-display text-base font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="text-green-600">Assets</span> <span className="text-muted-foreground">&</span> <span className="text-red-500">Deductions</span>
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {assetFields.map((f) => (
                <AssetInput
                  key={f.key}
                  label={f.label}
                  description={f.desc}
                  icon={f.icon}
                  value={values[f.key] || ""}
                  onChange={update(f.key)}
                  weightUnit={(f as any).weightUnit}
                  ratePerUnit={(f as any).ratePerUnit}
                  rateCurrency={(f as any).rateCurrency}
                  variant="asset"
                />
              ))}
              {liabilityFields.map((f) => (
                <AssetInput
                  key={f.key}
                  label={f.label}
                  description={f.desc}
                  icon={f.icon}
                  value={values[f.key] || ""}
                  onChange={update(f.key)}
                  variant="deduction"
                />
              ))}
            </div>
          </motion.section>

          {/* Result */}
          <ZakatResult
            totalAssets={totalAssets}
            totalLiabilities={totalLiabilities}
            nisab={NISAB}
            zakatDue={zakatDue}
            isEligible={isEligible}
          />

          <p className="text-center text-xs text-muted-foreground font-body">
            Nisab based on {NISAB_SILVER_GRAMS}g of silver at ~${SILVER_PRICE_PER_GRAM.toFixed(2)}/g.
            Consult a scholar for specific rulings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
