import { Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Join Our Team</h1>
                <p className="text-xl text-muted-foreground">
                    We are open to accept people to work. Help us build the future of education technology.
                </p>
            </div>

            <div className="grid gap-8 max-w-4xl mx-auto">
                <div className="rounded-2xl border bg-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold">Software Engineer</h3>
                        <p className="text-muted-foreground mt-1">Remote / Hybrid • Full-time</p>
                    </div>
                    <Link href="/contact" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>

                <div className="rounded-2xl border bg-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold">Product Designer</h3>
                        <p className="text-muted-foreground mt-1">Remote • Full-time</p>
                    </div>
                    <Link href="/contact" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>

                <div className="rounded-2xl border bg-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold">Sales Representative</h3>
                        <p className="text-muted-foreground mt-1">On-site • Full-time</p>
                    </div>
                    <Link href="/contact" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>

            <div className="mt-16 text-center">
                <p className="text-muted-foreground">
                    Don't see a role that fits? We're always looking for talent.
                    <br />
                    Send your resume to <a href="mailto:gyawu0001@gmail.com" className="text-primary hover:underline">gyawu0001@gmail.com</a>
                </p>
            </div>
        </div>
    );
}
