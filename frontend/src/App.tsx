import React, { useState, useEffect, useRef } from 'react';
import { MainHeader } from './components/MainHeader';
import { SidebarNav, ScreenId } from './components/SidebarNav';
import { FarmCreationModal } from './components/FarmCreationModal';
import { MainMenuModal } from './components/MainMenuModal';

// Screens
import { FarmView } from './screens/FarmView';
import { ClimateLabView } from './screens/ClimateLabView';
import { SatelliteLabView } from './screens/SatelliteLabView';
import { AiCenterView } from './screens/AiCenterView';
import { AiOptimizationView } from './screens/AiOptimizationView';
import { ScalabilityView } from './screens/ScalabilityView';
import { ConnectivityView } from './screens/ConnectivityView';
import { WhatIfView } from './screens/WhatIfView';
import { ResearchAblationView } from './screens/ResearchAblationView';
import { AnalyticsView } from './screens/AnalyticsView';
import { ProfessorDemoView } from './screens/ProfessorDemoView';
import { SeasonReportView } from './screens/SeasonReportView';
import { AboutHelpView } from './screens/AboutHelpView';

import { FarmZone, ConnectivityStatus, ActionType } from './types';
import { api } from './services/api';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('farm');
  const [isMainMenuOpen, setIsMainMenuOpen] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Core Simulation State
  const [day, setDay] = useState<number>(1);
  const [seasonLength] = useState<number>(120);
  const [farmSize, setFarmSize] = useState<number>(100);
  const [crop, setCrop] = useState<string>('Rice');
  const [summary, setSummary] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [connectivity, setConnectivity] = useState<ConnectivityStatus>('GOOD');
  const [activeModel, setActiveModel] = useState<string>('STANDARD');
  const [compute, setCompute] = useState<any>(null);
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const [zones, setZones] = useState<FarmZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<FarmZone | null>(null);

  // Playback Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const timerRef = useRef<any>(null);

  // Initial load
  useEffect(() => {
    fetchFarmState();
  }, []);

  // Time Progression Loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(100, Math.floor(1000 / speed));
      timerRef.current = setInterval(() => {
        handleStepSimulation(1);
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, day]);

  const fetchFarmState = async () => {
    try {
      const state = await api.getFarmState();
      setSummary(state.summary);
      setDay(state.summary.current_day);
      setFarmSize(state.summary.farm_size);
      setCrop(state.summary.crop_type);
      setWeather(state.weather);
      setConnectivity(state.connectivity as ConnectivityStatus);
      setActiveModel(state.active_model);
      setCompute(state.compute);
      setActiveEvents(state.active_events);
      setZones(state.cells);
      if (selectedZone) {
        // Keep selected zone updated
        const updated = state.cells.find((z: any) => z.zone_id === selectedZone.zone_id);
        if (updated) setSelectedZone(updated);
      }
    } catch (e) {
      console.error('Failed to fetch farm state:', e);
    }
  };

  const handleStepSimulation = async (daysToStep: number = 1) => {
    try {
      await api.stepSimulation(daysToStep);
      await fetchFarmState();
    } catch (e) {
      console.error('Step error:', e);
    }
  };

  const handleApplyDecision = async (actionType: ActionType, zoneId?: number) => {
    try {
      const res = await api.applyDecision(actionType, zoneId);
      if (res.zone && selectedZone && selectedZone.zone_id === res.zone.zone_id) {
        setSelectedZone(res.zone);
      }
      await fetchFarmState();
    } catch (e) {
      console.error('Decision error:', e);
    }
  };

  const handleTriggerEvent = async (eventType: string, severity: string = 'MODERATE', duration: number = 4) => {
    try {
      await api.triggerEvent(eventType, severity, duration);
      await fetchFarmState();
    } catch (e) {
      console.error('Event trigger error:', e);
    }
  };

  const handleScaleFarm = async (size: number) => {
    try {
      await api.scaleFarm(size);
      await fetchFarmState();
    } catch (e) {
      console.error('Scale error:', e);
    }
  };

  const handleRunAi = async (modelType?: string) => {
    try {
      await api.runAiPredict(modelType);
      await fetchFarmState();
    } catch (e) {
      console.error('AI Predict error:', e);
    }
  };

  const handleCreateFarm = async (config: any) => {
    try {
      await api.createFarm(config);
      await fetchFarmState();
    } catch (e) {
      console.error('Create farm error:', e);
    }
  };

  const handleReset = async () => {
    setIsPlaying(false);
    await handleCreateFarm({ crop: 'Rice', size: 100, climate: 'Normal', connectivity: 'GOOD', model: 'STANDARD' });
  };

  const handleSelectZone = async (zone: FarmZone | null) => {
    if (!zone) {
      setSelectedZone(null);
      return;
    }
    try {
      const detail = await api.getZoneDetail(zone.zone_id);
      setSelectedZone(detail.zone);
    } catch (e) {
      setSelectedZone(zone);
    }
  };

  return (
    <div className="app-container">
      {/* Top Header HUD */}
      <MainHeader
        day={day}
        seasonLength={seasonLength}
        farmSize={farmSize}
        crop={crop}
        weather={weather}
        connectivity={connectivity}
        activeModel={activeModel}
        compute={compute}
        activeEventsCount={activeEvents.length}
        isPlaying={isPlaying}
        speed={speed}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onSetSpeed={(s) => setSpeed(s)}
        onStepDay={() => handleStepSimulation(1)}
        onReset={handleReset}
        onOpenNewFarmModal={() => setIsCreateModalOpen(true)}
        onStartDemo={() => {
          setIsMainMenuOpen(false);
          setCurrentScreen('professor_demo');
        }}
      />

      <div className="main-body">
        {/* Left Navigation Sidebar */}
        <SidebarNav
          currentScreen={currentScreen}
          onSelectScreen={(s) => setCurrentScreen(s)}
        />

        {/* Center Content Screen */}
        <main style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          {currentScreen === 'farm' && (
            <FarmView
              zones={zones}
              farmSize={farmSize}
              crop={crop}
              summary={summary}
              activeEvents={activeEvents}
              selectedZone={selectedZone}
              onSelectZone={handleSelectZone}
              onApplyAction={handleApplyDecision}
              onRunAi={() => handleRunAi()}
              onTriggerEvent={handleTriggerEvent}
            />
          )}

          {currentScreen === 'climate' && (
            <ClimateLabView
              weather={weather || { temperature: 28, humidity: 65, rainfall: 0, wind: 12, rain_probability: 20, cloud_cover: 25, heatwave_risk: 0, drought_index: 10 }}
              onTriggerEvent={handleTriggerEvent}
              onRefresh={fetchFarmState}
            />
          )}

          {currentScreen === 'satellite' && (
            <SatelliteLabView
              currentDay={day}
              onTriggerPass={async () => {
                await api.triggerSatellite();
                await fetchFarmState();
              }}
            />
          )}

          {currentScreen === 'ai_center' && (
            <AiCenterView onRunAi={handleRunAi} />
          )}

          {currentScreen === 'optimization' && (
            <AiOptimizationView />
          )}

          {currentScreen === 'scalability' && (
            <ScalabilityView onScaleFarm={handleScaleFarm} />
          )}

          {currentScreen === 'connectivity' && (
            <ConnectivityView
              currentStatus={connectivity}
              onStatusChange={(st) => {
                setConnectivity(st);
                fetchFarmState();
              }}
            />
          )}

          {currentScreen === 'what_if' && (
            <WhatIfView />
          )}

          {currentScreen === 'ablation' && (
            <ResearchAblationView />
          )}

          {currentScreen === 'analytics' && (
            <AnalyticsView summary={summary} currentDay={day} />
          )}

          {currentScreen === 'professor_demo' && (
            <ProfessorDemoView
              onExecuteDemoStep={async (s) => {
                await fetchFarmState();
              }}
            />
          )}

          {currentScreen === 'season_report' && (
            <SeasonReportView />
          )}

          {currentScreen === 'about_help' && (
            <AboutHelpView />
          )}
        </main>
      </div>

      {/* Main Menu Modal */}
      <MainMenuModal
        isOpen={isMainMenuOpen}
        onClose={() => setIsMainMenuOpen(false)}
        onNewSimulation={() => {
          setIsMainMenuOpen(false);
          setIsCreateModalOpen(true);
        }}
        onContinue={() => setIsMainMenuOpen(false)}
        onStartDemo={() => {
          setIsMainMenuOpen(false);
          setCurrentScreen('professor_demo');
        }}
        onNavigateScreen={(s) => {
          setCurrentScreen(s);
          setIsMainMenuOpen(false);
        }}
      />

      {/* Farm Creation Modal */}
      <FarmCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onGenerate={handleCreateFarm}
      />
    </div>
  );
};
