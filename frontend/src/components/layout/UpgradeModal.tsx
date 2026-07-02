"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Check,
  Lock,
  CreditCard,
  ArrowLeft,
  Sparkles,
  Loader2,
  X,
  ShieldCheck,
} from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";

interface PlanOption {
  id: "STARTER" | "PRO" | "AGENCY";
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
}

const plans: PlanOption[] = [
  {
    id: "STARTER",
    name: "Starter",
    price: "$29",
    period: "month",
    description: "Essential tools for solo freelancers starting their client acquisition journey.",
    features: [
      "100 lead finder credits / mo",
      "AI Copywriter for emails",
      "Standard WhatsApp outreach templates",
      "Single email campaign flow",
      "Local browser storage database",
    ],
    color: "from-blue-400 to-indigo-500",
  },
  {
    id: "PRO",
    name: "Pro",
    price: "$79",
    period: "month",
    description: "The complete AI Freelancer OS. Maximum automation for scaling your work.",
    features: [
      "Unlimited AI lead credits",
      "Deep web lead scraping & enrichment",
      "Advanced AI Proposal Studio",
      "Automated follow-up campaigns",
      "Integrated Response Tracker",
      "Priority AI Response Streaming",
    ],
    popular: true,
    color: "from-blue-600 to-violet-600",
  },
  {
    id: "AGENCY",
    name: "Agency",
    price: "$149",
    period: "month",
    description: "High-volume, multi-seat features designed for boutique teams and agencies.",
    features: [
      "Everything in Pro",
      "Multi-seat team workspace sharing",
      "Custom email outreach domains",
      "API access & webhooks integrations",
      "Dedicated account manager",
      "SLA-backed priority assistance",
    ],
    color: "from-violet-600 to-pink-600",
  },
];

export function UpgradeModal() {
  const { upgradeModalOpen, setUpgradeModalOpen, setUserPlan, addNotification } = useUIStore();
  const [step, setStep] = useState<"plans" | "card" | "processing" | "success">("plans");
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(plans[1]); // Default to Pro

  // Card details state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Loading phase messages
  const [processMessage, setProcessMessage] = useState("Connecting to secure checkout...");

  useEffect(() => {
    if (step === "processing") {
      const timers = [
        setTimeout(() => setProcessMessage("Validating mock payment details..."), 1000),
        setTimeout(() => setProcessMessage("Activating workspace licenses..."), 2000),
        setTimeout(() => {
          // Upgrade plan
          setUserPlan(selectedPlan.id);
          // Notify
          addNotification({
            id: `upg_${Date.now()}`,
            title: "Upgrade Successful! 🎉",
            description: `You are now subscribed to the ${selectedPlan.name} plan.`,
            type: "lead_saved", // Maps to Green icon
            time: "Just now",
            read: false,
          });
          setStep("success");
        }, 3200),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [step, selectedPlan, setUserPlan, addNotification]);

  if (!upgradeModalOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    let matches = value.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || "";
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const validateAndSubmit = () => {
    const errs: { [key: string]: string } = {};
    if (!cardName.trim()) errs.cardName = "Required";
    if (cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Invalid card number";
    if (cardExpiry.length < 5) errs.cardExpiry = "MM/YY";
    if (cardCvc.length < 3) errs.cardCvc = "CVC";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
    } else {
      setErrors({});
      setStep("processing");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setUpgradeModalOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
      />

      {/* Modal Dialog container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative z-10 w-full max-w-5xl rounded-2xl border border-[var(--border)] bg-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
            <h3 className="font-bold text-lg text-[var(--text-primary)]">
              {step === "plans" && "Upgrade Workspace Plan"}
              {step === "card" && `Checkout — ${selectedPlan.name} Plan`}
              {step === "processing" && "Processing Payment"}
              {step === "success" && "Subscription Activated!"}
            </h3>
          </div>
          {step !== "processing" && (
            <button
              onClick={() => setUpgradeModalOpen(false)}
              className="rounded-lg p-1 hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--surface)]">
          <AnimatePresence mode="wait">
            {step === "plans" && (
              <motion.div
                key="plans"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {plans.map((p) => (
                  <div
                    key={p.id}
                    className={`relative flex flex-col rounded-2xl bg-white border p-6 shadow-sm transition-all hover:shadow-md ${
                      p.popular ? "border-indigo-500 ring-1 ring-indigo-500" : "border-[var(--border)]"
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-3.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow">
                        Most Popular
                      </span>
                    )}

                    <div className="mb-4">
                      <h4 className="font-bold text-lg text-[var(--text-primary)]">{p.name}</h4>
                      <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed min-h-[40px]">{p.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-extrabold text-[var(--text-primary)]">{p.price}</span>
                      <span className="text-sm text-[var(--text-muted)]">/{p.period}</span>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1 text-sm text-[var(--text-secondary)]">
                      {p.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => {
                        setSelectedPlan(p);
                        setStep("card");
                      }}
                      className={`w-full rounded-xl py-3 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 ${
                        p.popular
                          ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow hover:opacity-95"
                          : "border border-[var(--border)] bg-white text-[var(--text-secondary)] hover:bg-[var(--surface)]"
                      }`}
                    >
                      <Zap className="h-3.5 w-3.5" />
                      Select {p.name}
                    </button>
                  </div>
                ))}
              </motion.div>
            )}

            {step === "card" && (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm"
              >
                {/* Checkout Summary */}
                <div className="border-r border-[var(--border)] pr-6 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)] text-base mb-1">Order Summary</h4>
                    <p className="text-xs text-[var(--text-muted)]">Secure B2B Payment Powered by Stripe</p>

                    <div className="mt-6 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[var(--text-secondary)]">{selectedPlan.name} Plan (Monthly)</span>
                        <span className="font-semibold text-[var(--text-primary)]">{selectedPlan.price}/mo</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-t border-dashed border-[var(--border)] pt-3">
                        <span className="font-bold text-[var(--text-primary)]">Total Due Today</span>
                        <span className="font-bold text-lg text-indigo-600">{selectedPlan.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3.5 bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                      <span>Security & Guarantee</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      This is a secure simulation workspace. Card processing uses simulated sandboxes to authorize your mock plan. Cancel anytime in workspace settings.
                    </p>
                  </div>
                </div>

                {/* Credit Card Inputs */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                        Cardholder Name
                      </label>
                      <input
                        placeholder="Alex Chen"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className={`rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent-blue)] bg-[var(--surface)] transition-all ${
                          errors.cardName ? "border-red-500" : "border-[var(--border)]"
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                        Card Number
                      </label>
                      <div className="relative flex items-center">
                        <input
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent-blue)] bg-[var(--surface)] transition-all ${
                            errors.cardNumber ? "border-red-500" : "border-[var(--border)]"
                          }`}
                        />
                        <CreditCard className="absolute left-3.5 h-4 w-4 text-[var(--text-muted)]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                          Expiry
                        </label>
                        <input
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          className={`rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent-blue)] bg-[var(--surface)] text-center transition-all ${
                            errors.cardExpiry ? "border-red-500" : "border-[var(--border)]"
                          }`}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                          CVC
                        </label>
                        <input
                          placeholder="123"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ""))}
                          className={`rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent-blue)] bg-[var(--surface)] text-center transition-all ${
                            errors.cardCvc ? "border-red-500" : "border-[var(--border)]"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6 border-t border-[var(--border)] pt-4">
                    <button
                      onClick={() => setStep("plans")}
                      className="flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2 px-1"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Back
                    </button>
                    <button
                      onClick={validateAndSubmit}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-3 text-sm font-semibold text-white shadow hover:opacity-95 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      Pay & Upgrade
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto text-center py-12 flex flex-col items-center gap-6"
              >
                <div className="relative flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full border-2 border-indigo-100 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-[var(--text-primary)] text-base">Processing Transaction</h4>
                  <p className="text-xs text-[var(--text-muted)] animate-pulse">{processMessage}</p>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto text-center py-12 flex flex-col items-center gap-6 bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm relative overflow-hidden"
              >
                {/* Custom particle confetti effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(30)].map((_, i) => {
                    const size = Math.random() * 6 + 4;
                    const delay = Math.random() * 0.8;
                    const rotate = Math.random() * 360;
                    const color = ["bg-blue-400", "bg-indigo-400", "bg-violet-400", "bg-pink-400", "bg-emerald-400"][
                      Math.floor(Math.random() * 5)
                    ];
                    return (
                      <motion.div
                        key={i}
                        className={`absolute rounded-full ${color}`}
                        style={{
                          width: size,
                          height: size,
                          left: `${Math.random() * 100}%`,
                          top: `100%`,
                        }}
                        animate={{
                          y: [0, -320 - Math.random() * 150],
                          x: [0, (Math.random() - 0.5) * 200],
                          scale: [0, 1.2, 0.8, 0],
                          rotate: [0, rotate + 180],
                        }}
                        transition={{
                          duration: 1.5 + Math.random() * 1.5,
                          delay: delay,
                          ease: "easeOut",
                          repeat: Infinity,
                          repeatDelay: Math.random() * 2,
                        }}
                      />
                    );
                  })}
                </div>

                <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-inner">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <div className="space-y-2 relative z-10">
                  <h4 className="font-extrabold text-xl text-[var(--text-primary)]">You are on the {selectedPlan.name} Plan!</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-sm">
                    Thank you for upgrading! Your subscription is active, and your workspace now has full access to premium resources.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setUpgradeModalOpen(false);
                    // Reset modal steps for next time
                    setTimeout(() => setStep("plans"), 500);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-3 text-sm font-semibold text-white shadow hover:opacity-95 transition-all hover:scale-[1.01] active:scale-[0.99] relative z-10"
                >
                  Go to Dashboard
                  <Sparkles className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
