export default function LegalPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <h1 className="text-4xl font-bold tracking-tight text-center mb-12">Legal Information</h1>

            <div className="max-w-3xl mx-auto space-y-8 text-muted-foreground">
                <p>
                    EduPay is a product of Raventech, a company registered in Ghana. We are committed to operating with transparency and integrity.
                </p>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Intellectual Property</h2>
                    <p>
                        All content, trademarks, and data on this website, including but not limited to software, text, graphics, logos, icons, images, audio clips, digital downloads, and data compilations, are the property of Raventech or its content suppliers and are protected by international copyright laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Compliance</h2>
                    <p>
                        We adhere to all applicable financial regulations and data protection laws in the jurisdictions where we operate. Our payment processing partners are fully licensed and regulated.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Dispute Resolution</h2>
                    <p>
                        Any disputes arising out of or in connection with the use of our services shall be resolved through amicable negotiations. If a settlement cannot be reached, the dispute shall be submitted to arbitration in accordance with the laws of Ghana.
                    </p>
                </section>
            </div>
        </div>
    );
}
