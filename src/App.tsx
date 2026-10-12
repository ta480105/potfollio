import { useEffect, useState } from 'react'
import {
  ArrowDownRight, ArrowUpRight, Check, ChevronDown, Code2,
  Compass, Menu, Moon, Sun, Smartphone, Sparkles, X, Zap, Building2,
  PanelsTopLeft, Utensils, MessageCircle, Mail, Send, Layers3, HeartHandshake
} from 'lucide-react'
import { siteConfig } from './config/site'

type ServiceId = 'business' | 'landing' | 'restaurant'
type Inquiry = { name: string; business: string; email: string; phone: string; service: string; budget: string; message: string }

const blankInquiry: Inquiry = { name: '', business: '', email: '', phone: '', service: 'business', budget: '', message: '' }
const iconMap = { building: Building2, panels: PanelsTopLeft, utensils: Utensils }

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('tabish-theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const [inquiry, setInquiry] = useState<Inquiry>(blankInquiry)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('tabish-theme', theme)
  }, [theme])

  const setService = (service: string) => {
    setInquiry(prev => ({ ...prev, service }))
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const submitInquiry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError('')
    setFormSuccess('')
    if (!inquiry.name.trim() || !inquiry.email.trim() || !inquiry.message.trim()) {
      setFormError('Please fill in your name, email, and project details.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email.trim())) {
      setFormError('Please enter a valid email address.')
      return
    }
    if (inquiry.name.trim().length > 120 || inquiry.business.length > 160 || inquiry.email.length > 254 || inquiry.phone.length > 40 || inquiry.message.trim().length > 5000) {
      setFormError('Some fields are too long. Please shorten them and try again.')
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inquiry, name: inquiry.name.trim(), email: inquiry.email.trim(), message: inquiry.message.trim() })
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Your inquiry could not be sent. Please try again.')
      setFormSuccess('Thanks! Your inquiry was sent successfully. I’ll get back to you soon.')
      setInquiry(blankInquiry)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong. Please try again or email ta480105@gmail.com directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const sendWhatsApp = (service?: string) => {
    const text = `Hi Tabish! I'd like to discuss a ${service ?? 'website'} project. Could you share the next steps?`
    if (/^\d{8,15}$/.test(siteConfig.whatsappNumber)) {
      window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    } else {
      setService(service ?? 'business')
      setFormError('Add your WhatsApp number in src/config/site.ts to enable direct WhatsApp links.')
    }
  }

  const faqs = [
    ['What types of websites do you create?', 'I focus on business websites, landing pages, and restaurant websites. We can discuss your goals and decide what fits your business.'],
    ['How much does a website cost?', 'The prices shown are indicative starter estimates, not fixed quotes. Final pricing depends on page count, content, features, integrations, and scope.'],
    ['How long will my website take?', 'Timing depends on the project scope and how quickly content and feedback are provided. I’ll discuss a realistic timeline before work begins.'],
    ['Will my website work on mobile phones?', 'Yes, responsive layouts are part of the plan so the website can adapt to phones, tablets, and desktop screens.'],
    ['Can I request changes?', 'We can agree on the revision scope before starting. Larger changes or new features may affect the estimate and timeline.'],
    ['Do I need to buy a domain?', 'A custom domain is optional but useful for a professional presence. Domain registration and any paid third-party services may cost extra.'],
    ['Can you redesign my existing website?', 'Yes, share your current website and what you want to improve. I can review the scope and discuss suitable next steps.'],
    ['How do I get started?', 'Fill out the inquiry form with a few details about your business and goals. I’ll use that information to understand the project and discuss the next step.']
  ]

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Tabish home"><span className="brand-mark">T<span>.</span></span><span className="brand-name">tabish<span className="brand-dot">/</span></span></a>
        <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {['Services', 'Work', 'Process', 'Pricing', 'About', 'FAQ'].map(item => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>)}
          <a className="mobile-contact" href="#contact" onClick={() => setMenuOpen(false)}>Let's talk <ArrowUpRight size={15}/></a>
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}</button>
          <a className="button button-small button-primary desktop-cta" href="#contact">Let's talk <ArrowUpRight size={15}/></a>
          <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
        </div>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot"/> INDEPENDENT WEB DESIGN & DEVELOPMENT</div>
            <h1>Good businesses<br/>deserve <span className="gradient-text">great websites.</span></h1>
            <p className="hero-lede">I build thoughtful, modern websites that help small businesses show up with confidence and make it easier for customers to connect.</p>
            <div className="hero-actions">
              <a href="#contact" className="button button-primary">Start a project <ArrowUpRight size={17}/></a>
              <a href="#work" className="button button-quiet">Explore my work <ArrowDownRight size={16}/></a>
            </div>
            <div className="hero-note"><span className="note-line"/> Built with care. Designed around your business.</div>
          </div>
          <div className="hero-art" aria-label="Abstract website interface illustration">
            <div className="art-glow"/>
            <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
            <div className="floating-tag tag-top"><span className="tag-dot blue"/> responsive by design</div>
            <div className="browser-window">
              <div className="browser-top"><div className="browser-dots"><i/><i/><i/></div><div className="browser-address">yourbusiness.site</div><div className="browser-menu">•••</div></div>
              <div className="browser-content">
                <div className="mock-nav"><span className="mock-logo">YOUR<span>CO.</span></span><div className="mock-nav-links"><i/><i/><i/></div><span className="mock-nav-button"/></div>
                <div className="mock-hero">
                  <div className="mock-copy"><div className="mock-kicker"/> <div className="mock-line long"/><div className="mock-line mid"/><div className="mock-line short"/><div className="mock-cta"/></div>
                  <div className="mock-visual"><div className="visual-sun"/><div className="visual-hill hill-one"/><div className="visual-hill hill-two"/><div className="visual-card"><Sparkles size={18}/><span>Made for you</span></div></div>
                </div>
                <div className="mock-bottom"><div/><div/><div/></div>
              </div>
            </div>
            <div className="floating-tag tag-bottom"><span className="tag-icon"><Smartphone size={15}/></span><span><b>Every screen.</b><small>One seamless experience.</small></span></div>
            <div className="art-index">01 <span/> 03</div>
          </div>
          <div className="hero-bottom"><span>BASED IN INDIA · OPEN TO GOOD PROJECTS</span><a href="#services">WHAT I CAN BUILD <ArrowDownRight size={14}/></a></div>
        </section>

        <section className="trust-strip"><div className="strip-inner"><span>DESIGNED FOR SMALL BUSINESS</span><div className="strip-divider"/><span><Smartphone size={15}/> MOBILE-FIRST</span><div className="strip-divider"/><span><Zap size={15}/> LIGHTWEIGHT & PRACTICAL</span><div className="strip-divider"/><span><HeartHandshake size={15}/> CLEAR COMMUNICATION</span></div></section>

        <section className="section-wrap section-block" id="services">
          <div className="section-heading"><div><div className="eyebrow">01 / WHAT I DO</div><h2>Digital essentials,<br/><span className="muted-text">done thoughtfully.</span></h2></div><p className="section-intro">No unnecessary complexity. Just a clear, useful website shaped around what your business needs.</p></div>
          <div className="service-grid">
            {siteConfig.services.map((service, index) => {
              const Icon = iconMap[service.icon]
              return <article className="service-card" key={service.id}><div className="service-card-top"><span className="icon-box"><Icon size={20}/></span><span className="card-index">0{index + 1}</span></div><h3>{service.title}</h3><p>{service.description}</p><ul>{service.features.map(feature => <li key={feature}><Check size={14}/>{feature}</li>)}</ul><button className="text-link" onClick={() => setService(service.id)}>Discuss this project <ArrowUpRight size={15}/></button></article>
            })}
          </div>
        </section>

        <section className="section-wrap section-block work-section" id="work">
          <div className="section-heading"><div><div className="eyebrow">02 / SELECTED CONCEPTS</div><h2>Ideas made <span className="gradient-text">visible.</span></h2></div><p className="section-intro">A few self-initiated concepts to demonstrate the kind of digital experience I can create. These are not client projects.</p></div>
          <div className="project-grid">
            {siteConfig.projects.map((project, index) => <article className={`project-card project-${project.style}`} key={project.id}>
              <button className="project-preview" onClick={() => setSelectedProject(project.id)} aria-label={`View details for ${project.name}`}>
                <div className="preview-top"><span className="preview-brand">{project.name}<b>.</b></span><span className="preview-pill">{project.style === 'food' ? 'GOOD FOOD, GOOD MOOD' : project.style === 'fitness' ? 'MOVE WITH PURPOSE' : 'MADE LOCAL'}</span></div>
                {project.style === 'food' && <div className="food-art"><div className="food-plate"><div className="food-dish"/><div className="food-leaf leaf-a"/><div className="food-leaf leaf-b"/></div><span className="food-caption">FRESH. LOCAL. DELICIOUS.</span></div>}
                {project.style === 'fitness' && <div className="fitness-art"><div className="fitness-circle"/><div className="fitness-copy">STRONGER<br/><i>EVERY DAY.</i></div><div className="fitness-bars"><i/><i/><i/><i/><i/></div></div>}
                {project.style === 'craft' && <div className="craft-art"><div className="craft-sun"/><div className="craft-arch"><div/></div><div className="craft-title">Made with<br/><i>intention.</i></div><div className="craft-stamp">LOCAL<br/>BY DESIGN</div></div>}
                <div className="preview-footer"><span>INDEPENDENT CONCEPT</span><span>↗</span></div>
              </button>
              <div className="project-info"><div><span className="project-label">{project.label}</span><h3>{project.name}</h3><span className="project-type">{project.type}</span></div><button className="round-arrow" onClick={() => setSelectedProject(project.id)} aria-label={`View ${project.name} details`}><ArrowUpRight size={18}/></button></div>
              <p className="project-description">{project.description}</p>
            </article>)}
          </div>
          <div className="concept-note"><Sparkles size={16}/><p><b>Transparency first.</b> These are fictional demo brands created to showcase design direction. They are not commissioned client work.</p></div>
        </section>

        <section className="process-band" id="process"><div className="section-wrap section-block"><div className="section-heading"><div><div className="eyebrow">03 / HOW IT WORKS</div><h2>A clear path from<br/><span className="muted-text">idea to online.</span></h2></div><p className="section-intro">Good work starts with a shared understanding. Here’s how we can approach your project together.</p></div><div className="process-grid">
          {[['01','Discover','We talk through your business, audience, goals, and what you need your website to do.',Compass],['02','Plan','We shape the page structure, content, visual direction, and key actions.',Layers3],['03','Build','I create the responsive website and refine the details with your feedback.',Code2],['04','Review & launch','We review the agreed scope, make revisions, and prepare for deployment.',ArrowUpRight]].map(([num,title,desc,Icon]) => { const StepIcon = Icon as typeof Compass; return <article className="process-step" key={num as string}><div className="step-head"><span>{num as string}</span><StepIcon size={19}/></div><h3>{title as string}</h3><p>{desc as string}</p></article>})}
        </div><p className="timeline-note">Timelines depend on the project scope and how quickly content and feedback are available.</p></div></section>

        <section className="section-wrap section-block pricing-section" id="pricing"><div className="section-heading"><div><div className="eyebrow">04 / SIMPLE ESTIMATES</div><h2>Know the ballpark.<br/><span className="muted-text">Plan with clarity.</span></h2></div><p className="section-intro">Every business is different. These indicative ranges are a starting point for a conversation, not a fixed quote.</p></div>
          <div className="pricing-grid">{siteConfig.pricing.map((item, index) => <article className="pricing-card" key={item.id}><span className="pricing-number">0{index + 1} / ESTIMATE</span><h3>{item.name}</h3><p>{item.detail}</p><div className="price">{item.price}</div><span className="price-caption">Indicative project range</span><div className="pricing-rule"/><ul>{item.features.map(f => <li key={f}><Check size={14}/>{f}</li>)}</ul><button className="button button-outline full-width" onClick={() => setService(item.id)}>Discuss your project <ArrowUpRight size={15}/></button></article>)}</div>
          <div className="pricing-footnote"><span className="footnote-icon">i</span><p><b>A quick note on costs:</b> Final pricing depends on scope, pages, content, and integrations. Domain registration, paid hosting/services, premium assets, advanced integrations, online payments, and ongoing maintenance may cost extra.</p></div>
        </section>

        <section className="about-section" id="about"><div className="section-wrap about-layout"><div className="about-visual"><div className="about-monogram">T<span>.</span></div><div className="about-orbit"/><span className="about-caption">CURIOUS BY NATURE. CAREFUL BY DESIGN.</span><span className="about-spark">✳</span></div><div className="about-copy"><div className="eyebrow">05 / A LITTLE ABOUT ME</div><h2>Hi, I’m Tabish.<br/><span className="muted-text">Let’s build something useful.</span></h2><p>I’m an aspiring website developer who uses modern AI-assisted tools to build clean, responsive websites for small businesses. My focus is on thoughtful design, clear communication, and practical website experiences that make it easier for customers to understand a business and get in touch.</p><p>I’m building my portfolio one thoughtful project at a time, and I’m excited to work with businesses that value a clear online presence.</p><div className="about-values"><span><Check size={15}/> Responsive-first thinking</span><span><Check size={15}/> Straightforward communication</span><span><Check size={15}/> Practical, readable design</span></div><a href="#contact" className="text-link">Tell me what you have in mind <ArrowUpRight size={15}/></a></div></div></section>

        <section className="section-wrap section-block why-section"><div className="section-heading"><div><div className="eyebrow">06 / THE APPROACH</div><h2>Small details.<br/><span className="muted-text">A better experience.</span></h2></div><p className="section-intro">A website should make things easier—for your customers and for you.</p></div><div className="why-grid">{[['01','Designed for real people','Readable content, clear navigation, and obvious next steps.'],['02','Built for different screens','Layouts planned for mobile first, then expanded for larger screens.'],['03','Focused on your business','Useful content and contact paths, without unnecessary extras.'],['04','Clear from the start','We discuss scope, expectations, and costs before moving ahead.']].map(([n,t,d])=><div className="why-item" key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>)}</div></section>

        <section className="faq-section" id="faq"><div className="section-wrap section-block faq-layout"><div><div className="eyebrow">07 / GOOD TO KNOW</div><h2>Questions, <span className="muted-text">answered.</span></h2><p className="section-intro">A few things you might be wondering before getting started.</p><a href="#contact" className="text-link">Still have a question? Ask me <ArrowUpRight size={15}/></a></div><div className="faq-list">{faqs.map(([question, answer], i) => <div className={`faq-item ${activeFaq === i ? 'faq-open' : ''}`} key={question}><button aria-expanded={activeFaq === i} onClick={() => setActiveFaq(activeFaq === i ? null : i)}><span>{question}</span><ChevronDown size={17}/></button><div className="faq-answer"><p>{answer}</p></div></div>)}</div></div></section>

        <section className="section-wrap contact-section" id="contact"><div className="contact-panel"><div className="contact-copy"><div className="eyebrow"><span className="status-dot"/> 08 / YOUR NEXT STEP</div><h2>Have a project<br/>in <span className="gradient-text">mind?</span></h2><p>Tell me a little about your business and what you’re looking to build. We’ll take it from there—no pressure, just a conversation.</p><div className="contact-methods"><button onClick={() => sendWhatsApp()}><span><MessageCircle size={18}/></span><div><b>WhatsApp</b><small>Start a conversation</small></div><ArrowUpRight size={16}/></button><button onClick={() => { if (siteConfig.email.includes('@')) window.location.href = `mailto:${siteConfig.email}`; else setFormError('Add your email address in src/config/site.ts to enable email contact.') }}><span><Mail size={18}/></span><div><b>Email</b><small>{siteConfig.email}</small></div><ArrowUpRight size={16}/></button></div></div>
          <form className="contact-form" onSubmit={submitInquiry}><div className="form-title"><h3>Tell me about it</h3><span>PROJECT INQUIRY</span></div><div className="form-row"><label>Your name *<input value={inquiry.name} onChange={e => setInquiry({...inquiry, name:e.target.value})} placeholder="Name" autoComplete="name" required/></label><label>Business name<input value={inquiry.business} onChange={e => setInquiry({...inquiry, business:e.target.value})} placeholder="Your business" autoComplete="organization"/></label></div><div className="form-row"><label>Email address *<input type="email" value={inquiry.email} onChange={e => setInquiry({...inquiry, email:e.target.value})} placeholder="you@example.com" autoComplete="email" required/></label><label>WhatsApp number<input value={inquiry.phone} onChange={e => setInquiry({...inquiry, phone:e.target.value})} placeholder="Optional" autoComplete="tel"/></label></div><div className="form-row"><label>Service you need<select value={inquiry.service} onChange={e => setInquiry({...inquiry, service:e.target.value as ServiceId})}>{siteConfig.services.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label><label>Estimated budget<select value={inquiry.budget} onChange={e => setInquiry({...inquiry,budget:e.target.value})}><option value="">Not sure yet</option><option>Under ₹3,000</option><option>₹3,000–₹5,000</option><option>₹5,000–₹8,000</option><option>₹8,000+</option></select></label></div><label>What do you have in mind? *<textarea value={inquiry.message} onChange={e => setInquiry({...inquiry,message:e.target.value})} placeholder="A little about your business, goals, and what you need..." rows={4} required/></label>{formError && <p className="form-error" role="alert">{formError}</p>}{formSuccess && <p className="form-success" role="status">{formSuccess}</p>}<button className="button button-primary full-width" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending inquiry…' : 'Send project inquiry'} <Send size={15}/></button><p className="form-disclaimer">Your project details are sent securely to the portfolio owner by the website backend. Please don’t include passwords or sensitive information.</p></form>
        </div></section>
      </main>

      <footer className="site-footer"><div className="section-wrap footer-main"><a className="brand" href="#home"><span className="brand-mark">T<span>.</span></span><span className="brand-name">tabish<span className="brand-dot">/</span></span></a><p>Thoughtful websites for businesses<br/>ready to show up online.</p><div className="footer-nav"><a href="#services">Services</a><a href="#work">Work</a><a href="#pricing">Pricing</a><a href="#contact">Contact</a></div><a className="back-top" href="#home">BACK TO TOP ↑</a></div><div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} Tabish. Built with care.</span><span>INDEPENDENT WEB DESIGN & DEVELOPMENT</span></div></footer>

      {selectedProject && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedProject(null)}><section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => e.stopPropagation()}><button className="modal-close" aria-label="Close project details" onClick={() => setSelectedProject(null)}><X size={19}/></button><span className="project-label">DEMO PROJECT · SELF-INITIATED</span><h2 id="modal-title">{siteConfig.projects.find(p=>p.id===selectedProject)?.name}</h2><p>{siteConfig.projects.find(p=>p.id===selectedProject)?.description}</p><div className="modal-note"><Sparkles size={17}/><span>This is a fictional concept used to demonstrate design direction, not a live client website.</span></div><button className="button button-primary" onClick={() => {setSelectedProject(null);setService(selectedProject === 'urbanbite' ? 'restaurant' : selectedProject === 'fitcore' ? 'business' : 'business')}}>Discuss a similar website <ArrowUpRight size={15}/></button></section></div>}
    </div>
  )
}

export default App
