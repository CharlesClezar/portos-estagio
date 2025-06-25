
import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PortActivity, PortRanking } from '@/types/port';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChartsProps {
  activityData: PortActivity[];
  rankingData: PortRanking[];
  isLoading?: boolean;
}

const Charts: React.FC<ChartsProps> = ({ activityData, rankingData, isLoading = false }) => {
  // Preparar dados para gráfico de volume por tempo
  const volumeOverTime = activityData
    .slice(0, 30) // Últimos 30 registros para melhor visualização
    .map(item => ({
      date: format(new Date(item.date), 'dd/MM', { locale: ptBR }),
      fullDate: item.date,
      container: item.containerVolume,
      granel: item.bulkVolume,
      liquido: item.liquidVolume,
      total: item.totalVolume,
      chamadas: item.vesselCalls,
      porto: item.portName,
    }));

  // Preparar dados para gráfico de tipos de embarcação
  const vesselTypeData = activityData.reduce((acc, item) => {
    acc.container += item.vesselTypes.container;
    acc.bulk += item.vesselTypes.bulk;
    acc.tanker += item.vesselTypes.tanker;
    acc.other += item.vesselTypes.other;
    return acc;
  }, { container: 0, bulk: 0, tanker: 0, other: 0 });

  const pieData = [
    { name: 'Porta-contêineres', value: vesselTypeData.container, color: '#3B82F6' },
    { name: 'Graneleiros', value: vesselTypeData.bulk, color: '#F59E0B' },
    { name: 'Navios-tanque', value: vesselTypeData.tanker, color: '#8B5CF6' },
    { name: 'Outros', value: vesselTypeData.other, color: '#10B981' },
  ].filter(item => item.value > 0);

  // Preparar dados de ranking para gráfico de barras
  const topPortsData = rankingData.slice(0, 10).map(port => ({
    name: port.portCode,
    fullName: port.portName,
    volume: port.totalVolume,
    country: port.country,
  }));

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium">{`Data: ${label}`}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }}>
              {`${item.name}: ${formatNumber(item.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.payload.color }}>
            Quantidade: {formatNumber(data.value)}
          </p>
          <p className="text-sm text-gray-600">
            {((data.value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (activityData.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12 text-gray-500">
          <p>Nenhum dado disponível para gerar gráficos.</p>
          <p className="text-sm mt-2">Selecione um porto e período para visualizar os dados.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Volume ao Longo do Tempo */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Volume de Carga ao Longo do Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={volumeOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="container"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
                name="Container"
              />
              <Area
                type="monotone"
                dataKey="granel"
                stackId="1"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.6}
                name="Granel"
              />
              <Area
                type="monotone"
                dataKey="liquido"
                stackId="1"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
                name="Líquido"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Chamadas de Embarcação */}
      <Card>
        <CardHeader>
          <CardTitle>Chamadas de Embarcação</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={volumeOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="chamadas"
                stroke="#10B981"
                strokeWidth={2}
                name="Chamadas"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Tipos de Embarcação */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Tipo de Embarcação</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ranking de Portos */}
      {topPortsData.length > 0 && (
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Top 10 Portos por Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPortsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={formatNumber} />
                <YAxis dataKey="name" type="category" width={60} />
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    formatNumber(value),
                    props.payload.fullName
                  ]}
                />
                <Bar dataKey="volume" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Charts;
