'use client'
import { useState, useEffect } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Form, Input, RadioGroup, Radio } from "@heroui/react";
import { api } from "@/services/api";

const formInitialValues = {
    name: "",
    email: "",
    password: "",
    type: "reader"
}

export default function UserModal({ isOpen, onOpenChange, user, fetchUsers }) {
    const [errors, setErrors] = useState({});
    const [formValues, setFormValues] = useState(formInitialValues);

    useEffect(() => {
        if (user) {
            setFormValues({
                name: user.name,
                email: user.email,
                type: user.userType
            });

        } else {
            setFormValues(formInitialValues);
        }
    }, [user]);

    const onSubmit = async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        const newErrors = {};

        if (!data.name) newErrors.name = "O nome é obrigatório.";
        if (!data.email) newErrors.email = "O e-mail é obrigatório.";
        if (!user && !data.password) newErrors.password = "A senha é obrigatória.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        try {
            const payload = {
                name: data.name,
                email: data.email,
                ...(user ? {} : { password: data.password }),
                ...(user ? {} : { userType: data.type })
            };

            if (user) {
                await api.patch(`/users/${user.id}`, payload);
                alert("Usuário atualizado com sucesso.");

            } else {
                await api.post("/users", payload);
                alert("Usuário criado com sucesso.");
            }

            fetchUsers();
            setFormValues(formInitialValues);
            onOpenChange(false);

        } catch (err) {
            console.error("Erro ao salvar:", err);
            alert(err.response?.data?.error || "Erro ao salvar.");
        }
    };

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
                        <ModalHeader className="flex flex-col gap-1">{user ? 'Editar usuário' : 'Adicionar usuário'}</ModalHeader>

                        <ModalBody>
                            <Form
                                className="w-full max-w-xs flex flex-col gap-6 mb-4"
                                style={{ minWidth: '100%' }}
                                validationErrors={errors}
                                onSubmit={onSubmit}
                                id="user-form"
                            >
                                <RadioGroup
                                    value={formValues.type}
                                    onValueChange={(val) => setFormValues((f) => ({ ...f, type: val }))}
                                    orientation="horizontal"
                                    size="sm"
                                    isDisabled={!!user}
                                    name="type"
                                >
                                    <Radio value="reader">Leitor</Radio>
                                    <Radio value="librarian">Bibliotecário</Radio>
                                </RadioGroup>

                                <Input
                                    label="Nome"
                                    labelPlacement="outside"
                                    name="name"
                                    placeholder="Nome"
                                    defaultValue={formValues.name}
                                    onChange={(e) => setFormValues((f) => ({ ...f, name: e.target.value }))}
                                />

                                <Input
                                    label="E-mail"
                                    labelPlacement="outside"
                                    name="email"
                                    placeholder="email@email.com"
                                    type="email"
                                    defaultValue={formValues.email}
                                    onChange={(e) => setFormValues((f) => ({ ...f, email: e.target.value }))}
                                />

                                {!user && (
                                    <Input
                                        label="Senha"
                                        labelPlacement="outside"
                                        name="password"
                                        placeholder="••••••"
                                        type="password"
                                        onChange={(e) => setFormValues((f) => ({ ...f, password: e.target.value }))}
                                    />
                                )}
                            </Form>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                Cancelar
                            </Button>

                            <Button color="primary" type="submit" form="user-form">
                                Salvar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
