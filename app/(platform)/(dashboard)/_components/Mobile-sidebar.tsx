"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import { Sidebar } from "./Sidebar";

export const MobileSidebar = () => {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    const onOpen = useMobileSidebar((state) => state.onOpen);
    const onClose = useMobileSidebar((state) => state.onClose);
    const isOpen = useMobileSidebar((state) => state.isOpen);

    //Este useEfect se fija si el componente esta montado o no (estado): remoendacion a leer https://www.joshwcomeau.com/react/the-perils-of-rehydration/
    useEffect(() => {
        setIsMounted(true);
    }, []);

    //Esto permitira que cada vez que se cambie la URL se cierre este sidebar
    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <Button
                onClick={onOpen}
                className="block md:hidden mr-2"
                variant="ghost"
                size="sm"
            >
                <Menu className="h-4 w-4" />
            </Button>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent
                    side="left"
                    className="p-2 pt-10"
                >
                <Sidebar
                    storageKey="t-sidebar-mobile-state"
                />
                </SheetContent>
            </Sheet>
        </>
    );
};