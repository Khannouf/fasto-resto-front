import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ScrollArea, ScrollBar } from '../../components/ui/scroll-area';
import CartItem from '../../components/cardItem';
import CardItem from '../../components/cardItem';

function RestaurantMenu() {
    const location = useLocation();
    const params = useParams()


    //remplacer par appelle a api
    const categories = [
        { id: 1, name: "Plats" },
        { id: 2, name: "Boissons" },
        { id: 3, name: "Desserts" },
        { id: 4, name: "tex-mexs" },
        { id: 5, name: "salades" },
        { id: 6, name: "Viandes" }
    ];

    //remplacer par appelle a api
    const items = [
        {
            id: 1,
            imageUrl: "https://via.placeholder.com/150",
            name: "Pizza Margherita",
            description: "Pizza traditionnelle avec sauce tomate, mozzarella et basilic.",
            categorieid: 1,
            price: 9.99,
            ingredients: [
                { ingredientId: 1, quantity: '1' }, // Exemple de DishIngredientDto
                { ingredientId: 2, quantity: '2' }
            ]
        },
        {
            id: 2,
            imageUrl: "https://via.placeholder.com/150",
            name: "Burger Classique",
            description: "Burger avec steak haché, cheddar, salade et tomate.",
            categorieid: 2,
            price: 12.5,
            ingredients: [
                { ingredientId: 3, quantity: '1' },
                { ingredientId: 4, quantity: '1' }
            ]
        },
        {
            id: 3,
            imageUrl: "https://via.placeholder.com/150",
            name: "Salade César",
            description: "Salade avec poulet grillé, parmesan et croûtons.",
            categorieid: 3,
            price: 8.75,
            ingredients: [
                { ingredientId: 5, quantity: '2' },
                { ingredientId: 6, quantity: '3' }
            ]
        },
        {
            id: 2,
            imageUrl: "https://via.placeholder.com/150",
            name: "Pizza Margherita",
            description: "Pizza traditionnelle avec sauce tomate, mozzarella et basilic.",
            categorieid: 1,
            price: 9.99,
            ingredients: [
                { ingredientId: 1, quantity: '2' }, // Exemple de DishIngredientDto
                { ingredientId: 2, quantity: '1' }
            ]
        },
    ];


    const [activeCategory, setActiveCategory] = useState<number>(categories[0].id);
    const filteredItems = items.filter((item) => item.categorieid === activeCategory);

    useEffect(() => {
        console.log(activeCategory);

    }, [activeCategory])


    return (
        <>
            <div className='bg-[#D9D9D9] w-full h-12 fixed top-0 flex items-center justify-start'>
                <Link to={`/restaurant/${params.idResto}`} className='text-black'>
                    <ArrowLeft className='ml-5' />
                </Link>
                <p className="text-xl font-bold ml-5 mb-1">Nom Restaurant</p>
            </div>

            <div className='w-full h-16 fixed top-12 flex items-center justify-start bg-white'>
                <ScrollArea className="w-full">
                    <div className="flex w-max space-x-2 px-4 py-2">
                        {categories.map((categorie) => (
                            <button
                                key={categorie.id}
                                onClick={() => setActiveCategory(categorie.id)}
                                className={`text-sm font-medium px-4 py-2 transition-all rounded-full ${activeCategory === categorie.id
                                    ? 'bg-red-500 text-white'
                                    : 'bg-[#FFD5D5] text-black'
                                    }`}
                            >
                                {categorie.name}
                            </button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className='hidden' />
                </ScrollArea>
            </div>
            <div className='w-full h-[75%] fixed top-28 flex items-center justify-start'>
                <ScrollArea className="w-full h-full">
                    <div className="flex flex-col gap-4 p-4">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <CardItem
                                    key={item.id}
                                    idResto={params.idResto!}
                                    idElement={item.id}
                                    imageUrl={item.imageUrl}
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                    categorieId={item.categorieid}
                                    ingredients={item.ingredients}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Aucun élément dans cette catégorie.</p>
                        )}

                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </div>

        </>
    )
}

export default RestaurantMenu
