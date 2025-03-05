
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { earnApi } from '@/services/earnApi';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_API_CONFIG, API_FEATURES } from '@/config/api';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface ApiConfigPanelProps {
  onConfigChange?: (config: { useMockData: boolean }) => void;
}

export const ApiConfigPanel = ({ onConfigChange }: ApiConfigPanelProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [useMockData, setUseMockData] = useState(DEFAULT_API_CONFIG.useMockData);
  const [baseUrl, setBaseUrl] = useState(DEFAULT_API_CONFIG.baseUrl);
  const [apiKey, setApiKey] = useState(DEFAULT_API_CONFIG.apiKey);
  const [features, setFeatures] = useState({ ...API_FEATURES });

  // Initialize with current earnApi settings
  useEffect(() => {
    // This effect only runs once to sync the UI with the current API settings
  }, []);

  const handleToggleMockData = (enabled: boolean) => {
    setUseMockData(enabled);
    if (onConfigChange) {
      onConfigChange({ useMockData: enabled });
    }
  };

  const updateFeature = (feature: string, enabled: boolean) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: enabled
    }));
  };

  const applyChanges = () => {
    try {
      earnApi.updateConfig({
        baseUrl,
        apiKey,
        useMockData,
        features
      });
      
      toast({
        title: "API Configuration Updated",
        description: `API is now ${useMockData ? 'using mock data' : 'connecting to real API'}`,
      });
    } catch (error) {
      toast({
        title: "Failed to Update API Configuration",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const resetToDefaults = () => {
    setBaseUrl(DEFAULT_API_CONFIG.baseUrl);
    setApiKey(DEFAULT_API_CONFIG.apiKey);
    setUseMockData(DEFAULT_API_CONFIG.useMockData);
    setFeatures({ ...API_FEATURES });
    
    earnApi.updateConfig({
      baseUrl: DEFAULT_API_CONFIG.baseUrl,
      apiKey: DEFAULT_API_CONFIG.apiKey,
      useMockData: DEFAULT_API_CONFIG.useMockData,
      features: API_FEATURES
    });
    
    toast({
      title: "API Configuration Reset",
      description: "All API settings have been reset to defaults",
    });
    
    if (onConfigChange) {
      onConfigChange({ useMockData: DEFAULT_API_CONFIG.useMockData });
    }
  };

  return (
    <Card className="mb-6 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center justify-between">
          <span>API Configuration</span>
          <Switch
            id="mock-data-toggle"
            checked={useMockData}
            onCheckedChange={handleToggleMockData}
          />
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {useMockData 
            ? "Using mock data (for presentation)" 
            : "Connected to real API"}
        </div>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center justify-between w-full">
              <span>Advanced Configuration</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="base-url">API Base URL</Label>
              <Input
                id="base-url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                placeholder="Enter your API key"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="block mb-2">Feature Toggles</Label>
              <div className="space-y-2">
                {Object.entries(features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <Label htmlFor={`feature-${feature}`} className="cursor-pointer">
                      {feature.charAt(0).toUpperCase() + feature.slice(1)} API
                    </Label>
                    <Switch
                      id={`feature-${feature}`}
                      checked={enabled}
                      onCheckedChange={(checked) => updateFeature(feature, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={resetToDefaults}>
                Reset to Defaults
              </Button>
              <Button onClick={applyChanges}>
                Apply Changes
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
