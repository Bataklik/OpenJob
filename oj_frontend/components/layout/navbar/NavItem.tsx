import {
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function NavItem({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <NavigationMenuItem>
            <NavigationMenuLink asChild>
                <Link href={href} className={navigationMenuTriggerStyle()}>
                    {children}
                </Link>
            </NavigationMenuLink>
        </NavigationMenuItem>
    );
}
