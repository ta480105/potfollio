export const siteConfig = {
  name: 'Tabish',
  tagline: 'Independent web designer & developer',
  description: 'Modern, responsive websites for small businesses.',
  // Replace these before sharing your portfolio. Keep WhatsApp number digits only, including country code.
  whatsappNumber: '919507375721',
  email: 'ta480105@gmail.com',
  publicUrl: 'YOUR_DEPLOYED_SITE_URL',
  services: [
    { id: 'business', title: 'Business websites', price: '₹4,000–₹8,000', description: 'A polished home for your business online, with the essentials customers need to learn about you and get in touch.', icon: 'building', features: ['Responsive page layouts', 'Services and contact details', 'Map and opening-hours section'] },
    { id: 'landing', title: 'Landing pages', price: '₹2,000–₹4,000', description: 'A focused page for one service, offer, or campaign—with a clear message and a straightforward next step.', icon: 'panels', features: ['Clear call to action', 'Offer-focused content structure', 'Mobile-first layout'] },
    { id: 'restaurant', title: 'Restaurant websites', price: '₹3,000–₹7,000', description: 'Showcase your menu, atmosphere, location, and hours in a way that makes it easy for customers to plan a visit.', icon: 'utensils', features: ['Menu and food gallery', 'Location and opening hours', 'WhatsApp inquiry link'] }
  ],
  projects: [
    { id: 'urbanbite', name: 'UrbanBite', type: 'Restaurant website concept', label: 'DEMO PROJECT', description: 'A warm, modern restaurant concept designed to put signature dishes and visit information front and centre.', style: 'food', url: '' },
    { id: 'fitcore', name: 'FitCore', type: 'Fitness studio concept', label: 'DEMO PROJECT', description: 'An energetic concept for a neighbourhood fitness studio, built around programs, classes, and membership inquiries.', style: 'fitness', url: '' },
    { id: 'localcraft', name: 'LocalCraft', type: 'Small business concept', label: 'DEMO PROJECT', description: 'A clean small-business concept that makes services easy to scan and contacting the business feel effortless.', style: 'craft', url: '' }
  ],
  pricing: [
    { id: 'landing', name: 'Landing page', price: '₹2,000–₹4,000', detail: 'For one offer, service, or campaign', features: ['One focused page', 'Responsive design', 'Contact call to action'] },
    { id: 'business', name: 'Business website', price: '₹4,000–₹8,000', detail: 'For a small business establishing its presence', features: ['Multiple content sections', 'Services and contact details', 'Responsive design'] },
    { id: 'restaurant', name: 'Restaurant website', price: '₹3,000–₹7,000', detail: 'For restaurants, cafés, and food businesses', features: ['Menu presentation', 'Location and hours', 'Inquiry link'] }
  ]
} as const
