export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <h1 className="text-4xl font-bold tracking-tight text-center mb-12">Privacy Policy</h1>

            <div className="max-w-3xl mx-auto space-y-8 text-muted-foreground">
                <p>
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, make a payment, or contact support. This may include your name, email address, phone number, and payment information.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you technical notices and support messages, and to communicate with you about products, services, and events.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">3. Information Sharing</h2>
                    <p>
                        We do not share your personal information with third parties except as described in this policy. We may share your information with third-party service providers who perform services on our behalf, such as payment processing and data analysis.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
                    <p>
                        We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or delete your personal information. You may also have the right to object to or restrict certain processing of your information.
                    </p>
                </section>
            </div>
        </div>
    );
}
