import React, { useState } from 'react';
import { Criminal } from '../../types';
import { deleteCriminal } from '../../api/criminals';
import { Button } from '../ui/button';
import { RiskBadge } from '../common/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';
import {
  AlertTriangle,
  Trash2,
  X,
  ShieldAlert,
  Phone,
  Car,
  Landmark,
  Network
} from 'lucide-react';

interface DeleteCriminalConfirmModalProps {
  isOpen: boolean;
  criminal: Criminal | null;
  onClose: () => void;
  onSuccess: (deletedId: string) => void;
}

export const DeleteCriminalConfirmModal: React.FC<DeleteCriminalConfirmModalProps> = ({
  isOpen,
  criminal,
  onClose,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { addNotification } = useNotifications();

  if (!isOpen || !criminal) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteCriminal(criminal.id);
      if (res.success) {
        addNotification({
          title: '🗑️ Intelligence Dossier Purged',
          message: `Subject ${criminal.name} (${criminal.criminalId}) was permanently removed from the ACN Intelligence Grid.`,
          type: 'suspect',
          severity: 'HIGH',
        });
        onSuccess(criminal.id);
        onClose();
      }
    } catch (err) {
      console.error('Error during deletion:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-red-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-50 px-5 py-4 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-red-700">
            <div className="p-2 rounded-lg bg-red-100 border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-red-600 uppercase">
                SECURITY PURGE PROTOCOL
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Confirm Dossier Deletion
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently purge this classified subject dossier? This operation will remove all intelligence records from the live surveillance grid.
          </p>

          {/* Suspect Quick Card */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3.5">
            <img
              src={criminal.photoUrl}
              alt={criminal.name}
              className="w-14 h-14 rounded-lg object-cover border border-slate-300 shadow-sm shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded">
                  {criminal.criminalId}
                </span>
                <RiskBadge level={criminal.riskLevel} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 truncate mt-1">
                {criminal.name}
              </h4>
              <p className="text-xs text-slate-500 truncate">
                Alias: <strong className="text-slate-700 font-semibold">"{criminal.alias}"</strong> • {criminal.crimeCategory}
              </p>
            </div>
          </div>

          {/* Impact list */}
          <div className="bg-red-50/60 rounded-lg p-3 border border-red-100/80 space-y-2">
            <span className="text-[11px] font-bold text-red-900 block">
              Records to be purged from ACN database:
            </span>
            <ul className="text-[11px] text-red-800 space-y-1">
              <li className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Identity, biometrics, and threat index model</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{criminal.phoneNumbers?.length || 0} monitored wiretaps & telemetry lines</span>
              </li>
              <li className="flex items-center gap-2">
                <Car className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{criminal.vehicles?.length || 0} tracked vehicle registrations & sightings</span>
              </li>
              <li className="flex items-center gap-2">
                <Landmark className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{criminal.financialAccounts?.length || 0} linked banking & crypto accounts</span>
              </li>
              <li className="flex items-center gap-2">
                <Network className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Dynamic graph linkages across all associate nodes</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="text-xs"
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Purging Dossier...' : 'Permanently Delete'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
