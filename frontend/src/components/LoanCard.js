'use client'
import { Card, CardBody, Image, CardHeader, Button, useDisclosure } from "@heroui/react";
import StatusChip from "@/components/StatusChip";
import FinesModal from "@/components/FinesModal";
import { useFines } from "@/hooks/useFines";

export default function LoanCard({ id, bookTitle, bookAuthor, status, createdAt, dueDate, returnedAt, hasFines }) {
    const finesModal = useDisclosure();
    const { fines, fetchFines } = useFines();

    const handleOpenModal = () => {
        fetchFines(id);
        finesModal.onOpen();
    };

    return (
        <Card className="shadow-none border p-2 mb-8">
            <CardHeader className="justify-between">
                <span>Empréstimo #{id}</span>
                <div>
                    {hasFines ? <Button color="primary" size="sm" className="mr-2 sm" onPress={handleOpenModal}>Multas</Button> : null}

                    <StatusChip status={status} />
                </div>


            </CardHeader>

            <hr className="shrink-0 divider" role="separator" />

            <CardBody>
                <div className="flex items-center">
                    <Image
                        height={80}
                        radius="sm"
                        src="https://static.estantevirtual.com.br/book/00/062-9750-000/062-9750-000_detail1.jpg?ts=1712764631610&ims=fit-in/x700/filters:fill(fff):quality(100)"
                        width={60}
                    />

                    <div className="text-sm ml-3 flex flex-col">
                        <span className="font-medium">Livro: <span className="font-normal">{bookTitle} ({bookAuthor})</span></span>
                        <span className="block font-medium my-1">Data de reserva: <span className="font-normal">{createdAt}</span></span>
                        <span className="block font-medium">Data para entrega: <span className="font-normal">{dueDate}</span></span>
                        {returnedAt ? <span className="block font-medium">Data de retorno: <span className="font-normal">{returnedAt}</span></span> : null}
                    </div>
                </div>
            </CardBody>

            <FinesModal
                isOpen={finesModal.isOpen}
                onOpenChange={finesModal.onOpenChange}
                fines={fines} />
        </Card>
    );
}
