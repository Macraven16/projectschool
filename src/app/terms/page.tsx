export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <h1 className="text-4xl font-bold tracking-tight text-center mb-12">Terms of Service</h1>

            <div className="max-w-3xl mx-auto space-y-8 text-muted-foreground">
                <p>
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using the EduPay platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
                    <p>
                        EduPay provides a financial platform for educational institutions and students, facilitating fee payments, digital wallet services, and financial planning tools.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">4. Payments and Fees</h2>
                    <p>
                        All payments made through EduPay are subject to processing fees as outlined in our Pricing page. We reserve the right to change our fees at any time with prior notice.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">5. Limitation of Liability</h2>
                    <p>
                        EduPay shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>
                </section>
            </div>
        </div>
    );
}
