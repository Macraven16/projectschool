import { ShieldCheck, Wallet, GraduationCap } from "lucide-react";

export default function FeaturesPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <h1 className="text-4xl font-bold tracking-tight text-center mb-12">Our Features</h1>
            <div className="grid gap-12 md:grid-cols-3">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Verified Payments</h2>
                    <p className="text-muted-foreground">
                        Pay directly to verified school accounts. Eliminate fraud and ensure your fees reach the right destination instantly. We partner directly with educational institutions to guarantee secure transactions.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Wallet className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Digital Wallet</h2>
                    <p className="text-muted-foreground">
                        Manage cafeteria, hostel, and bookstore payments from one secure wallet. Top up easily via Mobile Money or Card. Keep track of all your daily campus expenses in one place.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <GraduationCap className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Financial Planning</h2>
                    <p className="text-muted-foreground">
                        Track tuition, set savings goals, and pay in flexible installments. Stay on top of your education finances with our smart budgeting tools designed specifically for students.
                    </p>
                </div>
            </div>
        </div>
    );
}
