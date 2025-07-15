'use client'
import { Chip } from "@heroui/react";

export default function StatusChip({ status }) {
    let color = "default";

    if (status === "Pendente") {
        color = "warning";

    } else if (status === "Cancelada" || status === "Expirada") {
        color = "default";

    } else if (status === "Concluída" || status === "Concluído") {
        color = "success";

    } else if (status === "Atrasado") {
        color = "danger";

    } else if (status === "Ativo") {
        color = "primary";
    }

    return <Chip color={color} size="sm" variant="flat">{status}</Chip>;
}
