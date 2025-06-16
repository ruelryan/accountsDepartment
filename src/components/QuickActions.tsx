import React from 'react';
import { AlertTriangle, FileText, RefreshCw, Save, CheckCircle } from 'lucide-react';

interface QuickActionsProps {
  onEmergencyAlert: () => void;
  onGenerateReport: () => void;
  onRefreshData: () => void;
  onSaveChanges?: () => void;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
}

export function QuickActions({ 
  onEmergencyAlert, 
  onGenerateReport, 
  onRefreshData,
  onSaveChanges,
  hasUnsavedChanges = false,
  isSaving = false
}: QuickActionsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4">
      <h3 className="font-medium text-gray-900 mb-4 text-sm sm:text-base">Actions</h3>
      
      <div className="space-y-2">
        {/* Save Changes Button */}
        {onSaveChanges && (
          <button
            onClick={onSaveChanges}
            disabled={!hasUnsavedChanges || isSaving}
            className={`w-full flex items-center justify-center space-x-2 font-medium py-2 px-3 rounded border transition-all text-sm ${
              hasUnsavedChanges && !isSaving
                ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>All Saved</span>
              </>
            )}
          </button>
        )}
        
        <button
          onClick={onEmergencyAlert}
          className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-3 rounded border border-red-200 transition-colors text-sm"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Alert All</span>
        </button>
        
        <button
          onClick={onGenerateReport}
          className="w-full flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-3 rounded border border-blue-200 transition-colors text-sm"
        >
          <FileText className="w-4 h-4" />
          <span>Report</span>
        </button>
        
        <button
          onClick={onRefreshData}
          className="w-full flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-3 rounded border border-gray-200 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}