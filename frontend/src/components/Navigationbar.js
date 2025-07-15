'use client'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Input, Dropdown, DropdownMenu, Avatar, Button } from "@heroui/react";
import { AcmeLogo, SearchIcon, BookIcon, LogoutIcon } from "@/components/Icons";
import { useUser } from '@/contexts/UserContext';
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { useEffect, useState } from "react";

export const Navigationbar = () => {
    const { user, setUser } = useUser();
    const { fetchCategories, categories } = useCategories();
    const router = useRouter();
    const [search, setSearch] = useState("");
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        if (e.key === "Enter" && search.trim()) {
            if(router.pathname === '/booklist'){
                router.push(`?search=${encodeURIComponent(search.trim())}`);

            } else router.push(`/booklist?search=${encodeURIComponent(search.trim())}`);
        }
    };

    return (
        <>
            <Navbar isBordered isBlurred={false}>
                <NavbarBrand>
                    <AcmeLogo className="font-bold text-black"/>
                    <p className="font-bold text-black">WebLibrary</p>
                </NavbarBrand>

                <NavbarContent className="hidden sm:flex gap-20 items-center" justify="center">
                    {user?.userType === 'librarian' && (
                        <Dropdown shouldBlockScroll={false}>
                            <NavbarItem>
                                <DropdownTrigger>
                                    <Link
                                        href="#"
                                        color="secondary"
                                    >
                                        Sistema
                                    </Link>
                                </DropdownTrigger>
                            </NavbarItem>

                            <DropdownMenu
                                aria-label="Sistema"
                                itemClasses={{
                                    base: "gap-4",
                                }}
                            >
                                <DropdownItem key="books" href="/books">Livros</DropdownItem>
                                <DropdownItem key="reservations" href="/reservations">Reservas</DropdownItem>
                                <DropdownItem key="loans" href="/loans">Empréstimos</DropdownItem>
                                <DropdownItem key="users" href="/users">Usuários</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    )}

                    <Dropdown shouldBlockScroll={false}>
                        <NavbarItem>
                            <DropdownTrigger>
                                <Link
                                    href="#"
                                    color="primary"
                                >
                                    Categorias
                                </Link>
                            </DropdownTrigger>
                        </NavbarItem>

                        <DropdownMenu
                            aria-label="Categorias"
                            itemClasses={{
                                base: "gap-4",
                            }}
                        >
                            {categories.map((category) => (
                                <DropdownItem key={category.id} href={`/booklist?category=${category.name}`}>
                                    {category.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>

                    <NavbarItem>
                        <Input
                            classNames={{
                                base: "max-w-full h-10 search-input",
                                mainWrapper: "h-full",
                                input: "text-small",
                                inputWrapper:
                                    "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                            }}
                            placeholder="Pesquise por título ou autor"
                            size="sm"
                            startContent={<SearchIcon size={18} />}
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </NavbarItem>
                </NavbarContent>

                <NavbarContent as="div" justify="end">
                    <Dropdown placement="bottom-end" shouldBlockScroll={false}>
                        <DropdownTrigger>
                            <Avatar
                                as="button"
                                className="transition-transform"
                                showFallback
                                src="https://images.unsplash.com/broken"
                                size="sm"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            {user?.userType === 'reader' && (
                                <DropdownItem key="settings" startContent={<BookIcon className={iconClasses} />} href="/myreservations">Minhas reservas</DropdownItem>
                            )}

                            <DropdownItem key="logout" color="danger" startContent={<LogoutIcon className={iconClasses} />}
                                onPress={() => {
                                    localStorage.removeItem('token');
                                    setUser(null);
                                    router.replace('/login');
                                }}
                            >
                                Sair
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            </Navbar>
        </>
    );
};

export default Navigationbar;