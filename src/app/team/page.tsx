import { User } from "lucide-react";

export default function TeamPage() {
    const teamMembers = [
        {
            name: "Bismark Antwi Gyawu",
            role: "CEO & Founder",
            image: "/team/bismark.jpg",
            bio: "The driving force behind EduPay's mission. Bismark is dedicated to revolutionizing education payments through technology and innovation.",
        },
        {
            name: "Graham Owusu Kyeremanteng",
            role: "CTO",
            image: "/team/graham.jpg",
            bio: "Leading the technological vision of EduPay. Graham oversees the development of secure, scalable, and innovative solutions that power our financial ecosystem.",
        },
        {
            name: "Isaac Nii Hammond",
            role: "Head of Product",
            image: "/team/isaac.jpg",
            bio: "Visionary product strategist with a passion for user-centric design. Isaac drives the roadmap for EduPay, ensuring every feature solves a real problem for students and schools.",
        },
        {
            name: "Mirinda Blankson",
            role: "Lead Engineer & Graphic Designer",
            image: "/team/mirinda.png",
            bio: "Architecting the robust and secure infrastructure that powers EduPay. Mirinda ensures our platform is scalable, reliable, and always available for our users.",
        },
        {
            name: "Maame Serwaa Asare",
            role: "Marketing Director",
            image: "/team/maame.jpg",
            bio: "The creative force behind EduPay's brand. Maame combines data-driven insights with compelling storytelling to connect students and institutions with financial freedom.",
        },
        {
            name: "Godwin",
            role: "Operations Manager",
            image: "/team/godwin.png",
            imagePosition: "object-top",
            bio: "Ensuring smooth day-to-day operations and optimizing internal processes. Godwin is the backbone of our team's efficiency and execution.",
        },
    ];

    return (
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Meet Our Team</h1>
                <p className="text-xl text-muted-foreground">
                    The passionate people behind EduPay.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                        <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center mb-6 overflow-hidden relative">
                            {member.image ? (
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className={`h-full w-full object-cover ${member.imagePosition || ""}`}
                                />
                            ) : (
                                <User className="h-16 w-16 text-muted-foreground" />
                            )}
                        </div>
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-primary font-medium mb-4">{member.role}</p>
                        <p className="text-muted-foreground text-sm">
                            {member.bio}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
