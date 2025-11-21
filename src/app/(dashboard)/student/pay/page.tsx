"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_FEES } from "@/lib/mock-data";
import { CreditCard, Smartphone, CheckCircle2, Loader2 } from "lucide-react";

export default function PaymentPage() {
    const [step, setStep] = useState(1);
    const [selectedFee, setSelectedFee] = useState(MOCK_FEES[0].id);
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<"momo" | "card">("momo");
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
        setStep(3);
    };

    const fee = MOCK_FEES.find((f) => f.id === selectedFee);

    return (
        <div className="space-y-6 max-w-xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Make a Payment</h1>
                <div className="text-sm text-muted-foreground">Step {step} of 3</div>
            </div>

            {step === 1 && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Fee to Pay</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {MOCK_FEES.map((f) => (
                                <div
                                    key={f.id}
                                    className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors ${selectedFee === f.id ? "border-primary bg-primary/5" : "hover:bg-accent"
                                        }`}
                                    onClick={() => setSelectedFee(f.id)}
                                >
                                    <div>
                                        <p className="font-medium">{f.name}</p>
                                        <p className="text-sm text-muted-foreground">Due: {f.dueDate}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">GHS {f.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Enter Amount</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">GHS</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background pl-12 py-2 text-lg font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Minimum payment: GHS 50.00
                            </p>
                        </CardContent>
                    </Card>

                    <button
                        onClick={() => setStep(2)}
                        disabled={!amount || Number(amount) < 50}
                        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
                    >
                        Continue to Payment
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div
                                className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${method === "momo" ? "border-primary bg-primary/5" : "hover:bg-accent"
                                    }`}
                                onClick={() => setMethod("momo")}
                            >
                                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                    <Smartphone className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Mobile Money</p>
                                    <p className="text-xs text-muted-foreground">MTN, Vodafone, AirtelTigo</p>
                                </div>
                                <div className="h-4 w-4 rounded-full border border-primary flex items-center justify-center">
                                    {method === "momo" && <div className="h-2 w-2 rounded-full bg-primary" />}
                                </div>
                            </div>

                            <div
                                className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${method === "card" ? "border-primary bg-primary/5" : "hover:bg-accent"
                                    }`}
                                onClick={() => setMethod("card")}
                            >
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Card Payment</p>
                                    <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                                </div>
                                <div className="h-4 w-4 rounded-full border border-primary flex items-center justify-center">
                                    {method === "card" && <div className="h-2 w-2 rounded-full bg-primary" />}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(1)}
                            className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm font-semibold shadow-sm hover:bg-accent"
                        >
                            Back
                        </button>
                        <button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                                </>
                            ) : (
                                `Pay GHS ${Number(amount).toLocaleString()}`
                            )}
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center animate-in fade-in zoom-in duration-500">
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Payment Successful!</h2>
                        <p className="text-muted-foreground">
                            Your payment of GHS {Number(amount).toLocaleString()} has been processed.
                        </p>
                    </div>
                    <div className="w-full max-w-xs space-y-3">
                        <button className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
                            Download Receipt
                        </button>
                        <button
                            onClick={() => setStep(1)}
                            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm font-semibold shadow-sm hover:bg-accent"
                        >
                            Make Another Payment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
