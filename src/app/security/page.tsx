import { Shield, Lock, Server } from "lucide-react";

export default function SecurityPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <h1 className="text-4xl font-bold tracking-tight text-center mb-12">Security at EduPay</h1>

            <div className="max-w-3xl mx-auto space-y-12">
                <div className="flex gap-6">
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Lock className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Bank-Grade Encryption</h2>
                        <p className="text-muted-foreground">
                            We use industry-standard 256-bit AES encryption to protect your data in transit and at rest. Your financial information is never stored in plain text.
                        </p>
                    </div>
                </div>

                <div className="flex gap-6">
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Shield className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Verified Institutions</h2>
                        <p className="text-muted-foreground">
                            Every school and university on our platform undergoes a rigorous verification process. You can be confident that your payments are going to the legitimate institution.
                        </p>
                    </div>
                </div>

                <div className="flex gap-6">
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Server className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Secure Infrastructure</h2>
                        <p className="text-muted-foreground">
                            Our systems are hosted in secure data centers with 24/7 monitoring. We perform regular security audits and penetration testing to ensure our defenses are always up to date.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
