export type ProgramItem = {
  title: string
  time: string
  description: string
  tags: string[]
  image?: string
  speakers?: string[]
  date?: string // ISO date YYYY-MM-DD
  durationMinutes?: number
}

export type Speaker = {
  name: string
  title: string
  company: string
  bio: string
  image: string
  facebook?: string
  linkedin?: string
}
export const googleFormUrl = 'https://forms.gle/mpTm4xo4SDQTARWn6'

export const program: ProgramItem[] = [
  {
    title: 'Battle BEST HIT',
    time: '09:00',
    date: '2024-05-16',
    durationMinutes: 60,
    description:
      'Compétition des meilleures créations digitales. Présentez vos projets innovants et inspirez la communauté.',
    tags: ['Compétition', 'Création'],
    image: '/images/event/best-hit.jpg',
    speakers: ['Ismaila NDIAYE', 'Yacine NGOM'],
  },
  {
    title: 'Défilé MODE',
    time: '10:30',
    date: '2024-05-16',
    durationMinutes: 90,
    description:
      'Meilleure création digitale dans le domaine de la mode. Découvrez les tendances digitales du secteur fashion.',
    tags: ['Mode', 'Digital'],
    image: '/images/event/defile-mode.jpg',
    speakers: ['Marieme DIAGNE'],
  },
  {
    title: 'Pack Partenaire',
    time: '14:00',
    date: '2024-05-16',
    durationMinutes: 120,
    description:
      "Opportunités de partenariat et exposition pour les entreprises. Visibilité 360%, décoration d'honneur et stands personnalisés.",
    tags: ['Partenariat', 'Business'],
    image: '/images/event/pack-partenaire.jpg',
    speakers: ['Yacine NGOM'],
  },
  {
    title: 'Salon National du Numérique #4',
    time: '17:00',
    date: '2024-05-16',
    durationMinutes: 180,
    description: 'Grand événement de l\'écosystème digital sénégalais. Réservez votre stand et rejoignez les acteurs majeurs du numérique.',
    tags: ['Salon', 'Numérique'],
    image: '/images/event/salon-numerique.jpg',
    speakers: ['Marieme DIAGNE', 'Ismaila NDIAYE', 'Yacine NGOM'],
  },
]
export const speakers: Speaker[] = [
  {
    name: 'Marieme DIAGNE',
    title: 'Directrice',
    company: 'PAPILLON EVENTS',
    bio: 'Directrice de PAPILLON EVENTS, spécialisée dans l\'organisation d\'événements d\'envergure.',
    image: '/images/speakers/img2.jpg',
    facebook: 'https://www.facebook.com/papillonmld',
    linkedin: 'https://www.linkedin.com/in/mari%C3%A8me-diagne-2b0439108/',
  },
  {
    name: 'Ismaila NDIAYE',
    title: 'Responsable',
    company: 'BIDEEW EVENTS',
    bio: 'Responsable de BIDEEW EVENTS, expert en conception et gestion d\'événements professionnels.',
    image: '/images/speakers/img3.jpg',
    facebook: 'https://www.facebook.com/iso.ndiaye1',
    linkedin: 'https://www.linkedin.com/in/isma%C3%AFla-ndiaye-95289b2bb/',
  },
  {
    name: 'Yacine NGOM',
    title: 'Responsable',
    company: 'FNAC',
    bio: 'Responsable FNAC, apportant son expertise dans le domaine de la distribution et de l\'événementiel.',
    image: '/images/speakers/img4.jpg',
    facebook: 'https://www.facebook.com/ngom.yacine.2025',
    linkedin: 'https://www.linkedin.com/in/yacine-ngom-4616a11a3/?originalSubdomain=sn',
  },
]

export const gallery = [
  '/images/event/event1.jpg',
  '/images/event/event2.jpg',
  '/images/event/event3.jpg',
  '/images/event/event4.jpg',
]

export const partners = [
  { name: 'Partenaire 1', logo: '/images/partners/partner1.png' },
  { name: 'Partenaire 2', logo: '/images/partners/partner2.png' },
  { name: 'Partenaire 3', logo: '/images/partners/partner3.png' },
  { name: 'Partenaire 4', logo: '/images/partners/partner4.png' },
  { name: 'Partenaire 5', logo: '/images/partners/partner5.png' },
  { name: 'Partenaire 6', logo: '/images/partners/partner6.png' },
]

// Optional endpoint for collecting feedback (e.g. Formspree). Leave empty to use mailto fallback.
export const feedbackEndpoint = ''

// Organizer contact used as mailto fallback for feedback
export const organizerEmail = 'marketingsolutionscenter.msc@gmail.com'
