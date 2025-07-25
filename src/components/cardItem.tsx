import { Card, CardContent } from "../components/ui/card"
import { Link } from "react-router-dom"

type CardItemProps = {
    idResto: string;
    idElement: number;
    idTable: number;
    imageUrl: string;
    name: string;
    description: string;
    price: number
    categorieId: number;
    ingredients: Ingredients[]
};

type Ingredients = {
    ingredientId: number;
    quantity: string
}

function CardItem({ idResto, idElement, idTable , imageUrl, name, description, price}: CardItemProps) {

    return (
        <Link to={`/restaurant/${idResto}/${idTable}/element/${idElement}`}>
            <Card className="w-full max-w-3xl h-40 flex items-center p-4 shadow-md">
                {/* Image à gauche */}
                <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                    <img
                        src={imageUrl}
                        alt="Image"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Contenu texte */}
                <CardContent className="flex-1 px-4 py-2">
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-gray-600">
                        {description}
                    </p>
                </CardContent>
                <h2 className="text-lg font-semibold"> {price}</h2>
            </Card>
        </Link>
    )
}

export default CardItem
