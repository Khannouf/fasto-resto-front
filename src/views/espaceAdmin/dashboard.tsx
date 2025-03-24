import { motion } from "framer-motion"

function Dashboard() {
  return (
    <div className="h-screen flex flex-col ">
      <h1 className="ml-5 mt-5 mb-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl">
        Dashboard
      </h1>
      <div className="ml-5 rounded-lg bg-[#efefef] flex-1 p-5 grid grid-cols-1 sm:grid-cols-1  md:grid-cols-4 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200 }} className="bg-white p-4 md:p-5 rounded-lg shadow-md flex flex-col justify-between">
          <p className="text-sm md:text-xl text-gray-600">
            Nombre de commande / jour
          </p>
          <p className="text-2xl md:text-3xl font-bold">65</p>
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300 text-xs md:text-sm">
              + 15
            </span>
            <span className="text-xs font-bold md:text-sm">
              Comparé au jour précédent
            </span>
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200 }} className="bg-white p-4 md:p-5 rounded-lg shadow-md flex flex-col justify-between">
          <p className="text-sm md:text-xl text-gray-600">
            Nombre de commande / mois
          </p>
          <p className="text-2xl md:text-3xl font-bold">1523</p>
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300 md:text-sm">
              - 15
            </span>
            <span className="text-xs font-bold md:text-sm">
              Comparé au mois précédent
            </span>
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200 }} className="bg-white p-4 md:p-5 rounded-lg shadow-md h-32 md:h-auto md:col-span-2"></motion.div>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200 }} className="bg-white p-4 md:p-5 rounded-lg shadow-md h-32 md:h-auto md:col-span-2"></motion.div>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200 }} className="bg-white p-4 md:p-5 rounded-lg shadow-md flex flex-col justify-between md:col-span-2">
          <p className="text-sm text-gray-600">Revenus du mois</p>
          <p className="text-2xl md:text-3xl font-bold">1523.00 €</p>
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300 md:text-sm">
              - 155.00 €
            </span>
            <span className="text-xs font-bold md:text-sm">
              Comparé au mois précédent
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
