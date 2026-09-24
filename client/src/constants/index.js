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

    description: "Paste the job description or recruiter message, or upload a screenshot. A link by itself is not analyzed.",
    hover : 1
  },
  {
    id: 3, 
    title: "AI DEEP SCAN", 

    description: "Our AI reviews submitted text or OCR content for language patterns and common scam indicators. It does not independently check company records.",
    hover : 2
  },
  {
    id: 4, 
    title: "SAFETY VERDICT", 

    description: "Review a risk estimate and its supporting indicators. A lower score is not proof that a job or employer is legitimate.",
    hover : 3
  },
]

export const faqData = [
  {
    id: 1,
    question: "Is this actually 100% accurate?",
    answer: "No. The score is an AI-generated estimate based on the text or screenshot you submit. It can miss scams or flag legitimate offers, so verify employers through official channels."
  },
  {
    id: 3,
    question: "What if the job looks totally professional?",
    answer: "A polished design is not proof of legitimacy. LokerBuster reviews submitted text or OCR content for common scam indicators; it does not independently verify domains, company registries, or employer identity."
  },
  {
    id: 4,
    question: "Do you save my personal data?",
    answer: "Submitted text is stored with scan reports, and report data is available through the public community API. Screenshot uploads may also be sent to configured image storage. Do not submit personal or confidential information. The app currently has no per-report privacy or deletion control."
  },
  {
    id: 5,
    question: "Can I report a scam I already found?",
    answer: "You can submit job text or a screenshot for analysis. Scan reports are stored and may be publicly accessible, so remove personal or confidential details first."
  },
  {
    id: 6,
    question: "It says the job is 'Safe,' so I'm good, right?",
    answer: "No. A lower risk score only means the model found fewer indicators in the submitted content. Verify the employer independently and never share sensitive information prematurely."
  },
  {
    id: 7,
    question: "Is this service free?",
    answer: "Yes. Getting scammed is expensive enough. We'd rather you keep your money than hand it over to a bot in a basement."
  }
];