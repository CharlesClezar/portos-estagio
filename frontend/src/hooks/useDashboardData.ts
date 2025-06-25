import { useQuery } from "@tanstack/react-query";
import * as api from "../services/api";

export const useResumo = () =>
  useQuery({ queryKey: ["resumo"], queryFn: api.getResumo });

export const useTipos = () =>
  useQuery({ queryKey: ["tipos"], queryFn: api.getDistribuicaoTipos });

export const useTopPortos = () =>
  useQuery({ queryKey: ["topPortos"], queryFn: api.getTopPortos });

export const useVolumeDiario = (start: string, end: string, portid?: string) =>
  useQuery({
    queryKey: ["volume", start, end, portid],
    queryFn: () => api.getVolumeDiario(start, end, portid),
  });

export const useChamadasDiarias = (start: string, end: string, portid?: string) =>
  useQuery({
    queryKey: ["chamadas", start, end, portid],
    queryFn: () => api.getChamadasDiarias(start, end, portid),
  });
