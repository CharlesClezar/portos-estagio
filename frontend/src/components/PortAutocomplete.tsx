
import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Port } from '@/types/port';
import portApi from '@/services/portApi';

interface PortAutocompleteProps {
  onSelectPort: (port: Port | null) => void;
  selectedPort?: Port | null;
  placeholder?: string;
}

const PortAutocomplete: React.FC<PortAutocompleteProps> = ({
  onSelectPort,
  selectedPort,
  placeholder = "Buscar porto por nome ou código..."
}) => {
  const [query, setQuery] = useState('');
  const [ports, setPorts] = useState<Port[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (selectedPort) {
      setQuery(`${selectedPort.name} (${selectedPort.code})`);
    }
  }, [selectedPort]);

  useEffect(() => {
    const searchPorts = async () => {
      if (query.length < 2) {
        setPorts([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await portApi.searchPorts(query);
        setPorts(results);
        setShowResults(true);
      } catch (error) {
        console.error('Erro ao buscar portos:', error);
        setPorts([]);
      }
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(searchPorts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelectPort = (port: Port) => {
    setQuery(`${port.name} (${port.code})`);
    setShowResults(false);
    onSelectPort(port);
  };

  const handleClear = () => {
    setQuery('');
    setPorts([]);
    setShowResults(false);
    onSelectPort(null);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-20"
          onFocus={() => query.length >= 2 && setShowResults(true)}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            ×
          </Button>
        )}
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto bg-white shadow-lg">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <span className="ml-2">Buscando...</span>
            </div>
          ) : ports.length > 0 ? (
            <div className="py-2">
              {ports.map((port) => (
                <button
                  key={port.id}
                  onClick={() => handleSelectPort(port)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">{port.name}</div>
                    <div className="text-sm text-gray-500">
                      {port.code} • {port.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              Nenhum porto encontrado
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
};

export default PortAutocomplete;
