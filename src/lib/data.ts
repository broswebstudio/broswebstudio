/* ================= DATA ================= */
        

        export const NAV_LINKS = [
            { route: 'home', label: 'Home' },
            { route: 'services', label: 'Services' },
            { route: 'website-for-business', label: 'Website for Business' },
            { route: 'college-projects', label: 'College Projects' },
            { route: 'graphic-designing', label: 'Graphic Designing' },
        ];

        export const SERVICES = {
            business: {
                key: 'business', route: 'website-for-business', name: 'Website for Business',
                eyebrow: 'website-for-business',
                tagline: 'A website that looks like it cost 3x more than it did.',
                lede: 'For shop owners, founders, consultants and individuals who need a site that brings in enquiries — not just a digital business card nobody visits twice.',
                who: ['Small business owners opening their first website', 'Founders launching an MVP landing page', 'Consultants, coaches and freelancers building credibility', 'Individuals who want a personal portfolio that converts'],
                included: ['Custom-designed pages (no drag-drop template look)', 'Mobile, tablet and desktop responsive build', 'Contact / enquiry forms wired to your email or WhatsApp', 'On-page SEO basics — titles, meta tags, sitemap', 'Speed-optimised images and code', 'Domain + hosting setup guidance', '7 days of free bug-fix support after handover', 'A short screen-recorded walkthrough of your new site'],
                tiers: [
                    { name: 'Starter', price: '₹4,999', desc: 'A clean single-page site to get you online fast.', features: ['1 page (multi-section)', 'Up to 5 sections', 'Contact form', 'Mobile responsive', '3 day delivery'], pop: false },
                    { name: 'Business', price: '₹12,999', desc: 'The most-picked plan for shops and consultants.', features: ['Up to 5 pages', 'Custom animations', 'SEO setup', 'WhatsApp + form integration', 'Basic admin panel (edit content)', '7 day delivery'], pop: true },
                    { name: 'Growth', price: '₹24,999+', desc: 'For businesses that need logins, payments or a catalog.', features: ['Unlimited pages', 'E-commerce / booking ready', 'Admin dashboard', 'Payment gateway integration', 'Priority delivery', '1 month support'], pop: false },
                ],
                process: [
                    { t: 'Discovery call', d: 'We understand your business, audience and what "success" looks like for the site.' },
                    { t: 'Sitemap & content plan', d: 'You get a simple page-by-page plan before any design starts, so there are no surprises.' },
                    { t: 'Design & build', d: 'We design and build in parallel sprints, sharing progress every few days.' },
                    { t: 'Review round', d: 'You review on a live preview link and request changes — covered in your plan.' },
                    { t: 'Launch & handover', d: 'We deploy, connect your domain, and hand over a walkthrough video + login access.' },
                ],
                faqs: [
                    { q: 'Do I need to arrange hosting and a domain myself?', a: 'No — we guide you through buying a domain and hosting if you don\'t have one, and we handle the technical setup either way.' },
                    { q: 'Can I edit the website myself later?', a: 'Yes, Business and Growth plans include a simple admin panel so you can update text, images and offers without touching code.' },
                    { q: 'What if I need more pages later?', a: 'You can add pages anytime — we quote each addition separately based on complexity.' },
                    { q: 'Do you write the content too?', a: 'We can. Copywriting is available as an add-on in the estimator below, or you can share your own content.' },
                ],
            },
            college: {
                key: 'college', route: 'college-projects', name: 'College Projects',
                eyebrow: 'college-projects',
                tagline: 'Submission-ready major & minor projects — built, documented, explained.',
                lede: 'For students who need working software, a proper report, and enough understanding to answer viva questions with confidence — not just a zip file.',
                who: ['Final-year students needing a major project', 'Students needing a minor / semester project', 'Groups that need one working codebase everyone can explain', 'Students who want a report + PPT that matches the code'],
                included: ['Fully working source code in your chosen stack', 'Project report formatted to common university guidelines', 'Presentation slides (PPT) summarising the project', 'Database design / ER diagrams where applicable', 'Code walkthrough so you can explain it in viva', 'Plagiarism-awareness check on the written report', 'Setup guide to run the project on your own laptop', 'Revisions until your guide approves the submission'],
                tiers: [
                    { name: 'Minor Project', price: '₹2,999', desc: 'Semester-level project, single module.', features: ['Working code', 'Basic report', 'PPT included', '5 day delivery', '1 revision round'], pop: false },
                    { name: 'Major Project', price: '₹7,999', desc: 'The standard pick for final-year submissions.', features: ['Full-stack working project', 'Detailed report + diagrams', 'PPT + viva prep notes', '10-12 day delivery', '2 revision rounds'], pop: true },
                    { name: 'Major + Research', price: '₹14,999+', desc: 'For projects paired with a paper or advanced scope.', features: ['Everything in Major', 'Research-style documentation', 'Plagiarism-checked report', 'Rush delivery available', 'Code walkthrough video'], pop: false },
                ],
                process: [
                    { t: 'Topic & scope check', d: 'We confirm your topic, tech stack and university format requirements first.' },
                    { t: 'Proposal draft', d: 'A short synopsis you can get approved by your guide before real work starts.' },
                    { t: 'Build in modules', d: 'The project is built module by module so partial progress is visible early.' },
                    { t: 'Report & PPT', d: 'Documentation is written to match the final working code, not a generic template.' },
                    { t: 'Viva prep', d: 'We walk you through the code and likely questions so you can present it yourself.' },
                ],
                faqs: [
                    { q: 'Will I be able to explain the project in my viva?', a: 'Yes — every Major Project includes a guided code walkthrough specifically so you can answer questions confidently.' },
                    { q: 'Can you match my university\'s report format?', a: 'Send us your format/guidelines document and we\'ll follow it exactly for headings, diagrams and referencing style.' },
                    { q: 'What if my guide asks for changes?', a: 'Revision rounds are built into every tier — we adjust scope, code or report based on your guide\'s feedback.' },
                    { q: 'Is this fine for group submissions?', a: 'Yes, we can split the report and explanation notes by member so each person can present their part.' },
                ],
            },
            graphic: {
                key: 'graphic', route: 'graphic-designing', name: 'Graphic Designing',
                eyebrow: 'graphic-designing',
                tagline: 'Design that makes people stop scrolling and start noticing.',
                lede: 'Logos, social kits, posters and brand collateral for businesses, creators and events that need to look put-together everywhere they show up.',
                who: ['New businesses needing a logo and brand starter kit', 'Creators needing consistent social media templates', 'Event organisers needing posters and banners', 'Anyone tired of shaky Canva-only designs'],
                included: ['Original logo concepts (not stock templates)', 'Source files (AI/PSD/Figma) + exported PNG/SVG', 'Social media post & story templates', 'Colour palette and font pairing guide', 'Business card / letterhead layout on request', 'Print-ready poster and banner files', 'Two rounds of revisions on every deliverable', 'Quick-turnaround options for events and launches'],
                tiers: [
                    { name: 'Starter Kit', price: '₹1,499', desc: 'A logo and the basics to look legit online.', features: ['1 logo concept', '3 revisions', 'PNG + SVG export', 'Colour palette', '3 day delivery'], pop: false },
                    { name: 'Brand Pack', price: '₹4,499', desc: 'The go-to for new businesses and creators.', features: ['3 logo concepts', 'Full brand colour + font kit', '10 social media templates', 'Business card design', '5 day delivery'], pop: true },
                    { name: 'Launch Bundle', price: '₹8,999+', desc: 'For product launches and events that need everything.', features: ['Everything in Brand Pack', 'Poster & banner set', 'Brand guideline PDF', 'Priority + rush delivery', 'Unlimited minor tweaks'], pop: false },
                ],
                process: [
                    { t: 'Brief & mood board', d: 'We gather references, competitors and the feeling you want the brand to have.' },
                    { t: 'Concepts', d: 'You receive 2-3 distinct directions to react to, not one take-it-or-leave-it design.' },
                    { t: 'Refine', d: 'We narrow to one direction and refine colour, type and layout details.' },
                    { t: 'Export pack', d: 'All final files are exported in the formats you\'ll actually need — print and digital.' },
                    { t: 'Handover', d: 'You get source files plus a one-page guide on how to use everything consistently.' },
                ],
                faqs: [
                    { q: 'Do I own the final designs?', a: 'Yes — full ownership and source files transfer to you once the project is delivered and paid for.' },
                    { q: 'Can you match an existing brand style?', a: 'Yes, send references or existing assets and we\'ll design within that established style.' },
                    { q: 'What file formats do I get?', a: 'You get editable source files plus exported PNG, SVG and print-ready PDF depending on the deliverable.' },
                    { q: 'Can this be combined with a website order?', a: 'Yes — many clients bundle graphic design with a website build; select both in the estimator below.' },
                ],
            },
        };

        export const PROBLEMS = [
            { t: 'The "Jugaad" Website that Bleeds Clients', d: 'Slow, broken on mobile, and quietly costing you high-paying customers who bounce to competitors in the first 3 seconds.' },
            { t: 'The 11th-Hour Submission Panic', d: 'A major college project due in 10 days, the code won\'t compile, and you have zero idea how to explain it in your viva.' },
            { t: 'The Frankenstein Brand Identity', d: 'A logo from one freelancer, posts from another, and a website from 2010 — making your business look confused and amateur.' },
        ];

        export const FEATURES = [
            { icon: '01', t: 'Handcrafted, Never Templated', d: 'Your brand is unique. Your website shouldn\'t look like a $10 recycled theme. We build entirely from scratch.', v: 'Stand out instantly' },
            { icon: '02', t: 'Direct Founder Access', d: 'No support queues or account managers. You speak directly with the creators building your actual project.', v: 'Zero communication friction' },
            { icon: '03', t: 'Deadline-Obsessed Delivery', d: 'Fixed dates set upfront. We share live staging links so you never have to ask "where are we at?"', v: 'Launch precisely on time' },
            { icon: '04', t: 'Transparent, Upfront Pricing', d: 'Tiered plans and a live estimator mean you know exactly what you\'ll pay before we even talk.', v: 'No hidden fees, ever' },
            { icon: '05', t: 'Code + Confidence Included', d: 'We don\'t just hand over a zip file. You get PPTs, reports, and guided walkthroughs so you truly own it.', v: 'Defend your project easily' },
            { icon: '06', t: 'Built-in Revision Cycles', d: 'Your first draft isn\'t your only shot. We iterate together until the final product hits the mark.', v: 'Get it perfect, not just done' },
            { icon: '07', t: 'Post-Launch Safety Net', d: 'A dedicated support window after handover to squash bugs and tweak details at zero extra cost.', v: 'You\'re never abandoned' },
            { icon: '08', t: 'The Full-Stack Studio', d: 'Websites, college projects, and premium graphic design under one roof. Your complete digital partner.', v: 'Consistent quality everywhere' },
        ];

        export const STEPS = [
            { t: 'Inquiry', d: 'Tell us what you need through the estimator or a quick message.' },
            { t: 'Scoping call', d: 'A short call to confirm requirements, timeline and price.' },
            { t: 'Design & build', d: 'We work in visible stages and share progress regularly.' },
            { t: 'Review', d: 'You review on a live link and request changes.' },
            { t: 'Delivery', d: 'Final handover with support window included.' },
        ];

        export const FAQS_HOME = [
            { q: 'How is pricing decided?', a: 'Base price depends on the service, and the live estimator below adds cost for each extra feature you select — the total updates as you go, so there\'s no surprise invoice.' },
            { q: 'How fast can you deliver?', a: 'Simple sites and minor projects typically ship in 3-5 days; larger business sites or major projects take 10-15 days depending on scope.' },
            { q: 'Do you offer revisions?', a: 'Yes, every plan includes at least one revision round, with more included on higher tiers.' },
            { q: 'What if I\'m not sure what I need?', a: 'Use the "Discuss with Our Team" option below the estimator — we\'ll help scope the project on a short call before anything is finalised.' },
            { q: 'How do I pay?', a: 'A partial advance confirms the project start, with the balance due on delivery. Details are shared during scoping.' },
        ];

        /* Estimator config: base price + add-ons per service */
        export const ESTIMATOR = {
            business: {
                label: 'Website for Business', base: 4999, baseLabel: 'Starter build', baseDesc: 'Perfect for small businesses and portfolios.',
                baseIncludes: ['1-3 custom designed pages', 'Mobile responsive layout', 'Contact form integration', 'Basic on-page SEO', '1 month free support'],
                options: [
                    { id: 'pages', t: 'Extra pages (5 pack)', d: 'Add five additional custom pages', price: 2500 },
                    { id: 'ecom', t: 'E-commerce / cart', d: 'Product listing, cart and checkout flow', price: 6000 },
                    { id: 'admin', t: 'Admin dashboard', d: 'Edit content, products or bookings yourself', price: 4000 },
                    { id: 'payment', t: 'Payment gateway', d: 'Razorpay / Stripe integration', price: 2500 },
                    { id: 'animations', t: 'Custom animations', d: 'Scroll reveals, hover motion, page transitions', price: 1800 },
                    { id: 'seo', t: 'SEO package', d: 'Keyword-optimised copy structure + metadata', price: 1500 },
                    { id: 'copy', t: 'Copywriting', d: 'We write the on-page content for you', price: 1200 },
                    { id: 'maintenance', t: 'Monthly maintenance', d: 'Updates & monitoring, billed monthly', price: 999 },
                ],
            },
            college: {
                label: 'College Project', base: 2999, baseLabel: 'Minor project build', baseDesc: 'A fully functional project to ace your submissions.',
                baseIncludes: ['Working single-module app', 'Basic report document', 'Source code & DB scripts', 'Setup instructions', '1 revision round'],
                options: [
                    { id: 'major', t: 'Upgrade to Major Project', d: 'Full-stack scope instead of single module', price: 5000 },
                    { id: 'report', t: 'Extended report', d: 'Deeper documentation with diagrams & references', price: 800 },
                    { id: 'ppt', t: 'Presentation deck', d: 'Polished PPT summarising the project', price: 500 },
                    { id: 'viva', t: 'Viva prep session', d: '1-on-1 walkthrough of likely questions', price: 700 },
                    { id: 'plag', t: 'Plagiarism-checked report', d: 'Report run through a similarity checker with report attached', price: 600 },
                    { id: 'video', t: 'Code walkthrough video', d: 'Screen-recorded explanation of the codebase', price: 900 },
                    { id: 'rush', t: 'Rush delivery', d: 'Priority queue, faster turnaround', price: 1500 },
                ],
            },
            graphic: {
                label: 'Graphic Designing', base: 1499, baseLabel: 'Starter logo kit', baseDesc: 'Professional branding to kickstart your identity.',
                baseIncludes: ['1 custom logo concept', 'High-res PNG & JPEG', 'Scalable Vector SVG', 'Transparent background', '2 revision rounds'],
                options: [
                    { id: 'logo3', t: '3 logo concepts', d: 'Instead of a single direction to react to', price: 1000 },
                    { id: 'social', t: 'Social media kit', d: '10 post + story templates matched to your brand', price: 1800 },
                    { id: 'card', t: 'Business card & stationery', d: 'Card, letterhead and email signature layout', price: 900 },
                    { id: 'poster', t: 'Poster / banner pack', d: 'Print-ready posters and banners for events', price: 1500 },
                    { id: 'guideline', t: 'Brand guideline PDF', d: 'One document covering colours, type and usage rules', price: 700 },
                    { id: 'unlimited', t: 'Unlimited revisions', d: 'Remove the 2-round cap for this project', price: 1200 },
                ],
            },
        };



        /* ---- Estimator component ---- */
        