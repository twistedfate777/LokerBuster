import meta from "../assets/meta.png"
import google from "../assets/google.png"
import netflix from "../assets/netflix.jpg"
import amazon from "../assets/amazon.png"
import stripe from "../assets/stripe.png"

export const jobs = [
  {
    company: "Meta",
    imageUrl: meta,
    title: "Software Engineer",
    desc: "Develop and scale next-generation social platforms and VR experiences.",
    salary: "72.50",
    jobType: "Full-time",
    prerequisites: ["React", "Algorithms", "CS Degree"]
  },
  {
    company: "Google",
    imageUrl: google,
    title: "Senior Frontend Developer",
    desc: "Build intuitive user interfaces for global search and cloud infrastructure.",
    salary: "85.00",
    jobType: "Full-time",
    prerequisites: ["TypeScript", "Angular", "UX Design"]
  },
  {
    company: "Stripe",
    imageUrl: stripe,
    title: "Backend Engineer",
    desc: "Scale global financial systems and API architectures for modern commerce.",
    salary: "94.25",
    jobType: "Full-time",
    prerequisites: ["Ruby", "Go", "Architecture"]
  },
  {
    company: "Amazon",
    imageUrl: amazon,
    title: "Product Designer",
    desc: "Create seamless end-to-end travel experiences for a global community.",
    salary: "78.00",
    jobType: "Contract",
    prerequisites: ["Figma", "UX Research", "UI Design"]
  },
  {
    company: "Netflix",
    imageUrl: netflix,
    title: "Cloud Architect",
    desc: "Optimize high-availability streaming services and content delivery networks.",
    salary: "112.50",
    jobType: "Full-time",
    prerequisites: ["AWS", "Java", "Spring Boot"]
  }
];


export const works = [
  {
    id: 2, 
    title: "INPUT JOB DATA", 

    description: "Paste the job application link and the job description. Providing the company name allows our AI to perform a deeper historical background check.",
    hover : 1
  },
  {
    id: 3, 
    title: "AI DEEP SCAN", 

    description: "Click 'Check Job'. Our AI instantly analyzes the metadata, company reputation, and recruitment patterns for common scam indicators.",
    hover : 2
  },
  {
    id: 4, 
    title: "SAFETY VERDICT", 

    description: "Receive a real-time Scam Score. We break down the red flags so you can decide whether to apply with confidence or stay away.",
    hover : 3
  },
]

export const faqData = [
  {
    id: 1,
    question: "Is this actually 100% accurate?",
    answer: "Nothing is 100% except the fact that scammers are getting smarter. We use AI to scan for red flags, NLP to detect linguistic traps, and a 'Scam Score' to give you the odds. If we say it's a 90% scam, you should probably stop replying."
  },
  {
    id: 3,
    question: "What if the job looks totally professional?",
    answer: "Professionalism is cheap. A stolen logo and a polished template cost $0. Our engine looks past the pretty fonts and checks the metadata, the domain age, and the 'too-good-to-be-true' patterns that bots use."
  },
  {
    id: 4,
    question: "Do you save my personal data?",
    answer: "No. That's the scammers' job. We just need the job description or the link to tell you if you're being hunted."
  },
  {
    id: 5,
    question: "Can I report a scam I already found?",
    answer: "Absolutely. Help us feed the algorithm. Every scam you report helps protect someone else from falling into the same trap. Think of it as digital karma."
  },
  {
    id: 6,
    question: "It says the job is 'Safe,' so I'm good, right?",
    answer: "'Safe' means we didn't find any known red flags. It doesn't mean you should send them your social security number on day one. Always stay skeptical."
  },
  {
    id: 7,
    question: "Is this service free?",
    answer: "Yes. Getting scammed is expensive enough. We'd rather you keep your money than hand it over to a bot in a basement."
  }
];