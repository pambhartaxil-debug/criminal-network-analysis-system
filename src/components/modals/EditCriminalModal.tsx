import React, { useState, useEffect } from 'react';
import {
  Criminal,
  CrimeCategory,
  RiskLevel,
  SuspectStatus,
  PhoneRecord,
  FinancialAccount,
  Vehicle,
  TimelineEvent,
  TimelineEventType
} from '../../types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { RiskBadge, StatusBadge } from '../common/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';
import { updateCriminal } from '../../api/criminals';
import {
  X,
  User,
  Shield,
  Phone,
  CreditCard,
  Car,
  MapPin,
  Save,
  Plus,
  Trash2,
  Sparkles,
  AlertTriangle,
  Building2,
  FileText
} from 'lucide-react';

interface EditCriminalModalProps {
  isOpen: boolean;
  criminal: Criminal | null;
  onClose: () => void;
  onSuccess: (updated: Criminal) => void;
}

export const EditCriminalModal: React.FC<EditCriminalModalProps> = ({
  isOpen,
  criminal,
  onClose,
  onSuccess,
}) => {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'profile' | 'location' | 'evidence' | 'phones' | 'finance' | 'vehicles'>('profile');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState('Male');
  const [nationality, setNationality] = useState('Indian');
  const [crimeCategory, setCrimeCategory] = useState<CrimeCategory>('Extortion');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('HIGH');
  const [riskScore, setRiskScore] = useState<number>(85);
  const [status, setStatus] = useState<SuspectStatus>('WANTED');
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [fingerprintId, setFingerprintId] = useState('');

  // Location & Intel
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [country, setCountry] = useState('India');
  const [lat, setLat] = useState<number>(19.0176);
  const [lng, setLng] = useState<number>(72.8150);
  const [biography, setBiography] = useState('');
  const [aiThreatSummary, setAiThreatSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Structured sub-lists
  const [evidenceList, setEvidenceList] = useState<TimelineEvent[]>([]);
  const [wiretapList, setWiretapList] = useState<PhoneRecord[]>([]);
  const [financialList, setFinancialList] = useState<FinancialAccount[]>([]);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);

  // Sync state when criminal prop changes
  useEffect(() => {
    if (criminal) {
      setName(criminal.name || '');
      setAlias(criminal.alias || '');
      setPhotoUrl(criminal.photoUrl || '');
      setAge(criminal.age || 35);
      setGender(criminal.gender || 'Male');
      setNationality(criminal.nationality || 'Indian');
      setCrimeCategory(criminal.crimeCategory || 'Extortion');
      setRiskLevel(criminal.riskLevel || 'HIGH');
      setRiskScore(criminal.riskScore || 80);
      setStatus(criminal.status || 'WANTED');
      setDob(criminal.personalDetails?.dob || '1990-01-01');
      setBloodGroup(criminal.personalDetails?.bloodGroup || 'O+');
      setFingerprintId(criminal.personalDetails?.fingerprintId || `FP-ACN-${Math.floor(100000 + Math.random() * 900000)}`);

      setAddress(criminal.lastKnownLocation?.address || '');
      setCity(criminal.lastKnownLocation?.city || 'Mumbai');
      setCountry(criminal.lastKnownLocation?.country || 'India');
      setLat(criminal.lastKnownLocation?.coordinates?.[0] || 19.0176);
      setLng(criminal.lastKnownLocation?.coordinates?.[1] || 72.8150);
      setBiography(criminal.biography || '');
      setAiThreatSummary(criminal.aiThreatSummary || '');
      setTagsInput((criminal.tags || []).join(', '));

      setEvidenceList(criminal.timeline || []);
      setWiretapList(criminal.phoneNumbers || []);
      setFinancialList(criminal.financialAccounts || []);
      setVehicleList(criminal.vehicles || []);
      setError(null);
    }
  }, [criminal, isOpen]);

  if (!isOpen || !criminal) return null;

  // Add Item Helpers
  const addEvidenceItem = () => {
    setEvidenceList(prev => [
      ...prev,
      {
        id: `evt-${Date.now()}-${prev.length + 1}`,
        title: 'Forensic Surveillance Sighting',
        eventType: 'CCTV Sighting',
        timestamp: new Date().toISOString(),
        location: `${city}, ${country}`,
        description: 'New forensic sighting logged by field unit.',
        confidenceScore: 92,
        severity: riskLevel,
        isVerified: true
      }
    ]);
  };

  const addWiretapItem = () => {
    setWiretapList(prev => [
      ...prev,
      {
        id: `phone-${Date.now()}-${prev.length + 1}`,
        phoneNumber: `+91 ${Math.floor(90000 + Math.random() * 90000)} ${Math.floor(10000 + Math.random() * 90000)}`,
        carrier: 'Airtel / Encrypted VoIP',
        imei: `8675430${Math.floor(10000000 + Math.random() * 90000000)}`,
        ownerName: alias || name,
        status: 'TAPPED',
        totalCallsLogged: 1,
        lastActive: new Date().toISOString(),
        frequentContacts: []
      }
    ]);
  };

  const addFinancialItem = () => {
    setFinancialList(prev => [
      ...prev,
      {
        id: `fin-${Date.now()}-${prev.length + 1}`,
        bankName: 'Offshore Cryptographic Trust',
        accountNumber: '0x' + Math.random().toString(16).substring(2, 14),
        accountType: 'CRYPTO_WALLET',
        balance: 250000,
        currency: 'USDT',
        holderName: alias || name,
        flaggedTransactionsCount: 2,
        status: 'MONITORED'
      }
    ]);
  };

  const addVehicleItem = () => {
    setVehicleList(prev => [
      ...prev,
      {
        id: `veh-${Date.now()}-${prev.length + 1}`,
        make: 'Mahindra',
        model: 'Scorpio-N (Bulletproof)',
        year: 2025,
        color: 'Black',
        licensePlate: `MH-02-${Math.random().toString(36).substring(2, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        registeredOwner: alias || name,
        status: 'ACTIVE',
        lastSeenLocation: `${city} Sector`,
        lastSeenTime: 'Just now'
      }
    ]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Suspect Full Name is required.');
      return;
    }

    setSaving(true);
    setError(null);

    const parsedTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const updatedCriminal: Criminal = {
      ...criminal,
      name: name.trim(),
      alias: alias.trim() || 'Target',
      photoUrl: photoUrl || criminal.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      age: Number(age) || criminal.age || 35,
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
      biography: biography || criminal.biography || 'Classified intelligence summary.',
      aiThreatSummary: aiThreatSummary || `ACN Neural Core classified subject threat level as ${riskLevel} (${riskScore}/100).`,
      personalDetails: {
        ...criminal.personalDetails,
        dob: dob || criminal.personalDetails?.dob || '1990-01-01',
        bloodGroup: bloodGroup || 'O+',
        fingerprintId: fingerprintId || criminal.personalDetails?.fingerprintId || 'FP-ACN-881'
      },
      vehicles: vehicleList,
      phoneNumbers: wiretapList,
      financialAccounts: financialList,
      timeline: evidenceList,
      tags: parsedTags.length > 0 ? parsedTags : (criminal.tags || ['Monitored'])
    };

    try {
      await updateCriminal(updatedCriminal);
      addNotification({
        title: `📝 Target Dossier Updated: ${updatedCriminal.name}`,
        message: `Dossier #${updatedCriminal.criminalId} modified. Risk: ${updatedCriminal.riskLevel} (${updatedCriminal.riskScore}/100) • ${updatedCriminal.crimeCategory}.`,
        type: 'suspect',
        severity: updatedCriminal.riskLevel,
        link: '/criminals'
      });
      onSuccess(updatedCriminal);
      onClose();
    } catch (err) {
      console.error(err);
      onSuccess(updatedCriminal);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={photoUrl || criminal.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
              alt={criminal.name}
              className="w-11 h-11 rounded-lg object-cover border border-slate-700 bg-slate-800"
            />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-slate-200">
                  {criminal.criminalId}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-300">
                  EDIT CLASSIFIED INTELLIGENCE DOSSIER
                </span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Editing: {name || criminal.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs shrink-0">
          {[
            { id: 'profile', label: '1. Identity & Biometrics', icon: User },
            { id: 'location', label: '2. Location & Biography', icon: MapPin },
            { id: 'evidence', label: `3. Evidence (${evidenceList.length})`, icon: Shield },
            { id: 'phones', label: `4. Wiretaps (${wiretapList.length})`, icon: Phone },
            { id: 'finance', label: `5. Accounts (${financialList.length})`, icon: CreditCard },
            { id: 'vehicles', label: `6. Vehicles (${vehicleList.length})`, icon: Car },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 font-medium transition-colors shrink-0 ${
                  activeTab === tab.id
                    ? 'border-slate-900 text-slate-900 font-bold bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          
          {/* TAB 1: IDENTITY & BIOMETRICS */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700">Full Legal Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Street Alias / Moniker</label>
                  <input
                    type="text"
                    value={alias}
                    onChange={e => setAlias(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Crime Category</label>
                  <select
                    value={crimeCategory}
                    onChange={e => setCrimeCategory(e.target.value as CrimeCategory)}
                    className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="Extortion">Extortion & Racketeering</option>
                    <option value="Drug Trafficking">Drug Trafficking</option>
                    <option value="Money Laundering">Money Laundering</option>
                    <option value="Arms Smuggling">Arms Smuggling</option>
                    <option value="Cybercrime">Cybercrime & Ransomware</option>
                    <option value="Organized Heist">Organized Heist</option>
                    <option value="Human Trafficking">Human Trafficking</option>
                    <option value="Terrorism Financing">Terrorism Financing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Surveillance Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as SuspectStatus)}
                    className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="WANTED">WANTED (Active Fugitive)</option>
                    <option value="UNDER_SURVEILLANCE">UNDER SURVEILLANCE</option>
                    <option value="IN_CUSTODY">IN CUSTODY</option>
                    <option value="BAIL">ON BAIL</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Risk Level</label>
                  <select
                    value={riskLevel}
                    onChange={e => setRiskLevel(e.target.value as RiskLevel)}
                    className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="CRITICAL">CRITICAL (Priority Red)</option>
                    <option value="HIGH">HIGH (Defcon 2)</option>
                    <option value="MEDIUM">MEDIUM (Standard)</option>
                    <option value="LOW">LOW (Observational)</option>
                  </select>
                </div>
              </div>

              {/* Risk Slider & Photo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-700">Calculated Threat Index</label>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-white">
                      {riskScore}/100
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={riskScore}
                    onChange={e => setRiskScore(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <span className="text-[10px] text-slate-500">Drag to adjust AI risk scoring score</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Photo URL</label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={e => setPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Biometrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-600">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-600">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-600">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-600">Blood Group</label>
                  <input
                    type="text"
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-600">Biometric Fingerprint Record ID</label>
                <input
                  type="text"
                  value={fingerprintId}
                  onChange={e => setFingerprintId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LOCATION & BIOGRAPHY */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700">Last Known Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-600">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-600">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={e => setLat(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-600">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={lng}
                    onChange={e => setLng(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Official Investigative Biography</label>
                <textarea
                  rows={3}
                  value={biography}
                  onChange={e => setBiography(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-md border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">AI Threat Summary Callout</label>
                <textarea
                  rows={2}
                  value={aiThreatSummary}
                  onChange={e => setAiThreatSummary(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-md border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Surveillance Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300"
                />
              </div>
            </div>
          )}

          {/* TAB 3: EVIDENCE */}
          {activeTab === 'evidence' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Forensic Incident & Sighting Records</span>
                <Button variant="secondary" size="sm" onClick={addEvidenceItem} className="gap-1 text-xs h-7">
                  <Plus className="w-3.5 h-3.5" /> Add Evidence Sighting
                </Button>
              </div>

              {evidenceList.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 border border-slate-200 rounded-lg">
                  No forensic evidence attached. Click "Add Evidence Sighting" above.
                </div>
              ) : (
                evidenceList.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={e => {
                          const val = e.target.value;
                          setEvidenceList(prev => prev.map((it, i) => i === idx ? { ...it, title: val } : it));
                        }}
                        className="font-semibold text-xs text-slate-900 bg-white px-2 py-1 border border-slate-200 rounded flex-1"
                      />
                      <button
                        onClick={() => setEvidenceList(prev => prev.filter((_, i) => i !== idx))}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <input
                        type="text"
                        value={item.location}
                        placeholder="Location"
                        onChange={e => {
                          const val = e.target.value;
                          setEvidenceList(prev => prev.map((it, i) => i === idx ? { ...it, location: val } : it));
                        }}
                        className="bg-white px-2 py-1 border border-slate-200 rounded"
                      />
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={item.confidenceScore}
                        placeholder="Confidence %"
                        onChange={e => {
                          const val = Number(e.target.value);
                          setEvidenceList(prev => prev.map((it, i) => i === idx ? { ...it, confidenceScore: val } : it));
                        }}
                        className="bg-white px-2 py-1 border border-slate-200 rounded font-mono"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: PHONES */}
          {activeTab === 'phones' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Wiretapped & Intercepted Phone Records</span>
                <Button variant="secondary" size="sm" onClick={addWiretapItem} className="gap-1 text-xs h-7">
                  <Plus className="w-3.5 h-3.5" /> Add Phone / Wiretap
                </Button>
              </div>

              {wiretapList.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 border border-slate-200 rounded-lg">
                  No wiretapped numbers active. Click "Add Phone / Wiretap" above.
                </div>
              ) : (
                wiretapList.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={item.phoneNumber}
                        onChange={e => {
                          const val = e.target.value;
                          setWiretapList(prev => prev.map((it, i) => i === idx ? { ...it, phoneNumber: val } : it));
                        }}
                        className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-1 border border-slate-200 rounded flex-1"
                      />
                      <button
                        onClick={() => setWiretapList(prev => prev.filter((_, i) => i !== idx))}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <input
                        type="text"
                        value={item.carrier}
                        placeholder="Carrier"
                        onChange={e => {
                          const val = e.target.value;
                          setWiretapList(prev => prev.map((it, i) => i === idx ? { ...it, carrier: val } : it));
                        }}
                        className="bg-white px-2 py-1 border border-slate-200 rounded"
                      />
                      <input
                        type="text"
                        value={item.imei}
                        placeholder="IMEI Number"
                        onChange={e => {
                          const val = e.target.value;
                          setWiretapList(prev => prev.map((it, i) => i === idx ? { ...it, imei: val } : it));
                        }}
                        className="bg-white px-2 py-1 border border-slate-200 rounded font-mono"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: FINANCE */}
          {activeTab === 'finance' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Monitored Financial & Crypto Nodes</span>
                <Button variant="secondary" size="sm" onClick={addFinancialItem} className="gap-1 text-xs h-7">
                  <Plus className="w-3.5 h-3.5" /> Add Financial Account
                </Button>
              </div>

              {financialList.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 border border-slate-200 rounded-lg">
                  No financial accounts logged. Click "Add Financial Account" above.
                </div>
              ) : (
                financialList.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={item.bankName}
                        onChange={e => {
                          const val = e.target.value;
                          setFinancialList(prev => prev.map((it, i) => i === idx ? { ...it, bankName: val } : it));
                        }}
                        className="font-semibold text-xs text-slate-900 bg-white px-2 py-1 border border-slate-200 rounded flex-1"
                      />
                      <button
                        onClick={() => setFinancialList(prev => prev.filter((_, i) => i !== idx))}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <input
                        type="text"
                        value={item.accountNumber}
                        placeholder="Account / Wallet"
                        onChange={e => {
                          const val = e.target.value;
                          setFinancialList(prev => prev.map((it, i) => i === idx ? { ...it, accountNumber: val } : it));
                        }}
                        className="bg-white px-2 py-1 border border-slate-200 rounded font-mono"
                      />
                      <input
                        type="number"
                        value={item.balance}
                        placeholder="Balance"
                        onChange={e => {
                          const val = Number(e.target.value);
                          setFinancialList(prev => prev.map((it, i) => i === idx ? { ...it, balance: val } : it));
                        }}
                        className="bg-white px-2 py-1 border border-slate-200 rounded font-mono"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 6: VEHICLES */}
          {activeTab === 'vehicles' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Tracked Vehicles & Transport Assets</span>
                <Button variant="secondary" size="sm" onClick={addVehicleItem} className="gap-1 text-xs h-7">
                  <Plus className="w-3.5 h-3.5" /> Add Vehicle
                </Button>
              </div>

              {vehicleList.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 border border-slate-200 rounded-lg">
                  No vehicles attached. Click "Add Vehicle" above.
                </div>
              ) : (
                vehicleList.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={item.licensePlate}
                        onChange={e => {
                          const val = e.target.value;
                          setVehicleList(prev => prev.map((it, i) => i === idx ? { ...it, licensePlate: val } : it));
                        }}
                        className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-1 border border-slate-200 rounded flex-1"
                      />
                      <button
                        onClick={() => setVehicleList(prev => prev.filter((_, i) => i !== idx))}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <input
                        type="text"
                        value={item.model}
                        placeholder="Make & Model"
                        onChange={e => {
                          const val = e.target.value;
                          setVehicleList(prev => prev.map((it, i) => i === idx ? { ...it, model: val } : it));
                        }}
                        className="bg-white px-2 py-1 border border-slate-200 rounded"
                      />
                      <input
                        type="text"
                        value={item.color}
                        placeholder="Color"
                        onChange={e => {
                          const val = e.target.value;
                          setVehicleList(prev => prev.map((it, i) => i === idx ? { ...it, color: val } : it));
                        }}
                        className="bg-white px-2 py-1 border border-slate-200 rounded"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] font-mono text-slate-500">
            Dossier ID: <strong>{criminal.criminalId}</strong>
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs"
            >
              Cancel
            </Button>

            <Button
              variant="default"
              size="sm"
              disabled={saving}
              onClick={handleSave}
              className="gap-1.5 h-8 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
            >
              {saving ? (
                <span>Saving Changes...</span>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save & Update Dossier
                </>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
