Full-Stack Developer Assignment 
(Startup Benefits Platform) 
1. Business Context 
You are building a Startup Benefits and Partnerships Platform. 
Target Users 
● Startup founders 
● Early-stage teams 
● Indie hackers 
Problem Statement 
Early-stage startups often cannot afford premium SaaS tools. This platform provides exclusive 
deals and benefits on SaaS products such as cloud services, marketing tools, analytics 
platforms, and productivity software. 
Some deals are public, while others are restricted and require user verification. 
2. Technical Constraints (Strict) 
Frontend 
● Next.js only (App Router) 
● TypeScript 
● Any modern styling solution (Tailwind CSS, CSS Modules, etc.) 
● High-quality animations are mandatory 
● Optional 3D elements using Three.js or related tooling 
Do not use a standalone React application. All frontend work must be implemented within 
Next.js. 
Backend 
● Node.js 
● Express.js 
● MongoDB with Mongoose 
● REST APIs 
● JWT-based authentication 
GraphQL, Firebase, Supabase, or serverless abstractions are not allowed. 
3. Core Application Flow 
1. User registers and logs in 
2. User browses available deals 
3. Certain deals are locked and require verification 
4. User can claim an eligible deal 
5. Claimed deals appear in the user dashboard with status tracking 
The focus should be on clarity of flow, correctness, and structure, not on excessive features. 
4. Frontend Requirements 
Mandatory Pages 
Landing Page 
● Premium SaaS-style layout 
● Clear value proposition 
● Animated hero section 
● Call-to-action to explore deals 
Animations are required on this page. 
Deals Listing Page 
● List of all available deals 
● Filters by category and access level (locked/unlocked) 
● Search functionality 
● Smooth transitions between UI states 
Locked deals should be visually restricted and clearly communicate why access is limited. 
Deal Details Page 
● Full deal description 
● Partner information 
● Eligibility conditions 
● Claim action 
User Dashboard 
● User profile information 
● List of claimed deals 
● Claim status (for example: pending, approved) 
5. UI, Animation, and Visual Quality Expectations 
High-quality motion and interaction design is mandatory. 
Required 
● Page transitions 
● Micro-interactions (hover states, button feedback) 
● Loading states or skeleton screens 
● Smooth layout transitions 
Optional (High Value) 
Implement at least one of the following: 
● A 3D hero or visual element using Three.js 
● Scroll-based storytelling or section transitions 
● Interactive cards with depth or tilt effects 
● Motion-driven onboarding or highlight flows 
Animation should enhance usability and clarity. Overuse of motion will be considered a negative 
signal. 
6. Backend Requirements 
Core Entities 
At minimum, your system should model: 
● User 
● Deal 
● Claim 
You are responsible for designing: 
● Schema fields 
● Relationships 
● Indexes 
● Validation rules 
API Responsibilities 
Your backend must support: 
● User registration and login 
● Fetching all deals 
● Fetching a single deal 
● Claiming a deal 
● Fetching claimed deals for a user 
Protected routes must use JWT authentication. 
Unverified users must not be able to claim locked deals. 
7. Evaluation Focus (Backend) 
● API design clarity 
● Request-response flow 
● Separation of concerns 
● Validation and error handling 
● Authentication and authorization logic 
● Scalability and extensibility considerations 
8. README Requirements (Mandatory) 
Your submission must include a README.md explaining: 
1. End-to-end application flow 
2. Authentication and authorization strategy 
3. Internal flow of claiming a deal 
4. Interaction between frontend and backend 
5. Known limitations or weak points 
6. Improvements required for production readiness 
7. UI and performance considerations 
Submissions without a README will not be reviewed. 
9. Time Expectations 
● Expected effort: 6 to 10 hours 
● Submission deadline: 3 to 5 days 
We value reasoning and design decisions more than speed. 
10. Submission Instructions 
● Public GitHub repository 
● Frontend and backend may be in the same or separate repositories 
● README must be included 
● Deployment is optional and considered a bonus 
11. Disqualification Criteria 
● Pure CRUD implementation with no product thinking 
● Poor or missing animation and interaction design 
● Broken authentication or authorization flow 
● Inability to explain implementation choices 
● Tutorial-style or copy-paste projects 
● Missing README