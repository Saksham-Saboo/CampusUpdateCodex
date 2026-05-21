import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, IndianRupee } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));

export function EmiCalculator() {
  const [amount, setAmount] = useState(1500000); // ₹15L
  const [rate, setRate] = useState(10.5); // %
  const [years, setYears] = useState(7);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const P = amount;
    const r = rate / 12 / 100;
    const n = years * 12;
    if (P <= 0 || r <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };
    const e = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = e * n;
    return { emi: e, totalInterest: total - P, totalPayment: total };
  }, [amount, rate, years]);

  const principalPct = totalPayment > 0 ? (amount / totalPayment) * 100 : 0;

  return (
    <section className="bg-muted/40 border-y">
      <div className="max-w-[1180px] mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-primary-soft text-primary px-3 py-1.5 rounded-full text-xs font-semibold mb-3">
            <Calculator className="w-3.5 h-3.5" /> EMI CALCULATOR
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Plan Your Monthly EMI</h2>
          <p className="text-ink-3">Estimate your education loan repayment before you apply</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 bg-card border rounded-2xl p-6 md:p-8 shadow-pop">
          {/* Inputs */}
          <div className="space-y-7">
            <SliderField
              label="Loan Amount"
              value={amount}
              onChange={setAmount}
              min={50000}
              max={7500000}
              step={50000}
              format={(v) => `₹ ${fmt(v)}`}
            />
            <SliderField
              label="Interest Rate (p.a.)"
              value={rate}
              onChange={setRate}
              min={7}
              max={16}
              step={0.1}
              format={(v) => `${v.toFixed(1)} %`}
            />
            <SliderField
              label="Tenure (Years)"
              value={years}
              onChange={setYears}
              min={1}
              max={15}
              step={1}
              format={(v) => `${v} ${v === 1 ? "year" : "years"}`}
            />
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-primary-soft/60 to-accent-soft/40 rounded-xl p-6 flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="text-xs font-semibold text-ink-3 uppercase tracking-wide mb-1">Monthly EMI</div>
              <div className="font-display text-4xl md:text-5xl font-extrabold text-primary flex items-center justify-center gap-1">
                <IndianRupee className="w-7 h-7" /> {fmt(emi)}
              </div>
            </div>

            <div className="h-2.5 w-full rounded-full bg-card overflow-hidden flex mb-4">
              <div className="bg-primary h-full" style={{ width: `${principalPct}%` }} />
              <div className="bg-accent h-full" style={{ width: `${100 - principalPct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-ink-3 mb-5">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> Principal</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" /> Interest</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat label="Principal" value={`₹${fmt(amount)}`} />
              <Stat label="Interest" value={`₹${fmt(totalInterest)}`} />
              <Stat label="Total" value={`₹${fmt(totalPayment)}`} />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-ink-3 text-center mt-4">
          *Indicative figures. Actual EMI varies by bank, moratorium period and processing fees.
        </p>
      </div>
    </section>
  );
}

function SliderField({
  label, value, onChange, min, max, step, format,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-semibold text-ink-2">{label}</Label>
        <Input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
          className="h-9 w-32 text-right font-semibold"
        />
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
      />
      <div className="flex justify-between text-[11px] text-ink-3 mt-1.5">
        <span>{format(min)}</span>
        <span className="text-primary font-semibold">{format(value)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card/80 rounded-lg p-2.5">
      <div className="text-[10px] uppercase tracking-wide text-ink-3 font-semibold">{label}</div>
      <div className="font-display font-bold text-sm mt-0.5">{value}</div>
    </div>
  );
}
