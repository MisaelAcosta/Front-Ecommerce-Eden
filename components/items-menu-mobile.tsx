import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

const ItemsMenuMobile = () => {
    return (
        <Popover>
            <PopoverTrigger>
                <Menu></Menu>
            </PopoverTrigger>
            <PopoverContent>
                <Link href="/Products" className="block">Productos</Link>
                <Link href="/Products"className="block">Servicios</Link>
                <Link href="/Products"className="block">Quienes somos?</Link>
            </PopoverContent>
        </Popover>
    );
};

export default ItemsMenuMobile;