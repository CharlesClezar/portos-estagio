import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApiFilters } from '@/types/port';

interface Props {
  filters: ApiFilters;
  onFiltersChange: (filters: ApiFilters) => void;
  onApplyFilters: () => void;
  isLoading: boolean;
}

const FilterPanel: React.FC<Props> = ({ filters, onFiltersChange, onApplyFilters, isLoading }) => {
  const handleChange = (key: keyof ApiFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="startDate">Data Início</Label>
          <Input
            type="date"
            id="startDate"
            value={filters.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="endDate">Data Fim</Label>
          <Input
            type="date"
            id="endDate"
            value={filters.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="portCode">Código do Porto</Label>
          <Input
            id="portCode"
            placeholder="Ex: BRSSZ"
            value={filters.portCode || ''}
            onChange={(e) => handleChange('portCode', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="vesselType">Tipo de Embarcação</Label>
          <Select
            value={filters.vesselType || ''}
            onValueChange={(value) => handleChange('vesselType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="container">Container</SelectItem>
              <SelectItem value="bulk">Granel</SelectItem>
              <SelectItem value="tanker">Tanque</SelectItem>
              <SelectItem value="other">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onApplyFilters} disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Aplicar Filtros'}
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
