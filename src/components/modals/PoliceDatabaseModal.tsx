import React, { useState } from 'react';
import {
  Database,
  Server,
  ShieldCheck,
  RefreshCw,
  Search,
  FileText,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Activity,
  Wifi,
  WifiOff,
  Key,
  Cpu,
  DownloadCloud,
  X,
  Lock,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import { usePoliceDatabase } from '../../context/PoliceDatabaseContext';
import { POLICE_GATEWAYS, POLICE_DATABASE_RECORDS, searchPoliceDatabaseRecords } from '../../data/dummy/policeDatabaseSync';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { Criminal } from '../../types';

export const PoliceDatabaseModal: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    isConnected,
    selectedGateway,
    setSelectedGatewayId,
    unitCode,
    setUnitCode,
    officerBadge,
    setOfficerBadge,
    clearanceLevel,
    setClearanceLevel,
    lastSyncTime,
    isConnecting,
    isSyncing,
    isModalOpen,
    closeModal,
    syncLogs,
    connectGateway,
    disconnectGateway,
    syncPoliceData,
    importSingleRecord,
  } = usePoliceDatabase();

  const [activeTab, setActiveTab] = useState<'gateways' | 'auth' | 'sync' | 'lookup' | 'terminal'>('gateways');
  const [searchQuery, setSearchQuery] = useState('');
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isModalOpen) return null;

  const handleConnectToggle = async () => {
    if (isConnected) {
      disconnectGateway();
      setStatusMessage('Disconnected from police database gateway.');
    } else {
      setStatusMessage('Initiating secure handshake...');
      await connectGateway();
      setStatusMessage(`Connected to ${selectedGateway.shortCode} successfully!`);
    }
  };

  const handleFullSync = async () => {
    setStatusMessage('Syncing with national police database...');
    const res = await syncPoliceData();
    queryClient.invalidateQueries({ queryKey: ['criminals'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    queryClient.invalidateQueries({ queryKey: ['network-graph'] });
    setStatusMessage(res.message);
  };

  const handleImportSingle = async (criminal: Criminal) => {
    await importSingleRecord(criminal);
    setImportedIds(prev => new Set(prev).add(criminal.id));
    queryClient.invalidateQueries({ queryKey: ['criminals'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    queryClient.invalidateQueries({ queryKey: ['network-graph'] });
    setStatusMessage(`Imported ${criminal.name} (${criminal.criminalId}) into active dossiers.`);
  };

  const matchingRecords = searchPoliceDatabaseRecords(searchQuery);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>Police Criminal Database Gateway</span>
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold uppercase">
                  {isConnected ? 'LIVE SYNC ACTIVE' : 'DISCONNECTED / STANDBY'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct federated gateway to CCTNS, ICJS, NATGRID & State Crime Records Bureaus.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isConnected ? selectedGateway.shortCode : 'Offline Mode'}</span>
            </div>

            <button
              onClick={closeModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 bg-slate-50 border-b border-slate-200 overflow-x-auto shrink-0 py-1.5">
          <button
            onClick={() => setActiveTab('gateways')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'gateways'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Gateways ({POLICE_GATEWAYS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'auth'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Officer Authentication</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sync'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Sync & Ingestion</span>
          </button>

          <button
            onClick={() => setActiveTab('lookup')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'lookup'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Live Case Lookup</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'terminal'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Audit Terminal ({syncLogs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Global Status Banner */}
          {statusMessage && (
            <div className="px-3.5 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{statusMessage}</span>
              </span>
              <button onClick={() => setStatusMessage(null)} className="text-emerald-700 hover:text-emerald-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB 1: GATEWAYS */}
          {activeTab === 'gateways' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Select Official Law Enforcement Grid</h3>
                  <p className="text-xs text-slate-500">
                    Switch federated connection between national crime records, counter-terror grids, and interpol channels.
                  </p>
                </div>
                <Button
                  variant={isConnected ? 'danger' : 'default'}
                  size="sm"
                  onClick={handleConnectToggle}
                  disabled={isConnecting}
                  className="gap-1.5 font-semibold"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Handshake...</span>
                    </>
                  ) : isConnected ? (
                    <>
                      <WifiOff className="w-3.5 h-3.5" />
                      <span>Disconnect Grid</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="w-3.5 h-3.5" />
                      <span>Connect Now</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {POLICE_GATEWAYS.map(gw => {
                  const isCurrent = selectedGateway.id === gw.id;
                  return (
                    <div
                      key={gw.id}
                      onClick={() => setSelectedGatewayId(gw.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer relative ${
                        isCurrent
                          ? 'bg-slate-50/80 border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isCurrent ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            <Database className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight">
                              {gw.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {gw.shortCode}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{gw.latencyMs}ms</span>
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">
                        {gw.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
                        <span>{gw.agency}</span>
                        <span className="font-semibold text-slate-600">
                          {gw.availableRecords.toLocaleString()} Records
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: OFFICER AUTHENTICATION */}
          {activeTab === 'auth' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Indian Law Enforcement Credential Token
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Officer Cadre / Badge ID</label>
                    <Input
                      value={officerBadge}
                      onChange={(e) => setOfficerBadge(e.target.value)}
                      placeholder="e.g. IPS-2019-DL-9841"
                      className="font-mono text-xs"
                    />
                    <span className="text-[10px] text-slate-400">Authenticated via Central Fingerprint Bureau (CFPB)</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Police Station / Station Code</label>
                    <Input
                      value={unitCode}
                      onChange={(e) => setUnitCode(e.target.value)}
                      placeholder="e.g. DL-SPEC-CELL-01"
                      className="font-mono text-xs"
                    />
                    <span className="text-[10px] text-slate-400">CCTNS Station Node identifier</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Clearance Classification</label>
                    <select
                      value={clearanceLevel}
                      onChange={(e) => setClearanceLevel(e.target.value)}
                      className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-slate-950 font-mono"
                    >
                      <option value="DEFCON 2 - CLASSIFIED">DEFCON 2 - CLASSIFIED (National Counter-Terror)</option>
                      <option value="LEVEL 4 - CENTRAL LEA">LEVEL 4 - CENTRAL LEA (CBI / ED / NIA)</option>
                      <option value="LEVEL 3 - STATE CID">LEVEL 3 - STATE CID (State Crime Branch)</option>
                      <option value="LEVEL 2 - DISTRICT SP">LEVEL 2 - DISTRICT SP (Standard Investigation)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Cryptographic Protocol</label>
                    <div className="h-9 px-3 flex items-center justify-between rounded-md bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
                      <span>AES-256-GCM / SHA-384</span>
                      <span className="text-[10px] text-emerald-600 font-bold">VERIFIED</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleConnectToggle}
                    disabled={isConnecting}
                    className="w-full sm:w-auto font-semibold gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{isConnected ? 'Re-Verify Officer Handshake' : 'Authorize & Connect Grid'}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SYNC & INGESTION */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Federated Live Sync Engine
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                      READY
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pull authentic FIR records, non-bailable warrants, and wiretap telemetry from {selectedGateway.name}.
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">
                    Last Successful Sync: <span className="text-white font-bold">{lastSyncTime || 'Never'}</span>
                  </p>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  onClick={handleFullSync}
                  disabled={isSyncing}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Ingesting Dossiers...' : 'Pull Live Police Data'}</span>
                </Button>
              </div>

              {/* Data Ingestion Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Active FIRs & Chargesheets</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500">IPC 302, 307, 420, MCOCA, PMLA, & UAPA case files.</p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">NAFIS Biometrics</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500">10-digit fingerprint hashes and facial recognition mugshots.</p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Telecom & CDR Wiretaps</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500">IMEI logs, tower triangulation, and virtual VoIP spoof streams.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE LOOKUP & INGESTION */}
          {activeTab === 'lookup' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search police database by FIR Number, Suspect Name, Alias, or Crime Category..."
                  className="pl-9 text-xs"
                />
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 block">
                  Available Police Database Records ({matchingRecords.length})
                </span>

                {matchingRecords.map(rec => {
                  const isImported = importedIds.has(rec.id);
                  return (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {rec.criminalId}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{rec.name}</h4>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              Alias: {rec.alias}
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              rec.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                            }`}>
                              RISK {rec.riskScore}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {rec.biography}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
                            <span>{rec.lastKnownLocation.city}, {rec.lastKnownLocation.country}</span>
                            <span>•</span>
                            <span>{rec.activeWarrants} Active Warrants</span>
                            <span>•</span>
                            <span>{rec.crimeCategory}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant={isImported ? 'secondary' : 'default'}
                        size="sm"
                        disabled={isImported}
                        onClick={() => handleImportSingle(rec)}
                        className="gap-1.5 shrink-0 text-xs"
                      >
                        {isImported ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Imported</span>
                          </>
                        ) : (
                          <>
                            <DownloadCloud className="w-3.5 h-3.5" />
                            <span>Import to Dossier</span>
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT TERMINAL & PROVENANCE */}
          {activeTab === 'terminal' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  <span>Indian Evidence Act Section 65B Telemetry Log</span>
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  SHA-256 Verified Audit Chain
                </span>
              </div>

              <div className="bg-slate-950 text-emerald-400 p-3.5 rounded-xl font-mono text-[11px] h-64 overflow-y-auto space-y-1 border border-slate-800 shadow-inner">
                {syncLogs.map(log => (
                  <div key={log.id} className="flex items-start gap-2">
                    <span className="text-slate-500 shrink-0">[{log.time}]</span>
                    <span className={
                      log.type === 'success' ? 'text-emerald-300 font-bold' :
                      log.type === 'warn' ? 'text-amber-300' :
                      log.type === 'error' ? 'text-red-400 font-bold' :
                      'text-slate-300'
                    }>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-slate-400 italic">
                * All data exchanges are recorded in compliance with National Crime Records Bureau (NCRB) Information Security Policy 2024.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Agency Node: {unitCode}</span>
            <span>•</span>
            <span>Officer: {officerBadge}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={closeModal}
              className="text-xs"
            >
              Close Gateway
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleFullSync}
              disabled={isSyncing}
              className="gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync All Police Records</span>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
