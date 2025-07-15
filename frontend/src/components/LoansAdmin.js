'use client'
import { useCallback, useState } from "react";
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, User, useDisclosure } from "@heroui/react";
import TableFunctions from "./TableFunctions";
import { PointsIcon } from "@/components/Icons";
import ModalInfo from "@/components/ModalInfo";
import FinesModal from "./FinesModal";
import { useFines } from "@/hooks/useFines";
import { api } from "@/services/api";

export const columns = [
    { name: "ID", uid: "id" },
    { name: "USUÁRIO", uid: "user" },
    { name: "LIVRO", uid: "book" },
    { name: "CRIADO EM", uid: "createdAt", sortable: true },
    { name: "RETORNO EM", uid: "dueDate", sortable: true },
    { name: "RETORNADO EM", uid: "returnedAt", sortable: true },
    { name: "STATUS", uid: "status" },
    { name: "AÇÕES", uid: "actions" },
];

export default function LoansAdmin({ initialLoans }) {
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [loans, setLoans] = useState(initialLoans);
    const [modalTitle, setModalTitle] = useState('');
    const [modalText, setModalText] = useState('');
    const [actionButtonText, setActionButtonText] = useState('');
    const { fines, fetchFines } = useFines();
    const loanModal = useDisclosure();
    const finesModal = useDisclosure();

    const handleOpenModal = (loan, modalTitle, modalText, actionButtonText) => {
        setSelectedLoan(loan);
        setModalTitle(modalTitle);
        setModalText(modalText);
        setActionButtonText(actionButtonText);
        loanModal.onOpen();
    };

    const handleOpenFinesModal = async (loan) => {
        setSelectedLoan(loan);
        await new Promise((resolve) => setTimeout(resolve, 0));
        await fetchFines(loan.id);
        finesModal.onOpen();
    };

    const fetchLoans = async () => {
        try {
            const res = await api.get("/loans");
            setLoans(res.data);

        } catch (err) {
            console.error("Erro ao atualizar os empréstimos:", err);
        }
    };

    const concludeLoan = async () => {
        const { id } = selectedLoan;

        try {
            await api.patch(`/loans/${id}/conclude`);

            alert('Empréstimo concluído com sucesso.');
            loanModal.onClose();
            await fetchLoans();

        } catch (err) {
            alert('Ocorreu um erro ao concluir o empréstimo.');
        }
    };

    const renderCell = useCallback((loan, columnKey) => {
        const cellValue = loan[columnKey];

        switch (columnKey) {
            case "user":
                return (
                    <User
                        description={loan.userEmail}
                        name={loan.userName}
                    >
                    </User>
                );

            case "book":
                return (
                    <>{loan.bookTitle} ({loan.bookAuthor})</>
                );
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
                                {loan.status === 'Ativo' ?
                                    <DropdownItem key="conclude" onPress={() => handleOpenModal(loan, 'Concluir empréstimo', 'Prosseguir com a conclusão do empréstimo?', 'Sim')}>Concluir</DropdownItem>
                                    :
                                    null
                                }
                                {loan.hasFines ?
                                    <DropdownItem key="delete" onPress={() => handleOpenFinesModal(loan)}>Multas</DropdownItem>
                                    :
                                    null
                                }
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
            <h1 className="text-lg font-semibold mb-4">Empréstimos</h1>

            <TableFunctions
                items={loans}
                columns={columns}
                renderCell={renderCell}
            >
            </TableFunctions>

            <ModalInfo
                isOpen={loanModal.isOpen}
                onOpenChange={loanModal.onOpenChange}
                modalTitle={modalTitle}
                modalText={modalText}
                actionButtonText={actionButtonText}
                actionButtonFunction={concludeLoan}
            />

            <FinesModal
                isOpen={finesModal.isOpen}
                onOpenChange={finesModal.onOpenChange}
                fines={fines}
            />
        </div>
    );
}
