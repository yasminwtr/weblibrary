'use client'
import { useCallback, useState } from "react";
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, User, useDisclosure } from "@heroui/react";
import TableFunctions from "./TableFunctions";
import { PointsIcon } from "@/components/Icons";
import UserModal from "@/components/UserModal";
import { api } from "@/services/api";

export const columns = [
    { name: "ID", uid: "id" },
    { name: "USUÁRIO", uid: "user" },
    { name: "TIPO", uid: "userType" },
    { name: "AÇÕES", uid: "actions" },
];

export default function UsersAdmin({ initialUsers }) {
    const [users, setUsers] = useState(initialUsers);
    const [user, setUser] = useState(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleOpenModal = async (data) => {
        setUser(data);
        await new Promise((resolve) => setTimeout(resolve, 0));
        onOpen();
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data);

        } catch (err) {
            console.error("Erro ao pegar os usuários:", err);
        }
    };

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "user":
                return (
                    <User
                        description={user.email}
                        name={user.name}
                    >
                    </User>
                );
            case "userType":
                if (user.userType == "librarian") return "Bibliotecário"
                if (user.userType == "reader") return "Leitor"
            case "actions":
                return (
                    <div className="relative flex justify-center items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <PointsIcon />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem key="edit" onPress={() => handleOpenModal(user)}>Editar</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="page">
            <h1 className="text-lg font-semibold mb-4">Usuários</h1>

            <TableFunctions
                items={users}
                columns={columns}
                renderCell={renderCell}
                addButton={true}
                handleOpenModal={handleOpenModal}
            >
            </TableFunctions>

            <UserModal
                user={user}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                fetchUsers={fetchUsers}
            />
        </div>
    );
}
