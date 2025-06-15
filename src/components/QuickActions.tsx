import React from 'react';
import { Bell, FileText, AlertTriangle, RefreshCw } from 'lucide-react';

interface QuickActionsProps {
  onEmergencyAlert: () => void;
  onGenerateReport: () => void;
  onRefreshData: () => void;
}

export function QuickActions({ onEmergencyAlert, onGenerateReport, onRefreshData }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={onEmergencyAlert}
          className="flex items-center justify-center space-x-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-3 px-4 rounded-lg transition-colors border border-red-200"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Alert All Volunteers</span>
        </button>
        
        <button
          onClick={onGenerateReport}
          className="flex items-center justify-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-3 px-4 rounded-lg transition-colors border border-blue-200"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Report</span>
        </button>
        
        <button
          onClick={onRefreshData}
          className="flex items-center justify-center space-x-2 bg-teal-100 hover:bg-teal-200 text-teal-800 font-medium py-3 px-4 rounded-lg transition-colors border border-teal-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </div>
    </div>
  );
}