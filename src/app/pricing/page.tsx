import { Check } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <h1 className="text-4xl font-bold tracking-tight text-center mb-4">Simple, Transparent Pricing</h1>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Choose the plan that fits your needs. No hidden fees.
            </p>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                {/* Basic Plan */}
                <div className="rounded-2xl border bg-card p-8 shadow-sm">
                    <h3 className="text-xl font-semibold">Student Basic</h3>
                    <div className="mt-4 flex items-baseline text-3xl font-bold">
                        Free
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">For essential campus payments.</p>
                    <ul className="mt-6 space-y-3 text-sm">
                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Pay School Fees</li>
                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Basic Digital Wallet</li>
                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Transaction History</li>
                    </ul>
                </div>

                {/* Pro Plan */}
                <div className="rounded-2xl border border-primary bg-card p-8 shadow-md relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        Most Popular
                    </div>
                    <h3 className="text-xl font-semibold">Student Pro</h3>
                    <div className="mt-4 flex items-baseline text-3xl font-bold">
                        GHS 10<span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">For advanced financial tools.</p>
                    <ul className="mt-6 space-y-3 text-sm">
                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> All Basic Features</li>
                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Financial Planning Tools</li>
                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Savings Goals</li>
                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Priority Support</li>
                    </ul>
                </div>

                {/* Institution Plan */}
                <div className="rounded-2xl border bg-card p-8 shadow-sm">
                    <h3 className="text-xl font-semibold">Institution</h3>
                    <div className="mt-4 flex items-baseline text-3xl font-bold">
                        Custom
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">For schools and universities.</p>
                    <ul className="mt-6 space-y-3 text-sm">
                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Bulk Payment Processing</li>
                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Admin Dashboard</li>
                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> API Integration</li>
                        <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Dedicated Account Manager</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
