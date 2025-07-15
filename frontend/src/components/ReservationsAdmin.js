'use client'
import { useCallback, useState } from "react";
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, User, useDisclosure } from "@heroui/react";
import TableFunctions from "@/components/TableFunctions";
import { PointsIcon } from "@/components/Icons";
import ModalInfo from "@/components/ModalInfo";
import { api } from "@/services/api";

export const columns = [
    { name: "ID", uid: "id" },
    { name: "USUÁRIO", uid: "user" },
    { name: "LIVRO", uid: "book" },
    { name: "CRIADO EM", uid: "createdAt", sortable: true },
    { name: "EXPIRA EM", uid: "expiresAt", sortable: true },
    { name: "STATUS", uid: "status" },
    { name: "AÇÕES", uid: "actions" },
];

export default function ReservationsAdmin({ initialReservations }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [reservations, setReservations] = useState(initialReservations);
    const [modalTitle, setModalTitle] = useState('');
    const [modalText, setModalText] = useState('');
    const [actionButtonText, setActionButtonText] = useState('');
    const [type, setType] = useState('');

    const handleOpenModal = (reservation, modalTitle, modalText, actionButtonText, type) => {
        setSelectedReservation(reservation);
        setModalTitle(modalTitle);
        setModalText(modalText);
        setActionButtonText(actionButtonText);
        setType(type);
        onOpen();
    };

    const fetchReservations = async () => {
        try {
            const res = await api.get("/reservations");
            setReservations(res.data);
        } catch (err) {
            console.error("Erro ao atualizar as reservas:", err);
        }
    };

    const changeReservation = async () => {
        const { id, userId, bookId } = selectedReservation;

        try {
            if (type === 'cancel') {
                await api.patch(`/reservations/${id}/cancel`);
                alert('Reserva cancelada com sucesso.');

            } else if (type === 'conclude') {
                await api.patch(`/reservations/${id}/conclude`, { userId, bookId });
                alert('Reserva concluída com sucesso e um empréstimo foi criado.');
            }

            onClose();
            await fetchReservations();

        } catch (err) {
            alert('Ocorreu um erro ao concluir a reserva.');
        }
    };

    const renderCell = useCallback((reservation, columnKey) => {
        const cellValue = reservation[columnKey];

        switch (columnKey) {
            case "user":
                return (
                    <User
                        description={reservation.userEmail}
                        name={reservation.userName}
                    >
                    </User>
                );

            case "book":
                return (
                    <>{reservation.bookTitle} ({reservation.bookAuthor})</>
                );
            case "actions":
                return (
                    <div className="relative flex justify-center items-center gap-2">
                        {reservation.status === 'Pendente' ?
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button isIconOnly size="sm" variant="light">
                                        <PointsIcon />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem key="conclude" onPress={() => handleOpenModal(reservation, 'Concluir reserva', 'Ao concluir uma reserva será criado um empréstimo para o usuário do livro. Prosseguir?', 'Sim', 'conclude')}>Concluir</DropdownItem>
                                    <DropdownItem key="cancel" onPress={() => handleOpenModal(reservation, 'Cancelar reserva', 'Ao cancelar uma reserva o usuário não poderá fazer a retirada do livro, apenas se abrir outra solicitação. Prosseguir?', 'Sim', 'cancel')}>Cancelar</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            :
                            <></>
                        }
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="page">
            <h1 className="text-lg font-semibold mb-4">Reservas</h1>

            <TableFunctions
                items={reservations}
                columns={columns}
                renderCell={renderCell}
            >
            </TableFunctions>

            <ModalInfo
                isOpen={isOpen} onOpenChange={onOpenChange} modalTitle={modalTitle} modalText={modalText} actionButtonText={actionButtonText} actionButtonFunction={changeReservation}
            />
        </div>
    );
}
