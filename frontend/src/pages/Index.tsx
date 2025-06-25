import React, { useState, useEffect, useMemo } from 'react';
import { Ship, BarChart3, TrendingUp, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import FilterPanel from '@/components/FilterPanel';
import DataTable from '@/components/DataTable';
import Charts from '@/components/Charts';
import { PortActivity, PortRanking, ApiFilters } from '@/types/port';
import { portApi } from '@/services/portApi';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activityData, setActivityData] = useState<PortActivity[]>([]);
  const [rankingData, setRankingData] = useState<PortRanking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ApiFilters>({
    sortBy: 'date',
    sortOrder: 'desc',
    limit: 100,
  });

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [activities, rankings] = await Promise.all([
        portApi.getPortActivity(filters),
        portApi.getTopPortos()
      ]);
      setActivityData(activities.data);
      setRankingData(rankings.data);
    } catch (err) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível obter os dados.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleApplyFilters = async () => {
    setIsLoading(true);
    try {
      const response = await portApi.getPortActivity(filters);
      setActivityData(response.data);
      toast({
        title: "Filtros aplicados",
        description: `${response.data.length} registros encontrados.`,
      });
    } catch (err) {
      toast({
        title: "Erro ao aplicar filtros",
        description: "Houve um problema ao buscar os dados filtrados.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const stats = useMemo(() => {
    const totalVolume = activityData.reduce((sum, item) => sum + item.totalVolume, 0);
    const totalCalls = activityData.reduce((sum, item) => sum + item.vesselCalls, 0);
    const uniquePorts = new Set(activityData.map(item => item.portCode)).size;
    const avgVolume = activityData.length > 0 ? totalVolume / activityData.length : 0;

    return {
      totalVolume,
      totalCalls,
      uniquePorts,
      avgVolume,
      totalRecords: activityData.length,
    };
  }, [activityData]);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('pt-BR').format(value);

  const formatLargeNumber = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return formatNumber(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Ship className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sistema de Análise Portuária</h1>
              <p className="text-gray-600 mt-1">Monitoramento e análise de atividades portuárias globais</p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Volume Total</p>
                  <p className="text-lg font-bold text-blue-600">{formatLargeNumber(stats.totalVolume)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-2">
                <Ship className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Chamadas</p>
                  <p className="text-lg font-bold text-green-600">{formatNumber(stats.totalCalls)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Portos</p>
                  <p className="text-lg font-bold text-orange-600">{stats.uniquePorts}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Média Volume</p>
                  <p className="text-lg font-bold text-purple-600">{formatLargeNumber(stats.avgVolume)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <Badge variant="secondary" className="text-xs">Registros: {stats.totalRecords}</Badge>
                <p className="text-xs text-gray-500 mt-1">Atualização: {new Date().toLocaleDateString('pt-BR')}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={handleApplyFilters}
            isLoading={isLoading}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-400">
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Gráficos
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Ship className="h-4 w-4" /> Tabela de Dados
            </TabsTrigger>
          </TabsList>
          <TabsContent value="charts">
            <Charts activityData={activityData} rankingData={rankingData} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="table">
            <DataTable data={activityData} isLoading={isLoading} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Dados por FMI • Última atualização: 11/11/2024</p>
          <p className="mt-1">Sistema desenvolvido para análise de atividades portuárias globais</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
