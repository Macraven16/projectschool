"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MessageCircle, FileQuestion } from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
    const [openItem, setOpenItem] = useState<string | null>(null);

    const faqs = [
        {
            id: "item-1",
            question: "How do I pay my school fees?",
            answer: "You can pay your fees by navigating to the 'Pay Fees' section from the dashboard. We support Mobile Money and Card payments."
        },
        {
            id: "item-2",
            question: "How long does it take for my payment to reflect?",
            answer: "Payments are processed instantly. Your dashboard balance should update immediately after a successful transaction."
        },
        {
            id: "item-3",
            question: "Can I pay in installments?",
            answer: "Yes, you can choose to pay a partial amount. However, you must clear your balance before the semester deadline."
        },
        {
            id: "item-4",
            question: "What if my payment fails?",
            answer: "If your payment fails, please check your mobile money or bank balance. If the issue persists, contact our support team."
        }
    ];

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
                <p className="text-muted-foreground">Find answers to common questions or contact our support team.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* FAQs */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileQuestion className="h-5 w-5 text-primary" />
                            Frequently Asked Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="border rounded-lg p-4">
                                <button
                                    onClick={() => setOpenItem(openItem === faq.id ? null : faq.id)}
                                    className="flex w-full items-center justify-between font-medium text-left"
                                >
                                    {faq.question}
                                    <span className="text-muted-foreground text-xl">
                                        {openItem === faq.id ? "−" : "+"}
                                    </span>
                                </button>
                                {openItem === faq.id && (
                                    <div className="mt-3 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-200">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Contact Support */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-primary" />
                            Contact Support
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">Call Us</p>
                                <p className="text-sm text-muted-foreground">+233 50 465 4589</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">Email Us</p>
                                <p className="text-sm text-muted-foreground">support@edupay.com.gh</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Send Message Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Send us a message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Subject</label>
                                <input type="text" className="w-full p-2 border rounded-md bg-background" placeholder="Payment Issue" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Message</label>
                                <textarea className="w-full p-2 border rounded-md bg-background min-h-[100px]" placeholder="Describe your issue..." />
                            </div>
                            <button className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90">
                                Send Message
                            </button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
