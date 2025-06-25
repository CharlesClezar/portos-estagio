
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PortActivity } from '@/types/port';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DataTableProps {
  data: PortActivity[];
  isLoading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ data, isLoading = false }) => {
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getVolumeColor = (volume: number) => {
    if (volume > 40000) return 'bg-green-100 text-green-800';
    if (volume > 25000) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados de Atividade Portuária</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-600">Carregando dados...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Dados de Atividade Portuária
          <Badge variant="secondary">{data.length} registros</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Nenhum dado encontrado para os filtros selecionados.</p>
            <p className="text-sm mt-2">Tente ajustar os critérios de busca.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Porto</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead className="text-right">Chamadas</TableHead>
                  <TableHead className="text-right">Vol. Container</TableHead>
                  <TableHead className="text-right">Vol. Granel</TableHead>
                  <TableHead className="text-right">Vol. Líquido</TableHead>
                  <TableHead className="text-right">Vol. Total</TableHead>
                  <TableHead>Tipos de Embarcação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((activity) => (
                  <TableRow key={activity.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {formatDate(activity.date)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{activity.portName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.portCode}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(activity.vesselCalls)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-blue-600">
                      {formatNumber(activity.containerVolume)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-orange-600">
                      {formatNumber(activity.bulkVolume)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-purple-600">
                      {formatNumber(activity.liquidVolume)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={getVolumeColor(activity.totalVolume)}>
                        {formatNumber(activity.totalVolume)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {activity.vesselTypes.container > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Container: {activity.vesselTypes.container}
                          </Badge>
                        )}
                        {activity.vesselTypes.bulk > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Granel: {activity.vesselTypes.bulk}
                          </Badge>
                        )}
                        {activity.vesselTypes.tanker > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Tanque: {activity.vesselTypes.tanker}
                          </Badge>
                        )}
                        {activity.vesselTypes.other > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Outros: {activity.vesselTypes.other}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;
