'use client'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@heroui/react";

export default function FinesModal({ isOpen, onOpenChange, fines }) {
    const columns = [
        {
            key: "createdAt",
            label: "GERADO EM",
        },
        {
            key: "amount",
            label: "VALOR",
        },
    ];

    return (
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            className="modal"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Multas</ModalHeader>

                        <ModalBody>
                            <Table
                                removeWrapper
                                classNames={{
                                    base: "max-h-[400px] overflow-y-scroll scroll-thin",
                                    table: "min-h-[400px]",
                                }}
                            >
                                <TableHeader columns={columns}>
                                    {(column) => (
                                        <TableColumn
                                            key={column.uid}
                                        >
                                            {column.label}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody emptyContent={"Nenhum registro encontrado"} items={fines}>
                                    {(item) => (
                                        <TableRow key={item.id}>
                                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                Fechar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
