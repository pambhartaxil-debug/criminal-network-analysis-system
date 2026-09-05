import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { Criminal, TimelineEvent, CrimeCategory, RiskLevel, SuspectStatus } from '../../types';
import { Button } from '../ui/button';
import {
  X,
  PlusCircle,
  Shield,
  User,
  Phone,
  CreditCard,
  Car,
  Upload,
  CheckCircle2,
  Sparkles,
  Printer,
  FileCheck
} from 'lucide-react';

interface EvidenceIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type IntakeTab = 'suspect' | 'evidence' | 'comms' | 'financial' | 'vehicle';

export const EvidenceIntakeModal: React.FC<EvidenceIntakeModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<IntakeTab>('suspect');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{ id: string; type: string; title: string } | null>(null);

  // 1. Suspect Form State
  const [suspectForm, setSuspectForm] = useState({
    name: '',
    alias: '',
    crimeCategory: 'Drug Trafficking' as CrimeCategory,
    riskScore: 85,
    riskLevel: 'HIGH' as RiskLevel,
    status: 'UNDER_SURVEILLANCE' as SuspectStatus,
    nationality: '',
    age: 35,
    gender: 'Male',
    city: '',
    address: '',
    biography: '',
    bloodGroup: 'O+',
    fingerprintId: '',
    heightCm: 180,
    tags: 'Under Surveillance, Target Level 1',
  });

  // 2. Evidence Form State
  const [evidenceForm, setEvidenceForm] = useState({
    title: '',
    eventType: 'CCTV Sighting',
    severity: 'HIGH' as RiskLevel,
    criminalName: '',
    location: '',
    description: '',
    confidenceScore: 92,
    officerBadge: user?.badgeNumber || 'AGY-7701',
    stationId: 'Task Force Central - Sector 4',
    isVerified: true,
    fileAttachmentName: '',
  });

  // 3. Communications Wiretap State
  const [commsForm, setCommsForm] = useState({
    phoneNumber: '',
    carrier: 'Encrypted Satellite VoIP',
    imei: '',
    suspectName: '',
    status: 'TAPPED',
    transcriptSnippet: '',
  });

  // 4. Financial Anomaly State
  const [financialForm, setFinancialForm] = useState({
    accountNumber: '',
    bankName: '',
    accountType: 'OFFSHORE',
    amount: 2500000,
    currency: 'USD',
    sourceName: '',
    destinationName: '',
    isSuspicious: true,
  });

  // 5. Vehicle State
  const [vehicleForm, setVehicleForm] = useState({
    licensePlate: '',
    make: '',
    model: '',
    year: 2024,
    color: 'Black',
    registeredOwner: '',
    lastSeenLocation: '',
    status: 'ACTIVE',
  });

  // AI Evaluation Simulation
  const [isEvaluating, setIsEvaluating] = useState(false);
  const handleAiAutoEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      if (activeTab === 'evidence') {
        setEvidenceForm((prev) => ({
          ...prev,
          confidenceScore: 96,
          severity: 'CRITICAL',
          description: prev.description
            ? `${prev.description} [AI Flagged: Matches known modus operandi of Vanguard Syndicate logistics pattern].`
            : 'AI cross-correlation detected high matching probability with open Interpol red alert warrant.',
        }));
      } else if (activeTab === 'suspect') {
        setSuspectForm((prev) => ({
          ...prev,
          riskScore: 94,
          riskLevel: 'CRITICAL',
          biography: prev.biography
            ? `${prev.biography} [AI Assessment: Key financial node in transnational corridor].`
            : 'Key facilitator identified across 3 active wiretap logs and offshore wire routing.',
        }));
      }
      setIsEvaluating(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = `EV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      // 1. If evidence submitted, update timeline cache
      if (activeTab === 'evidence') {
        const newEvent: TimelineEvent = {
          id: `tl-${Date.now()}`,
          title: evidenceForm.title || 'Field Evidence Intercept',
          eventType: evidenceForm.eventType as any,
          timestamp: new Date().toISOString(),
          criminalName: evidenceForm.criminalName || 'Unidentified Associate',
          location: evidenceForm.location || 'Field Sector Monitored Zone',
          description: evidenceForm.description || 'Logged by field interdiction officer.',
          confidenceScore: Number(evidenceForm.confidenceScore),
          severity: evidenceForm.severity,
          isVerified: evidenceForm.isVerified,
        };

        queryClient.setQueryData(['timeline'], (old: any) => {
          if (!old?.data) return { success: true, data: [newEvent] };
          return { ...old, data: [newEvent, ...old.data] };
        });

        addNotification({
          title: `New Evidence Logged: ${newEvent.title}`,
          message: `Case file ${generatedId} logged by Badge ${evidenceForm.officerBadge} at ${newEvent.location}.`,
          type: 'investigation',
          severity: newEvent.severity,
        });

        setSuccessReceipt({ id: generatedId, type: 'Evidence Log', title: newEvent.title });
      } else if (activeTab === 'suspect') {
        const newCriminal: Criminal = {
          id: `crm-${Date.now()}`,
          criminalId: `CR-${Math.floor(1000 + Math.random() * 9000)}`,
          name: suspectForm.name || 'New Target Subject',
          alias: suspectForm.alias || 'Unknown Alias',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
          age: Number(suspectForm.age),
          gender: suspectForm.gender,
          nationality: suspectForm.nationality || 'Unspecified',
          crimeCategory: suspectForm.crimeCategory,
          riskScore: Number(suspectForm.riskScore),
          riskLevel: suspectForm.riskLevel,
          status: suspectForm.status,
          lastKnownLocation: {
            address: suspectForm.address || 'Central Sector',
            city: suspectForm.city || 'Bucharest',
            country: 'EU Nexus',
            coordinates: [44.4323, 26.1011],
          },
          lastActivity: new Date().toISOString(),
          knownAssociatesCount: 0,
          activeWarrants: 1,
          biography: suspectForm.biography || 'Profile created by field intelligence team.',
          aiThreatSummary: `AI Risk Index ${suspectForm.riskScore}/100. Actively tracked across task force databases.`,
          personalDetails: {
            dob: '1990-01-01',
            bloodGroup: suspectForm.bloodGroup,
            fingerprintId: suspectForm.fingerprintId || `FP-${Date.now().toString().slice(-6)}`,
            heightCm: Number(suspectForm.heightCm),
          },
          knownAssociates: [],
          vehicles: [],
          phoneNumbers: [],
          financialAccounts: [],
          timeline: [],
          connectedOrganizations: [],
          tags: suspectForm.tags.split(',').map((t) => t.trim()),
        };

        queryClient.setQueryData(['criminals'], (old: any) => {
          if (!old?.data) return { success: true, data: [newCriminal] };
          return { ...old, data: [newCriminal, ...old.data] };
        });

        addNotification({
          title: `New Target Profile Added: ${newCriminal.name}`,
          message: `Subject ${newCriminal.criminalId} (${newCriminal.alias}) registered under ${newCriminal.crimeCategory}.`,
          type: 'suspect',
          severity: newCriminal.riskLevel,
        });

        setSuccessReceipt({ id: newCriminal.criminalId, type: 'Target Dossier', title: newCriminal.name });
      } else {
        // Generic data intake
        addNotification({
          title: `Intelligence Node Logged (#${generatedId})`,
          message: `Field telemetry intake verified by Officer ${user?.name || 'Vance'}.`,
          type: 'system',
          severity: 'HIGH',
        });
        setSuccessReceipt({ id: generatedId, type: 'Intelligence Intercept', title: 'Telemetry Node' });
      }

      setIsSubmitting(false);
    }, 400);
  };

  const handleReset = () => {
    setSuccessReceipt(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-popover overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Add Suspect Profile & Evidence Intake
                </h2>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-brand-300 border border-slate-700">
                  CLASSIFIED // LAW ENFORCEMENT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Log new suspects, physical evidence, forensic wiretaps, financial trails, and field sightings.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs shrink-0 py-1.5">
          {[
            { id: 'suspect', label: '1. Suspect Profile', icon: User },
            { id: 'evidence', label: '2. Forensic Evidence', icon: FileCheck },
            { id: 'comms', label: '3. Wiretap / Comms', icon: Phone },
            { id: 'financial', label: '4. Financial Anomaly', icon: CreditCard },
            { id: 'vehicle', label: '5. Vehicle Sighting', icon: Car },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as IntakeTab);
                  setSuccessReceipt(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition shrink-0 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {successReceipt ? (
            /* Success Receipt Banner */
            <div className="p-6 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase px-2 py-0.5 rounded bg-emerald-200/60">
                  {successReceipt.type} Logged Successfully
                </span>
                <h3 className="text-base font-bold text-emerald-950 mt-1">
                  Tracking Reference #{successReceipt.id}
                </h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Item has been integrated into the live investigation database, relationship graph, and evidence timeline.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.print()}
                  className="gap-1.5 text-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Chain of Custody Tag
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleReset}
                  className="gap-1.5 text-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Log Another Entry
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* TAB 1: EVIDENCE INTAKE */}
              {activeTab === 'evidence' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Evidence Title / Incident Subject *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CCTV Capture: Slip 42 Cargo Offload"
                        value={evidenceForm.title}
                        onChange={(e) => setEvidenceForm({ ...evidenceForm, title: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Evidence Category *
                      </label>
                      <select
                        value={evidenceForm.eventType}
                        onChange={(e) => setEvidenceForm({ ...evidenceForm, eventType: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                      >
                        <option value="CCTV Sighting">CCTV Surveillance Sighting</option>
                        <option value="Phone Calls">Tapped Call / Audio Intercept</option>
                        <option value="ATM Withdrawal">ATM Cashout / Cash Movement</option>
                        <option value="Wire Transfer">Wire Transfer / Crypto Flow</option>
                        <option value="Vehicle Movement">Vehicle Convoy Movement</option>
                        <option value="FIR Filed">Formal FIR / Police Report</option>
                        <option value="Arrest">Suspect Arrest / Custody</option>
                        <option value="Meeting">Clandestine Meeting</option>
                        <option value="Weapon Sighting">Weapon / Ballistics Sighting</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Target Suspect
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Viktor Markov / Mateo Silva"
                        value={evidenceForm.criminalName}
                        onChange={(e) => setEvidenceForm({ ...evidenceForm, criminalName: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Location / Depot *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Port of Rotterdam Gate 4"
                        value={evidenceForm.location}
                        onChange={(e) => setEvidenceForm({ ...evidenceForm, location: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Threat / Severity Level
                      </label>
                      <select
                        value={evidenceForm.severity}
                        onChange={(e) => setEvidenceForm({ ...evidenceForm, severity: e.target.value as RiskLevel })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                      >
                        <option value="CRITICAL">Critical (Defcon 1)</option>
                        <option value="HIGH">High Priority</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-700">
                        Detailed Incident Narrative & Forensic Observations *
                      </label>
                      <button
                        type="button"
                        onClick={handleAiAutoEvaluate}
                        disabled={isEvaluating}
                        className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {isEvaluating ? 'Evaluating...' : 'Auto-Evaluate with AI'}
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      required
                      placeholder="Enter raw field observation notes, serial numbers, timestamp details, or transcripts..."
                      value={evidenceForm.description}
                      onChange={(e) => setEvidenceForm({ ...evidenceForm, description: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  {/* Chain of Custody & File Upload Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div>
                      <span className="block font-semibold text-slate-700 mb-1">
                        Chain of Custody
                      </span>
                      <div className="space-y-1 text-[11px] text-slate-600">
                        <div>Logging Officer: <span className="font-semibold text-slate-800">{user?.name || 'Agent Marcus Vance'}</span></div>
                        <div>Officer Badge: <span className="font-mono text-slate-800">{evidenceForm.officerBadge}</span></div>
                        <div>Intake Station: <span className="text-slate-800">{evidenceForm.stationId}</span></div>
                      </div>
                    </div>

                    <div>
                      <span className="block font-semibold text-slate-700 mb-1">
                        Attach Evidence File (CCTV / Audio / PDF)
                      </span>
                      <label className="flex flex-col items-center justify-center p-2.5 border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-md cursor-pointer bg-white transition">
                        <Upload className="w-4 h-4 text-slate-400 mb-0.5" />
                        <span className="text-[10px] text-slate-500">Click to attach file or drag & drop</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setEvidenceForm({ ...evidenceForm, fileAttachmentName: e.target.files[0].name });
                            }
                          }}
                        />
                      </label>
                      {evidenceForm.fileAttachmentName && (
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                          Attached: {evidenceForm.fileAttachmentName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SUSPECT PROFILE INTAKE */}
              {activeTab === 'suspect' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alexei Volkov"
                        value={suspectForm.name}
                        onChange={(e) => setSuspectForm({ ...suspectForm, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Alias / Street Moniker
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ghost / Phantom"
                        value={suspectForm.alias}
                        onChange={(e) => setSuspectForm({ ...suspectForm, alias: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Crime Category *
                      </label>
                      <select
                        value={suspectForm.crimeCategory}
                        onChange={(e) => setSuspectForm({ ...suspectForm, crimeCategory: e.target.value as CrimeCategory })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                      >
                        <option value="Drug Trafficking">Drug Trafficking</option>
                        <option value="Cybercrime">Cybercrime</option>
                        <option value="Money Laundering">Money Laundering</option>
                        <option value="Arms Smuggling">Arms Smuggling</option>
                        <option value="Extortion">Extortion</option>
                        <option value="Organized Heist">Organized Heist</option>
                        <option value="Human Trafficking">Human Trafficking</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Status *
                      </label>
                      <select
                        value={suspectForm.status}
                        onChange={(e) => setSuspectForm({ ...suspectForm, status: e.target.value as SuspectStatus })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                      >
                        <option value="WANTED">WANTED</option>
                        <option value="UNDER_SURVEILLANCE">UNDER SURVEILLANCE</option>
                        <option value="IN_CUSTODY">IN CUSTODY</option>
                        <option value="BAIL">ON BAIL</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Risk Level
                      </label>
                      <select
                        value={suspectForm.riskLevel}
                        onChange={(e) => setSuspectForm({ ...suspectForm, riskLevel: e.target.value as RiskLevel })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                      >
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                      </select>
                    </div>
                  </div>

                  {/* Biometrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Nationality</label>
                      <input
                        type="text"
                        placeholder="e.g. German"
                        value={suspectForm.nationality}
                        onChange={(e) => setSuspectForm({ ...suspectForm, nationality: e.target.value })}
                        className="w-full px-2 py-1 rounded border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Height (cm)</label>
                      <input
                        type="number"
                        value={suspectForm.heightCm}
                        onChange={(e) => setSuspectForm({ ...suspectForm, heightCm: Number(e.target.value) })}
                        className="w-full px-2 py-1 rounded border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Blood Group</label>
                      <select
                        value={suspectForm.bloodGroup}
                        onChange={(e) => setSuspectForm({ ...suspectForm, bloodGroup: e.target.value })}
                        className="w-full px-2 py-1 rounded border border-slate-300 text-xs bg-white"
                      >
                        <option value="O+">O+</option>
                        <option value="A+">A+</option>
                        <option value="B+">B+</option>
                        <option value="AB+">AB+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Fingerprint ID</label>
                      <input
                        type="text"
                        placeholder="FP-99410"
                        value={suspectForm.fingerprintId}
                        onChange={(e) => setSuspectForm({ ...suspectForm, fingerprintId: e.target.value })}
                        className="w-full px-2 py-1 rounded border border-slate-300 text-xs bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Intelligence Summary & Modus Operandi
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Criminal background, syndicate roles, and observed operational methods..."
                      value={suspectForm.biography}
                      onChange={(e) => setSuspectForm({ ...suspectForm, biography: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: COMMS INTAKE */}
              {activeTab === 'comms' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Phone / SIM Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+40 721 990 412"
                        value={commsForm.phoneNumber}
                        onChange={(e) => setCommsForm({ ...commsForm, phoneNumber: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Carrier / Encryption Type
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Orange RO (Encrypted Burner)"
                        value={commsForm.carrier}
                        onChange={(e) => setCommsForm({ ...commsForm, carrier: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tapped Audio / Message Intercept Snippet
                    </label>
                    <textarea
                      rows={3}
                      placeholder='SUBJECT: "...delivery arrives slip 14 tonight at 0200..."'
                      value={commsForm.transcriptSnippet}
                      onChange={(e) => setCommsForm({ ...commsForm, transcriptSnippet: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: FINANCIAL ANOMALY */}
              {activeTab === 'financial' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Account / Crypto Wallet Address *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="0x98fa...11c2 or IBAN"
                        value={financialForm.accountNumber}
                        onChange={(e) => setFinancialForm({ ...financialForm, accountNumber: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Amount (USD Equivalent) *
                      </label>
                      <input
                        type="number"
                        required
                        value={financialForm.amount}
                        onChange={(e) => setFinancialForm({ ...financialForm, amount: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: VEHICLE SIGHTING */}
              {activeTab === 'vehicle' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        License Plate Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. B-77-VNG"
                        value={vehicleForm.licensePlate}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, licensePlate: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Make & Model
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Audi RS7 Matte Black"
                        value={vehicleForm.make}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onClose}
                  className="text-xs"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={isSubmitting}
                  className="text-xs gap-1.5 shadow-sm bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-brand-300" />
                  <span>{isSubmitting ? 'Logging to Vault...' : 'Submit & Ingest Evidence'}</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
