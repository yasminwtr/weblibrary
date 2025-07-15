'use client'
import { Card, CardBody, Image, CardHeader } from "@heroui/react";
import StatusChip from "@/components/StatusChip";

export default function ReservationCard({ id, bookTitle, bookAuthor, status, createdAt, expiresAt }) {
    return (
        <Card className="shadow-none border p-2 mb-8">
            <CardHeader className="justify-between">
                <span>Reserva #{id}</span>
                <StatusChip status={status} />
            </CardHeader>

            <hr className="shrink-0 divider" role="separator"/>

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
                        <span className="block font-medium">Data para retirada: <span className="font-normal">{expiresAt}</span></span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
