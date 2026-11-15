"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  History,
  ShieldCheck,
  Smartphone,
  Wallet,
  XCircle,
} from "lucide-react"

type Plan = {
  id: string
  name: string
  description: string
  price: number
  duration: string
  features: string[]
  popular?: boolean
}

type PaymentMethod = "card" | "bkash" | "nagad" | "bank"

type Transaction = {
  id: string
  plan: string
  amount: number
  method: PaymentMethod
  status: "success" | "failed"
  date: string
  customerName: string
  email: string
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For recruiters getting started.",
    price: 499,
    duration: "month",
    features: [
      "5 active job postings",
      "View applicants",
      "Basic applicant management",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing recruitment teams.",
    price: 999,
    duration: "month",
    popular: true,
    features: [
      "20 active job postings",
      "Unlimited applicant viewing",
      "Advanced applicant management",
      "Priority support",
      "Featured job listings",
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "For established organizations.",
    price: 1999,
    duration: "month",
    features: [
      "Unlimited job postings",
      "Advanced recruitment tools",
      "Priority job listings",
      "Dedicated support",
      "Premium analytics",
    ],
  },
]

const paymentMethods: {
  id: PaymentMethod
  name: string
  description: string
  icon: typeof CreditCard
}[] = [
  {
    id: "card",
    name: "Credit / Debit Card",
    description: "Demo card payment",
    icon: CreditCard,
  },
  {
    id: "bkash",
    name: "bKash",
    description: "Demo mobile payment",
    icon: Smartphone,
  },
  {
    id: "nagad",
    name: "Nagad",
    description: "Demo mobile payment",
    icon: Wallet,
  },
  {
    id: "bank",
    name: "Bank Transfer",
    description: "Demo bank payment",
    icon: ShieldCheck,
  },
]

const STORAGE_KEY = "hireloop_demo_transactions"

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount)

const Payment = () => {
  const [selectedPlan, setSelectedPlan] = useState("professional")
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card")

  const [customerName, setCustomerName] = useState("")
  const [email, setEmail] = useState("")

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<
    "success" | "failed" | null
  >(null)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(
    null
  )

  const [demoOutcome, setDemoOutcome] = useState<"success" | "failed">(
    "success"
  )

  const selectedPlanData = useMemo(
    () => plans.find((plan) => plan.id === selectedPlan) ?? plans[1],
    [selectedPlan]
  )

  const subtotal = selectedPlanData.price
  const tax = 0
  const total = subtotal + tax

  // Load transaction history
  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem(STORAGE_KEY)

      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions))
      }
    } catch (error) {
      console.error("Failed to load payment history:", error)
    }
  }, [])

  const handlePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!customerName.trim() || !email.trim()) {
      return
    }

    setIsProcessing(true)
    setPaymentResult(null)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1800))

    const transaction: Transaction = {
      id: `HL-${Date.now()}`,
      plan: selectedPlanData.name,
      amount: total,
      method: selectedMethod,
      status: demoOutcome,
      date: new Date().toISOString(),
      customerName: customerName.trim(),
      email: email.trim(),
    }

    const updatedTransactions = [transaction, ...transactions]

    setTransactions(updatedTransactions)
    setLastTransaction(transaction)
    setPaymentResult(demoOutcome)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions))
    } catch (error) {
      console.error("Failed to save transaction:", error)
    }

    setIsProcessing(false)
  }

  const downloadReceipt = () => {
    if (!lastTransaction) return

    const receipt = `
HIRELOOP - PAYMENT RECEIPT
--------------------------------
Transaction ID: ${lastTransaction.id}
Customer: ${lastTransaction.customerName}
Email: ${lastTransaction.email}
Subscription: ${lastTransaction.plan}
Payment Method: ${lastTransaction.method.toUpperCase()}
Amount: ${formatPrice(lastTransaction.amount)}
Status: ${lastTransaction.status.toUpperCase()}
Date: ${new Date(lastTransaction.date).toLocaleString()}
--------------------------------
This is a demo transaction.
No real payment was processed.
`

    const blob = new Blob([receipt], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = `HireLoop-Receipt-${lastTransaction.id}.txt`
    link.click()

    URL.revokeObjectURL(url)
  }

  const resetPayment = () => {
    setPaymentResult(null)
    setLastTransaction(null)
  }

  const methodName = (method: PaymentMethod) =>
    paymentMethods.find((item) => item.id === method)?.name ?? method

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <CreditCard className="size-4" />
          HireLoop Billing
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Subscription & Payment
        </h1>

        <p className="max-w-2xl text-sm text-muted-foreground">
          Choose a subscription plan and manage your recruiter billing. This
          page uses simulated payments for demonstration purposes.
        </p>
      </div>

      {/* Demo Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-500" />

        <div>
          <p className="text-sm font-semibold">Demo payment environment</p>
          <p className="mt-1 text-xs text-muted-foreground">
            No real money will be charged. You can simulate successful and
            failed transactions to test the payment workflow.
          </p>
        </div>
      </div>

      {/* Payment Result */}
      {paymentResult && lastTransaction && (
        <div
          className={`rounded-xl border p-6 ${
            paymentResult === "success"
              ? "border-green-500/30 bg-green-500/5"
              : "border-red-500/30 bg-red-500/5"
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              {paymentResult === "success" ? (
                <CheckCircle2 className="size-8 shrink-0 text-green-500" />
              ) : (
                <XCircle className="size-8 shrink-0 text-red-500" />
              )}

              <div>
                <h2 className="text-lg font-bold">
                  {paymentResult === "success"
                    ? "Payment Successful!"
                    : "Payment Failed"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {paymentResult === "success"
                    ? "Your demo transaction has been completed successfully."
                    : "Your demo transaction was unsuccessful. No money was charged."}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Transaction ID: {lastTransaction.id}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={downloadReceipt}
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                <Download className="size-4" />
                Receipt
              </button>

              <button
                type="button"
                onClick={resetPayment}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                New Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plans */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Choose Your Plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select the subscription that suits your recruitment needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => {
                  setSelectedPlan(plan.id)
                  resetPayment()
                }}
                className={`relative flex flex-col rounded-xl border p-5 text-left transition ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{plan.name}</h3>

                  {isSelected && (
                    <CheckCircle2 className="size-5 text-primary" />
                  )}
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <div className="my-5">
                  <span className="text-3xl font-bold">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {" "}
                    / month
                  </span>
                </div>

                <div className="space-y-3 border-t pt-4">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="size-4 shrink-0 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <span
                    className={`block rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "border bg-background"
                    }`}
                  >
                    {isSelected ? "Selected Plan" : "Choose Plan"}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Checkout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Payment Form */}
        <section className="space-y-6 rounded-xl border bg-card p-5 sm:p-6 lg:col-span-2">
          <div>
            <h2 className="text-xl font-semibold">Payment Information</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your billing details to continue.
            </p>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Billing Information</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="customerName"
                    className="mb-2 block text-sm font-medium"
                  >
                    Full Name
                  </label>

                  <input
                    id="customerName"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Select Payment Method</h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  const isSelected = selectedMethod === method.id

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:border-primary/50"
                      }`}
                    >
                      <div className="rounded-lg bg-muted p-2">
                        <Icon className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{method.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {method.description}
                        </p>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="size-5 text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Demo Outcome */}
            <div className="space-y-3 rounded-lg border border-dashed p-4">
              <h3 className="text-sm font-semibold">Demo Transaction Result</h3>

              <p className="text-xs text-muted-foreground">
                Choose the outcome you want to simulate.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDemoOutcome("success")}
                  className={`rounded-lg border p-3 text-sm font-medium transition ${
                    demoOutcome === "success"
                      ? "border-green-500 bg-green-500/10 text-green-600"
                      : "hover:bg-muted"
                  }`}
                >
                  <CheckCircle2 className="mx-auto mb-2 size-5" />
                  Successful
                </button>

                <button
                  type="button"
                  onClick={() => setDemoOutcome("failed")}
                  className={`rounded-lg border p-3 text-sm font-medium transition ${
                    demoOutcome === "failed"
                      ? "border-red-500 bg-red-500/10 text-red-600"
                      : "hover:bg-muted"
                  }`}
                >
                  <XCircle className="mx-auto mb-2 size-5" />
                  Failed
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isProcessing || Boolean(paymentResult)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Clock className="size-4 animate-spin" />
                  Processing Demo Payment...
                </>
              ) : (
                <>
                  Pay {formatPrice(total)}
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
              <ShieldCheck className="size-4" />
              Demo environment — no real payment information required.
            </p>
          </form>
        </section>

        {/* Order Summary */}
        <aside className="h-fit space-y-5 rounded-xl border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">
              Selected Subscription
            </p>

            <h3 className="mt-1 text-lg font-bold">
              {selectedPlanData.name} Plan
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">Billed monthly</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Subscription</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between gap-3">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Payment Method</p>
            <p className="text-sm font-semibold">
              {methodName(selectedMethod)}
            </p>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            Your subscription is simulated for demonstration. No actual
            subscription or payment is created.
          </div>
        </aside>
      </div>

      {/* Transaction History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <History className="size-5" />
              Transaction History
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your locally saved demo payment records.
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {transactions.length} Transactions
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border">
          {transactions.length > 0 ? (
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-medium">Transaction ID</th>
                  <th className="px-5 py-4 font-medium">Plan</th>
                  <th className="px-5 py-4 font-medium">Payment Method</th>
                  <th className="px-5 py-4 font-medium">Amount</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-5 py-4 font-medium">{transaction.id}</td>

                    <td className="px-5 py-4">{transaction.plan}</td>

                    <td className="px-5 py-4">
                      {methodName(transaction.method)}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {formatPrice(transaction.amount)}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          transaction.status === "success"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <History className="size-7 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">No transactions yet</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Your payment history will appear here after your first demo
                transaction.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Payment
