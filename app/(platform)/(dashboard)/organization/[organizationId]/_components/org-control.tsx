"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

export const OrgControl = () => {
  const params = useParams();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) return;

    setActive({
      organization: params.organizationId as string,
    });
  }, [setActive, params.organizationId]);
  
  return null;
};

/* Este componente se fija activamente en nuestra URL y viendo que organizacion esta conectada,
y en caso de cambiar la URL se fijara que organizacion corresponde a la misma y la cambiara.
. Su propósito principal es utilizar el hook useEffect para setear la organizacion activa cuando
cambia el parámetro organizationId en la URL.*/