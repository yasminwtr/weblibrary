'use client'
import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import ReservationCard from "@/components/ReservationCard";
import LoanCard from "@/components/LoanCard";

export default function ReservationsInfo({ userReservationsLoans }) {
    const [selectedStatus, setSelectedStatus] = useState("Todos");

    const filteredItems = userReservationsLoans.filter((item) => {
        if (selectedStatus === "Todos") return true;
        if (selectedStatus === "Concluído") return item.status === "Concluído" || item.status === "Concluída";
        return item.status === selectedStatus;
    });

    return (
        <div className="page flex">
            <div className="sticky top-20 h-fit">
                <Tabs
                    variant="light"
                    color="primary"
                    placement="start"
                    selectedKey={selectedStatus}
                    onSelectionChange={(key) => {
                        setSelectedStatus(key);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="min-h-[200px]"
                >
                    <Tab key="Todos" title="Todos" />
                    <Tab key="Ativo" title="Ativo" />
                    <Tab key="Pendente" title="Pendente" />
                    <Tab key="Atrasado" title="Atrasado" />
                    <Tab key="Concluído" title="Concluído" />
                    <Tab key="Expirada" title="Expirada" />
                    <Tab key="Cancelada" title="Cancelada" />
                </Tabs>
            </div>

            <div className="w-full ml-20">
                {filteredItems.map((item) => {
                    if (item.type === 'reservation') {
                        return <ReservationCard key={`${item.type}-${item.id}`} id={item.id} status={item.status} bookTitle={item.bookTitle} bookAuthor={item.bookAuthor} createdAt={item.createdAt} expiresAt={item.expiresAt} bookImage/>;

                    } else if (item.type === 'loan') {
                        return <LoanCard key={`${item.type}-${item.id}`} id={item.id} status={item.status} bookTitle={item.bookTitle} bookAuthor={item.bookAuthor} createdAt={item.createdAt} dueDate={item.dueDate} returnedAt={item.returnedAt} hasFines={item.hasFines} />;
                    } return null;
                })}
            </div>
        </div>
    );
}
