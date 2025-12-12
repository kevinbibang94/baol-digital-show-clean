import { motion } from "framer-motion"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}   // état avant apparition (léger zoom arrière + transparent)
      animate={{ opacity: 1, scale: 1 }}      // état une fois affichée (zoom normal + opaque)
      exit={{ opacity: 0, scale: 0.95 }}      // état quand elle disparaît (retour au zoom arrière + transparent)
      transition={{ duration: 0.4, ease: "easeOut" }} // vitesse et fluidité de l’animation
      className="min-h-screen"
    >
      {children}
    </motion.div>
  )
}
