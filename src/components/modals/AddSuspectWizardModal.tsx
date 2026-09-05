import React, { useState } from 'react';
import { Criminal, CrimeCategory, RiskLevel, SuspectStatus, TimelineEvent, PhoneRecord, FinancialAccount, Vehicle, TimelineEventType } from '../../types';
import { createCriminal } from '../../api/criminals';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { RiskBadge, StatusBadge } from '../common/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';
import {
  X,
  User,
  FileText,
  Phone,
  Landmark,
  Car,
  CheckCircle2,
  HelpCircle,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';

interface AddSuspectWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCriminal: Criminal) => void;
}

export const AddSuspectWizardModal: React.FC<AddSuspectWizardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  // Question answers for Steps 2, 3, 4, 5 (must be true or false, not null)
  const [hasEvidence, setHasEvidence] = useState<boolean | null>(null);
  const [hasWiretaps, setHasWiretaps] = useState<boolean | null>(null);
  const [hasFinance, setHasFinance] = useState<boolean | null>(null);
  const [hasVehicles, setHasVehicles] = useState<boolean | null>(null);

  // Step 1: Suspect Profile Identity State
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300');
  const [age, setAge] = useState<number>(38);
  const [gender, setGender] = useState('Male');
  const [nationality, setNationality] = useState('Indian');
  const [crimeCategory, setCrimeCategory] = useState<CrimeCategory>('Extortion');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('HIGH');
  const [riskScore, setRiskScore] = useState<number>(85);
  const [status, setStatus] = useState<SuspectStatus>('WANTED');
  const [dob, setDob] = useState('1988-05-12');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [fingerprintId, setFingerprintId] = useState(`FP-ACN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [address, setAddress] = useState('Worli Sea Face');
  const [city, setCity] = useState('Mumbai');
  const [country, setCountry] = useState('India');
  const [lat, setLat] = useState<number>(19.0176);
  const [lng, setLng] = useState<number>(72.8150);
  const [biography, setBiography] = useState('');
  const [tagsInput, setTagsInput] = useState('Hawala, Extortion, Angadia');

  // Step 2: Forensic Evidence Items
  const [evidenceList, setEvidenceList] = useState<TimelineEvent[]>([
    {
      id: `evt-${Date.now()}-1`,
      title: 'CCTV Surveillance Sighting at Safehouse Terminal',
      eventType: 'CCTV Sighting',
      timestamp: new Date().toISOString(),
      location: 'Marine Drive, Mumbai',
      description: 'Subject captured meeting secondary operatives near logistics depot.',
      confidenceScore: 92,
      severity: 'HIGH',
      isVerified: true,
      evidenceFiles: [{ fileName: 'CCTV_LOG_CAM4.mp4', fileType: 'video' }]
    }
  ]);

  // Step 3: Wiretap Records
  const [wiretapList, setWiretapList] = useState<PhoneRecord[]>([
    {
      id: `ph-${Date.now()}-1`,
      phoneNumber: '+91 98201 88492',
      carrier: 'Encrypted Cellular / Satellite VoIP',
      imei: '864920048192041',
      ownerName: 'Secondary Burner Identity',
      status: 'TAPPED',
      totalCallsLogged: 48,
      lastActive: '2026-08-25T14:30:00Z',
      frequentContacts: []
    }
  ]);

  // Step 4: Financial Accounts
  const [financialList, setFinancialList] = useState<FinancialAccount[]>([
    {
      id: `fin-${Date.now()}-1`,
      bankName: 'Angadia Hawala Transfer Ledger',
      accountNumber: 'ACC-HAWALA-9921-MUM',
      accountType: 'OFFSHORE',
      balance: 14500000,
      currency: 'INR',
      holderName: 'Kuber Trading Shell Corp',
      flaggedTransactionsCount: 12,
      status: 'MONITORED'
    }
  ]);

  // Step 5: Vehicle Details
  const [vehicleList, setVehicleList] = useState<Vehicle[]>([
    {
      id: `veh-${Date.now()}-1`,
      make: 'Toyota',
      model: 'Land Cruiser (Armored)',
      year: 2024,
      color: 'Matte Black',
      licensePlate: 'MH-01-EE-9988',
      registeredOwner: 'Frontline Logistics Pvt Ltd',
      status: 'ACTIVE',
      lastSeenLocation: 'Bandra-Worli Sea Link Toll',
      lastSeenTime: '2026-08-25 21:15'
    }
  ]);

  if (!isOpen) return null;

  // Validation Checkers for each step
  const isStep1Complete = name.trim().length > 0;
  const isStep2Complete = hasEvidence !== null;
  const isStep3Complete = hasWiretaps !== null;
  const isStep4Complete = hasFinance !== null;
  const isStep5Complete = hasVehicles !== null;
  const areAllStepsComplete = isStep1Complete && isStep2Complete && isStep3Complete && isStep4Complete && isStep5Complete;

  // Navigation Logic
  const handleNextStep = () => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!isStep1Complete) {
        setValidationError('Please enter the Suspect Full Name to proceed to Step 2.');
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!isStep2Complete) {
        setValidationError('Please select whether Forensic Evidence is available (Yes or No).');
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!isStep3Complete) {
        setValidationError('Please select whether Wiretaps are active for this subject (Yes or No).');
        return;
      }
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      if (!isStep4Complete) {
        setValidationError('Please select whether Financial Accounts are logged (Yes or No).');
        return;
      }
      setCurrentStep(5);
      return;
    }

    if (currentStep === 5) {
      if (!isStep5Complete) {
        setValidationError('Please select whether Vehicle records exist (Yes or No).');
        return;
      }
      setCurrentStep(6);
      return;
    }
  };

  // Add Item Helpers
  const addEvidenceItem = () => {
    setEvidenceList(prev => [
      ...prev,
      {
        id: `evt-${Date.now()}-${prev.length + 1}`,
        title: 'Intercepted Meeting / Field Sighting',
        eventType: 'Meeting',
        timestamp: new Date().toISOString(),
        location: `${city}, ${country}`,
        description: 'New forensic intelligence event logged by field operator.',
        confidenceScore: 85,
        severity: riskLevel,
        isVerified: true
      }
    ]);
  };

  const removeEvidenceItem = (index: number) => {
    setEvidenceList(prev => prev.filter((_, i) => i !== index));
  };

  const addWiretapItem = () => {
    setWiretapList(prev => [
      ...prev,
      {
        id: `ph-${Date.now()}-${prev.length + 1}`,
        phoneNumber: '+91 99000 ' + Math.floor(10000 + Math.random() * 90000),
        carrier: 'Satellite Telecom',
        imei: '86' + Math.floor(1000000000000 + Math.random() * 9000000000000),
        ownerName: alias || name,
        status: 'TAPPED',
        totalCallsLogged: 1,
        lastActive: new Date().toISOString(),
        frequentContacts: []
      }
    ]);
  };

  const removeWiretapItem = (index: number) => {
    setWiretapList(prev => prev.filter((_, i) => i !== index));
  };

  const addFinancialItem = () => {
    setFinancialList(prev => [
      ...prev,
      {
        id: `fin-${Date.now()}-${prev.length + 1}`,
        bankName: 'Offshore Cryptographic Trust',
        accountNumber: '0x' + Math.random().toString(16).substring(2, 14),
        accountType: 'CRYPTO_WALLET',
        balance: 500000,
        currency: 'USDT',
        holderName: alias || name,
        flaggedTransactionsCount: 3,
        status: 'MONITORED'
      }
    ]);
  };

  const removeFinancialItem = (index: number) => {
    setFinancialList(prev => prev.filter((_, i) => i !== index));
  };

  const addVehicleItem = () => {
    setVehicleList(prev => [
      ...prev,
      {
        id: `veh-${Date.now()}-${prev.length + 1}`,
        make: 'Mahindra',
        model: 'Scorpio-N (Bulletproof)',
        year: 2025,
        color: 'White',
        licensePlate: `MH-04-${Math.random().toString(36).substring(2, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        registeredOwner: alias || name,
        status: 'ACTIVE',
        lastSeenLocation: `${city} Highway Junction`,
        lastSeenTime: 'Just now'
      }
    ]);
  };

  const removeVehicleItem = (index: number) => {
    setVehicleList(prev => prev.filter((_, i) => i !== index));
  };

  // Submit & Save
  const handleFinalSubmit = async () => {
    if (!areAllStepsComplete) {
      setValidationError('All 5 intelligence steps must be completed before creating the dossier.');
      return;
    }

    setSubmitting(true);
    setValidationError(null);

    const parsedTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const generatedId = `crm-${Date.now()}`;
    const generatedCriminalId = `CR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCriminal: Criminal = {
      id: generatedId,
      criminalId: generatedCriminalId,
      name: name.trim(),
      alias: alias.trim() || 'Target',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      age: Number(age) || 35,
      gender: gender || 'Male',
      nationality: nationality || 'Indian',
      crimeCategory,
      riskLevel,
      riskScore: Number(riskScore) || 80,
      status,
      lastKnownLocation: {
        address: address || 'Classified Location',
        city: city || 'Mumbai',
        country: country || 'India',
        coordinates: [Number(lat) || 19.0176, Number(lng) || 72.8150]
      },
      lastActivity: new Date().toISOString(),
      knownAssociatesCount: 2,
      activeWarrants: 3,
      biography: biography || `Key subject flagged for coordinated ${crimeCategory} activities. Monitored under active interdiction directives.`,
      aiThreatSummary: `ACN Neural Core classified subject threat level as ${riskLevel} (${riskScore}/100). Imminent operational risk detected across ${city} regional nodes.`,
      personalDetails: {
        dob,
        bloodGroup,
        fingerprintId,
        heightCm: 178,
        eyeColor: 'Dark Brown'
      },
      knownAssociates: [],
      vehicles: hasVehicles ? vehicleList : [],
      phoneNumbers: hasWiretaps ? wiretapList : [],
      financialAccounts: hasFinance ? financialList : [],
      timeline: hasEvidence ? evidenceList : [],
      connectedOrganizations: [
        {
          id: `org-${Date.now()}`,
          name: `${city} Syndicate Network`,
          role: 'Primary Operative',
          threatLevel: riskLevel
        }
      ],
      tags: parsedTags.length > 0 ? parsedTags : ['Monitored', 'HighPriority']
    };

    try {
      await createCriminal(newCriminal);
      addNotification({
        title: `🎯 New Target Registered: ${newCriminal.name}`,
        message: `Dossier #${newCriminal.criminalId} ("${newCriminal.alias}") created. Risk Level: ${newCriminal.riskLevel} (${newCriminal.riskScore}/100) • ${newCriminal.crimeCategory} • ${city}.`,
        type: 'suspect',
        severity: newCriminal.riskLevel,
        link: '/criminals'
      });
      setTimeout(() => {
        setSubmitting(false);
        onSuccess(newCriminal);
        onClose();
      }, 300);
    } catch (err) {
      addNotification({
        title: `🎯 New Target Registered: ${newCriminal.name}`,
        message: `Dossier #${newCriminal.criminalId} ("${newCriminal.alias}") created. Risk Level: ${newCriminal.riskLevel} (${newCriminal.riskScore}/100).`,
        type: 'suspect',
        severity: newCriminal.riskLevel,
        link: '/criminals'
      });
      setSubmitting(false);
      onSuccess(newCriminal);
      onClose();
    }
  };

  const steps = [
    { num: 1, label: '1. Suspect Profile', isDone: isStep1Complete },
    { num: 2, label: '2. Forensic Evidence', isDone: isStep2Complete },
    { num: 3, label: '3. Wiretaps & Phones', isDone: isStep3Complete },
    { num: 4, label: '4. Financial Anomaly', isDone: isStep4Complete },
    { num: 5, label: '5. Vehicle Details', isDone: isStep5Complete },
    { num: 6, label: '6. Review & Save', isDone: areAllStepsComplete },
  ];

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 cursor-pointer"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] cursor-default"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-subtle">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-none">
                Register & Add Suspect Dossier
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">
                Step-by-step intake wizard for identity, forensics, wiretaps, finance, and assets.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Navigation Bar */}
        <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between gap-1 overflow-x-auto text-[11px] font-medium">
          {steps.map((step) => {
            const canNavigate = step.num <= currentStep || (step.num === currentStep + 1 && steps[currentStep - 1].isDone);
            return (
              <button
                key={step.num}
                type="button"
                disabled={!canNavigate}
                onClick={() => {
                  if (canNavigate) {
                    setValidationError(null);
                    setCurrentStep(step.num);
                  }
                }}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md transition shrink-0 ${
                  currentStep === step.num
                    ? 'bg-slate-900 text-white font-bold shadow-subtle'
                    : step.isDone
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer hover:bg-emerald-100'
                    : 'text-slate-400 bg-transparent cursor-not-allowed opacity-70'
                }`}
              >
                <span>{step.label}</span>
                {step.isDone && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Validation Error Notice Banner */}
        {validationError && (
          <div className="mx-5 mt-4 p-2.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in shake">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Modal Body: Wizard Step Contents */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* ========================================================================= */}
          {/* STEP 1: SUSPECT PROFILE IDENTITY */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-700" /> 1. Suspect Profile (Primary Identity & Biometrics)
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Step 1 of 5</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Suspect Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dawood Ibrahim Kaskar"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    className={`w-full px-3 py-1.5 rounded-md border text-slate-900 text-xs focus:outline-none shadow-subtle ${
                      !name.trim() && validationError ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-white focus:border-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Street Alias / Code Name
                  </label>
                  <input
                    type="text"
                    placeholder='e.g. "D-Boss" / "The Don"'
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400 shadow-subtle bg-white"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Crime Category</label>
                  <select
                    value={crimeCategory}
                    onChange={(e) => setCrimeCategory(e.target.value as CrimeCategory)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-900 text-xs bg-white focus:outline-none focus:border-slate-400 shadow-subtle"
                  >
                    <option value="Extortion">Extortion</option>
                    <option value="Money Laundering">Money Laundering</option>
                    <option value="Drug Trafficking">Drug Trafficking</option>
                    <option value="Cybercrime">Cybercrime</option>
                    <option value="Arms Smuggling">Arms Smuggling</option>
                    <option value="Organized Heist">Organized Heist</option>
                    <option value="Human Trafficking">Human Trafficking</option>
                    <option value="Terrorism Financing">Terrorism Financing</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Current Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as SuspectStatus)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-900 text-xs bg-white focus:outline-none focus:border-slate-400 shadow-subtle"
                  >
                    <option value="WANTED">WANTED</option>
                    <option value="UNDER_SURVEILLANCE">UNDER SURVEILLANCE</option>
                    <option value="IN_CUSTODY">IN CUSTODY</option>
                    <option value="BAIL">BAIL</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Threat Level & Risk Score ({riskScore}/100)</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={riskLevel}
                      onChange={(e) => {
                        const lvl = e.target.value as RiskLevel;
                        setRiskLevel(lvl);
                        if (lvl === 'CRITICAL') setRiskScore(95);
                        else if (lvl === 'HIGH') setRiskScore(80);
                        else if (lvl === 'MEDIUM') setRiskScore(60);
                        else setRiskScore(35);
                      }}
                      className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-900 text-xs bg-white focus:outline-none focus:border-slate-400 shadow-subtle"
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={riskScore}
                      onChange={(e) => setRiskScore(Number(e.target.value))}
                      className="flex-1 accent-slate-900 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Photo / Mugshot URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400 shadow-subtle bg-white"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Age & Gender</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Age"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-slate-900 text-xs shadow-subtle bg-white"
                    />
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-md border border-slate-200 text-slate-900 text-xs bg-white shadow-subtle"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Nationality & Date of Birth</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nationality"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-slate-900 text-xs shadow-subtle bg-white"
                    />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-2 py-1 rounded-md border border-slate-200 text-slate-900 text-xs shadow-subtle bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Last Known Location (City / Area)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City (e.g. Mumbai)"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-slate-900 text-xs shadow-subtle bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Area (e.g. Worli)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-slate-900 text-xs shadow-subtle bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Surveillance Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Hawala, Extortion, Angadia"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-slate-900 text-xs shadow-subtle bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Official Investigative Biography</label>
                <textarea
                  rows={2}
                  placeholder="Key background history, syndicate associations, criminal network operations..."
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400 shadow-subtle bg-white"
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: FORENSIC EVIDENCE */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-700" /> 2. Forensic Evidence & Incidents
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Step 2 of 5</span>
              </div>

              {/* Yes / No Question Card */}
              {hasEvidence === null ? (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mx-auto shadow-subtle">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Is forensic evidence available for this subject?</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Forensic evidence includes CCTV footage logs, filed FIR records, seized items, or surveillance meeting reports.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setHasEvidence(true);
                        setValidationError(null);
                      }}
                      className="px-5 font-semibold bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      Yes, Add Forensic Evidence
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setHasEvidence(false);
                        setValidationError(null);
                        setCurrentStep(3); // Jump smoothly to Step 3
                      }}
                      className="px-5 border-slate-300"
                    >
                      No, Skip to Wiretaps
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between bg-blue-50/70 p-2.5 px-3 rounded-lg border border-blue-200 text-xs">
                    <span className="text-blue-900 font-medium flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-700" />
                      Forensic Evidence Enabled ({evidenceList.length} Items Logged)
                    </span>
                    <button
                      onClick={() => setHasEvidence(null)}
                      className="text-blue-700 underline text-[11px] hover:text-blue-900"
                    >
                      Change Answer
                    </button>
                  </div>

                  {evidenceList.map((item, idx) => (
                    <Card key={item.id} className="p-3.5 bg-slate-50/70 border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">Evidence Item #{idx + 1}</span>
                        {evidenceList.length > 1 && (
                          <button
                            onClick={() => removeEvidenceItem(idx)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Evidence Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEvidenceList(prev => prev.map((ev, i) => i === idx ? { ...ev, title: val } : ev));
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Event Type</label>
                          <select
                            value={item.eventType}
                            onChange={(e) => {
                              const val = e.target.value as TimelineEventType;
                              setEvidenceList(prev => prev.map((ev, i) => i === idx ? { ...ev, eventType: val } : ev));
                            }}
                            className="w-full px-2 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs"
                          >
                            <option value="CCTV Sighting">CCTV Sighting</option>
                            <option value="FIR Filed">FIR Filed</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Wire Transfer">Wire Transfer</option>
                            <option value="Arrest">Arrest</option>
                            <option value="Weapon Sighting">Weapon Sighting</option>
                            <option value="Border Crossing">Border Crossing</option>
                            <option value="Phone Calls">Phone Calls</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Location</label>
                          <input
                            type="text"
                            value={item.location}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEvidenceList(prev => prev.map((ev, i) => i === idx ? { ...ev, location: val } : ev));
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Confidence Score ({item.confidenceScore}%)</label>
                          <input
                            type="range"
                            min="50"
                            max="100"
                            value={item.confidenceScore}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setEvidenceList(prev => prev.map((ev, i) => i === idx ? { ...ev, confidenceScore: val } : ev));
                            }}
                            className="w-full accent-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Forensic Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEvidenceList(prev => prev.map((ev, i) => i === idx ? { ...ev, description: val } : ev));
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs"
                        />
                      </div>
                    </Card>
                  ))}

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={addEvidenceItem}
                    className="w-full gap-1.5 text-xs h-8 border-dashed"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Forensic Evidence Item
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: WIRETAP & TELECOMMUNICATIONS */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600" /> 3. Wiretaps & Telecommunications
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Step 3 of 5</span>
              </div>

              {/* Yes / No Question Card */}
              {hasWiretaps === null ? (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto shadow-subtle">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Are wiretaps or intercepted phone numbers active for this subject?</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Log active telecommunication nodes, IMEI trackers, burner cellular lines, and intercepted wiretap logs.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setHasWiretaps(true);
                        setValidationError(null);
                      }}
                      className="px-5 font-semibold bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      Yes, Add Wiretaps
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setHasWiretaps(false);
                        setValidationError(null);
                        setCurrentStep(4); // Jump smoothly to Step 4
                      }}
                      className="px-5 border-slate-300"
                    >
                      No, Skip to Financials
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between bg-emerald-50/70 p-2.5 px-3 rounded-lg border border-emerald-200 text-xs">
                    <span className="text-emerald-900 font-medium flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      Wiretap Telemetry Active ({wiretapList.length} Lines Monitored)
                    </span>
                    <button
                      onClick={() => setHasWiretaps(null)}
                      className="text-emerald-700 underline text-[11px] hover:text-emerald-900"
                    >
                      Change Answer
                    </button>
                  </div>

                  {wiretapList.map((item, idx) => (
                    <Card key={item.id} className="p-3.5 bg-slate-50/70 border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">Wiretap Node #{idx + 1}</span>
                        {wiretapList.length > 1 && (
                          <button
                            onClick={() => removeWiretapItem(idx)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Phone Number</label>
                          <input
                            type="text"
                            placeholder="+91 98201 88492"
                            value={item.phoneNumber}
                            onChange={(e) => {
                              const val = e.target.value;
                              setWiretapList(prev => prev.map((p, i) => i === idx ? { ...p, phoneNumber: val } : p));
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Carrier / Network</label>
                          <input
                            type="text"
                            placeholder="Airtel / Satellite VoIP"
                            value={item.carrier}
                            onChange={(e) => {
                              const val = e.target.value;
                              setWiretapList(prev => prev.map((p, i) => i === idx ? { ...p, carrier: val } : p));
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">IMEI Number</label>
                          <input
                            type="text"
                            placeholder="864920048192041"
                            value={item.imei}
                            onChange={(e) => {
                              const val = e.target.value;
                              setWiretapList(prev => prev.map((p, i) => i === idx ? { ...p, imei: val } : p));
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Line Status</label>
                          <select
                            value={item.status}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setWiretapList(prev => prev.map((p, i) => i === idx ? { ...p, status: val } : p));
                            }}
                            className="w-full px-2 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs"
                          >
                            <option value="TAPPED">TAPPED</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="BURNER">BURNER</option>
                            <option value="DISCONNECTED">DISCONNECTED</option>
                          </select>
                        </div>
                      </div>
                    </Card>
                  ))}

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={addWiretapItem}
                    className="w-full gap-1.5 text-xs h-8 border-dashed"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Wiretap Number
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: FINANCIAL ANOMALY & MONITORED ACCOUNTS */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-blue-600" /> 4. Financial Anomaly & Monitored Accounts
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Step 4 of 5</span>
              </div>

              {/* Yes / No Question Card */}
              {hasFinance === null ? (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mx-auto shadow-subtle">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Are monitored financial accounts or transaction anomalies identified?</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Log Angadia hawala books, offshore shell trusts, suspicious crypto wallets, and frozen accounts.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setHasFinance(true);
                        setValidationError(null);
                      }}
                      className="px-5 font-semibold bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      Yes, Add Financial Accounts
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setHasFinance(false);
                        setValidationError(null);
                        setCurrentStep(5); // Jump smoothly to Step 5
                      }}
                      className="px-5 border-slate-300"
                    >
                      No, Skip to Vehicles
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between bg-blue-50/70 p-2.5 px-3 rounded-lg border border-blue-200 text-xs">
                    <span className="text-blue-900 font-medium flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-700" />
                      Financial Tracking Active ({financialList.length} Accounts Monitored)
                    </span>
                    <button
                      onClick={() => setHasFinance(null)}
                      className="text-blue-700 underline text-[11px] hover:text-blue-900"
                    >
                      Change Answer
                    </button>
                  </div>

                  {financialList.map((item, idx) => (
                    <Card key={item.id} className="p-3.5 bg-slate-50/70 border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">Account / Wallet #{idx + 1}</span>
                        {financialList.length > 1 && (
                          <button
                            onClick={() => removeFinancialItem(idx)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Bank / Institution Name</label>
                          <input
                            type="text"
                            placeholder="Angadia Ledger / Swiss Trust"
                            value={item.bankName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFinancialList(prev => prev.map((f, i) => i === idx ? { ...f, bankName: val } : f));
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Account Number / Wallet ID</label>
                          <input
                            type="text"
                            placeholder="ACC-9921 / 0x71a..."
                            value={item.accountNumber}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFinancialList(prev => prev.map((f, i) => i === idx ? { ...f, accountNumber: val } : f));
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Monitored Balance</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={item.balance}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setFinancialList(prev => prev.map((f, i) => i === idx ? { ...f, balance: val } : f));
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs"
                            />
                            <select
                              value={item.currency}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFinancialList(prev => prev.map((f, i) => i === idx ? { ...f, currency: val } : f));
                              }}
                              className="px-2 rounded bg-white border border-slate-200 text-slate-900 text-xs"
                            >
                              <option value="INR">INR</option>
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="USDT">USDT</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Account Classification</label>
                          <select
                            value={item.accountType}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setFinancialList(prev => prev.map((f, i) => i === idx ? { ...f, accountType: val } : f));
                            }}
                            className="w-full px-2 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs"
                          >
                            <option value="OFFSHORE">OFFSHORE</option>
                            <option value="CRYPTO_WALLET">CRYPTO WALLET</option>
                            <option value="SHELL_CORP">SHELL CORP</option>
                            <option value="SAVINGS">SAVINGS</option>
                            <option value="CHECKING">CHECKING</option>
                          </select>
                        </div>
                      </div>
                    </Card>
                  ))}

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={addFinancialItem}
                    className="w-full gap-1.5 text-xs h-8 border-dashed"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Financial Node
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: VEHICLE DETAILS */}
          {/* ========================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-purple-600" /> 5. Vehicle & Mobile Asset Details
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Step 5 of 5</span>
              </div>

              {/* Yes / No Question Card */}
              {hasVehicles === null ? (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center mx-auto shadow-subtle">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Are vehicles or registered mobile assets identified?</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Log armored transport, convoy SUVs, registered license plates, and last sighted highway checkpoints.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setHasVehicles(true);
                        setValidationError(null);
                      }}
                      className="px-5 font-semibold bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      Yes, Add Vehicle Details
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setHasVehicles(false);
                        setValidationError(null);
                        setCurrentStep(6); // Jump smoothly to Review
                      }}
                      className="px-5 border-slate-300"
                    >
                      No, Skip to Final Review
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between bg-purple-50/70 p-2.5 px-3 rounded-lg border border-purple-200 text-xs">
                    <span className="text-purple-900 font-medium flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-purple-700" />
                      Vehicle Tracking Active ({vehicleList.length} Vehicles Logged)
                    </span>
                    <button
                      onClick={() => setHasVehicles(null)}
                      className="text-purple-700 underline text-[11px] hover:text-purple-900"
                    >
                      Change Answer
                    </button>
                  </div>

                  {vehicleList.map((item, idx) => (
                    <Card key={item.id} className="p-3.5 bg-slate-50/70 border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">Vehicle Record #{idx + 1}</span>
                        {vehicleList.length > 1 && (
                          <button
                            onClick={() => removeVehicleItem(idx)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Make & Model</label>
                          <input
                            type="text"
                            placeholder="Toyota Land Cruiser"
                            value={`${item.make} ${item.model}`}
                            onChange={(e) => {
                              const parts = e.target.value.split(' ');
                              const make = parts[0] || 'Unknown';
                              const model = parts.slice(1).join(' ') || 'Vehicle';
                              setVehicleList(prev => prev.map((v, i) => i === idx ? { ...v, make, model } : v));
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">License Plate Number</label>
                          <input
                            type="text"
                            placeholder="MH-01-EE-9988"
                            value={item.licensePlate}
                            onChange={(e) => {
                              const val = e.target.value;
                              setVehicleList(prev => prev.map((v, i) => i === idx ? { ...v, licensePlate: val } : v));
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Color / Registered Owner</label>
                          <input
                            type="text"
                            placeholder="Matte Black / Owner Name"
                            value={`${item.color} • ${item.registeredOwner}`}
                            onChange={(e) => {
                              const val = e.target.value;
                              setVehicleList(prev => prev.map((v, i) => i === idx ? { ...v, color: val.split('•')[0]?.trim() || 'Black', registeredOwner: val.split('•')[1]?.trim() || 'Owner' } : v));
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Last Sighted Location</label>
                          <input
                            type="text"
                            placeholder="Toll Plaza / Highway"
                            value={item.lastSeenLocation}
                            onChange={(e) => {
                              const val = e.target.value;
                              setVehicleList(prev => prev.map((v, i) => i === idx ? { ...v, lastSeenLocation: val } : v));
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={addVehicleItem}
                    className="w-full gap-1.5 text-xs h-8 border-dashed"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Vehicle Record
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: FINAL REVIEW & DISPATCH */}
          {/* ========================================================================= */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 6. Consolidated Dossier Review & Final Dispatch
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                  areAllStepsComplete ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-red-700 bg-red-50 border-red-200'
                }`}>
                  {areAllStepsComplete ? 'All 5 Steps Verified' : 'Incomplete Steps Detected'}
                </span>
              </div>

              {/* Suspect Identity Summary Card */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3.5">
                <img
                  src={photoUrl}
                  alt="Suspect"
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200 bg-white shadow-subtle shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{name || 'Unnamed Suspect'}</span>
                    <span className="text-slate-400 text-xs italic">("{alias || 'No Alias'}")</span>
                    <RiskBadge level={riskLevel} />
                    <StatusBadge status={status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Category: <strong className="text-slate-700">{crimeCategory}</strong> • Location: {city}, {country} • Age: {age} Yrs
                  </p>
                </div>
              </div>

              {/* Module Summary Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className={`p-2.5 rounded-md border ${hasEvidence ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">1. Forensics</span>
                  <span className="font-bold text-slate-900">
                    {hasEvidence ? `${evidenceList.length} Events Logged` : 'None / Skipped (No)'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-md border ${hasWiretaps ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">2. Wiretaps</span>
                  <span className="font-bold text-slate-900">
                    {hasWiretaps ? `${wiretapList.length} Lines Monitored` : 'None / Skipped (No)'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-md border ${hasFinance ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">3. Finance</span>
                  <span className="font-bold text-slate-900">
                    {hasFinance ? `${financialList.length} Accounts Monitored` : 'None / Skipped (No)'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-md border ${hasVehicles ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">4. Vehicles</span>
                  <span className="font-bold text-slate-900">
                    {hasVehicles ? `${vehicleList.length} Vehicles Tracked` : 'None / Skipped (No)'}
                  </span>
                </div>
              </div>

              {!areAllStepsComplete ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Dossier Cannot Be Submitted:</strong>
                    <span>One or more preceding steps have not been completed. Please navigate to each step and provide the required information or answers.</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Dossier Verified:</strong> All 5 intelligence modules are validated. Ready for real-time task force dispatch.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        <div className="p-3.5 px-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentStep === 1}
            onClick={() => {
              setValidationError(null);
              setCurrentStep(prev => Math.max(1, prev - 1));
            }}
            className="gap-1.5 h-8 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous Step
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs"
            >
              Cancel
            </Button>

            {currentStep < 6 ? (
              <Button
                variant="default"
                size="sm"
                onClick={handleNextStep}
                className="gap-1.5 h-8 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                disabled={submitting || !areAllStepsComplete}
                onClick={handleFinalSubmit}
                className="gap-1.5 h-8 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registering Dossier...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Create & Dispatch Suspect Dossier
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
