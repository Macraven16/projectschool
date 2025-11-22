import { Code2, BrainCircuit, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">About Raventech</h1>
                <p className="text-xl text-muted-foreground">
                    Innovating at the intersection of Software Development and Machine Learning.
                </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 mb-16">
                <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border bg-card">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Code2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Software Development</h3>
                    <p className="text-muted-foreground">
                        Building robust, scalable, and user-centric applications that solve real-world problems.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border bg-card">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Machine Learning</h3>
                    <p className="text-muted-foreground">
                        Leveraging the power of AI to create intelligent systems that adapt and learn.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border bg-card">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Our Team</h3>
                    <p className="text-muted-foreground">
                        A dedicated team of engineers, designers, and data scientists passionate about technology.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                    At Raventech, we believe in the transformative power of technology. Our mission is to empower educational institutions and businesses with cutting-edge software solutions that streamline operations and enhance user experiences.
                </p>
                <p className="text-lg text-muted-foreground">
                    EduPay is our flagship product, designed to revolutionize how schools manage finances, making education more accessible and secure for everyone.
                </p>
            </div>
        </div>
    );
}
