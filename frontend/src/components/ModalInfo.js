'use client'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";

export default function ModalInfo({ isOpen, onOpenChange, modalTitle, modalText, actionButtonText, actionButtonFunction }) {
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
                        <ModalHeader className="flex flex-col gap-1">{modalTitle}</ModalHeader>

                        <ModalBody>
                            <p>{modalText}</p>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                Cancelar
                            </Button>

                            <Button color="primary" onPress={actionButtonFunction}>
                                {actionButtonText}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
