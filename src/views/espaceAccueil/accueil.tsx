import React from 'react';
import { motion } from 'framer-motion';

const Accueil: React.FC = () => {
    return (
        <div className="accueil">
            {/* Hero Section */}
            <motion.section
                className="hero text-center py-16 min-h-[85vh] flex flex-col justify-center items-center w-[95vw] mx-auto mt-3 rounded-xl"
                style={{
                    backgroundImage: "url('public/imgRestauAccueil.jpg')", // Remplacez par le chemin de votre image
                    backgroundSize: "cover", // Assure que l'image couvre toute la section
                    backgroundPosition: "center", // Centre l'image
                    backgroundRepeat: "no-repeat", // Empêche la répétition de l'image
                }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <motion.div className="backdrop-blur-md bg-white/30 p-5 rounded-lg">
                    <h1 className="text-4xl font-bold mb-4">Créez votre menu digital en quelques clics</h1>
                    <p className="text-lg text-gray-700 mb-6">
                        Générez des QR codes pour vos clients et gérez votre restaurant avec un tableau de bord personnalisé.
                    </p>
                    <motion.button
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Commencer gratuitement
                    </motion.button>
                </motion.div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                id="features"
                className="features py-16 bg-white min-h-screen flex flex-col justify-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">Fonctionnalités principales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <motion.div className="feature p-4  rounded-lg" initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}>
                            <img
                                src="public/imgRestauAccueil.jpg"
                                alt="Feature 1"
                                className="mx-auto mb-4 rounded-xl"
                            />
                            <h3 className="text-xl font-bold mb-2">Création de menus</h3>
                            <p className="text-gray-600">Ajoutez vos plats et boissons facilement dans notre outil.</p>
                        </motion.div>
                        <motion.div className="feature p-4  rounded-lg" initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}>
                            <img
                                src="public/imgRestauAccueil.jpg"
                                alt="Feature 2"
                                className="mx-auto mb-4 rounded-xl"
                            />
                            <h3 className="text-xl font-bold mb-2">Génération de QR codes</h3>
                            <p className="text-gray-600">Permettez à vos clients de commander directement depuis leur téléphone.</p>
                        </motion.div>
                        <motion.div className="feature p-4  rounded-lg" initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}>
                            <img
                                src="public/imgRestauAccueil.jpg"
                                alt="Feature 3"
                                className="mx-auto mb-4 rounded-xl"
                            />
                            <h3 className="text-xl font-bold mb-2">Tableau de bord</h3>
                            <p className="text-gray-600">Suivez vos commandes et performances en temps réel.</p>
                        </motion.div>
                        <motion.div className="feature p-4  rounded-lg" initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}>
                            <img
                                src="public/imgRestauAccueil.jpg"
                                alt="Feature 4"
                                className="mx-auto mb-4 rounded-xl"
                            />
                            <h3 className="text-xl font-bold mb-2">Support client</h3>
                            <p className="text-gray-600">Profitez d'une assistance dédiée pour vos besoins.</p>
                        </motion.div>
                    </div>
                </div>
            </motion.section >

            {/* Pricing Section */}
            <motion.section
    id="pricing"
    className="pricing py-16 bg-gray-100 min-h-screen flex flex-col justify-center"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
>
    <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Nos Tarifs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="pricing-card p-6 border rounded-lg bg-white shadow-lg">
                <h3 className="text-xl font-bold mb-4">Basic</h3>
                <p className="text-gray-600 mb-4">Idéal pour les petits restaurants.</p>
                <p className="text-2xl font-bold mb-4">€19/mois</p>
                <ul className="text-left mb-4">
                    <li className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">✓</span> Création de menus
                    </li>
                    <li className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">✓</span> Génération de QR codes
                    </li>
                    <li className="flex items-center mb-2">
                        <span className="text-red-500 mr-2">✗</span> Plus de choix de templates et couleurs
                    </li>
                    <li className="flex items-center">
                        <span className="text-red-500 mr-2">✗</span> Gestion des stocks
                    </li>
                </ul>
                <motion.button
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Choisir
                </motion.button>
            </div>

            {/* Pro Plan */}
            <div className="pricing-card p-6 border rounded-lg bg-white shadow-lg">
                <h3 className="text-xl font-bold mb-4">Pro</h3>
                <p className="text-gray-600 mb-4">Pour les restaurants en pleine croissance.</p>
                <p className="text-2xl font-bold mb-4">€49/mois</p>
                <ul className="text-left mb-4">
                    <li className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">✓</span> Création de menus
                    </li>
                    <li className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">✓</span> Génération de QR codes
                    </li>
                    <li className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">✓</span> Plus de choix de templates et couleurs
                    </li>
                    <li className="flex items-center">
                        <span className="text-red-500 mr-2">✗</span> Gestion des stocks
                    </li>
                </ul>
                <motion.button
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Choisir
                </motion.button>
            </div>

            {/* Enterprise Plan */}
            <div className="pricing-card p-6 border rounded-lg bg-white shadow-lg">
                <h3 className="text-xl font-bold mb-4">Enterprise</h3>
                <p className="text-gray-600 mb-4">Pour les grandes chaînes de restaurants.</p>
                <p className="text-2xl font-bold mb-4">€99/mois</p>
                <ul className="text-left mb-4">
                    <li className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">✓</span> Création de menus
                    </li>
                    <li className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">✓</span> Génération de QR codes
                    </li>
                    <li className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">✓</span> Plus de choix de templates et couleurs
                    </li>
                    <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span> Gestion des stocks
                    </li>
                </ul>
                <motion.button
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Choisir
                </motion.button>
            </div>
        </div>
    </div>
</motion.section>

            {/* Demo Section */}
            <motion.section
                id="demo"
                className="demo py-16 bg-gray-100 min-h-screen flex flex-col justify-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">Découvrez notre outil en action</h2>
                    <motion.img
                        src="https://via.placeholder.com/800x400"
                        alt="Demo"
                        className="mx-auto rounded-lg shadow-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    />
                </div>
            </motion.section >

            {/* Call-to-Action Section */}
            <motion.section
                className="cta py-16 bg-red-600 text-white text-center min-h-screen flex flex-col justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl font-bold mb-4">Prêt à transformer votre restaurant ?</h2>
                <motion.button
                    className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Inscrivez-vous maintenant
                </motion.button>
            </motion.section >
        </div >
    );
};

export default Accueil;