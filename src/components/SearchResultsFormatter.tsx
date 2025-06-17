import React from 'react';
import { formatSearchResultsWithLists, useResponsiveListSpacing, FormattedSearchResult } from '../utils/listFormatter';

interface SearchResultsFormatterProps {
  searchResults: any[];
  searchTerm: string;
  onResultSelect: (result: any) => void;
  className?: string;
}

export function SearchResultsFormatter({
  searchResults,
  searchTerm,
  onResultSelect,
  className = ''
}: SearchResultsFormatterProps) {
  const { spacingConfig } = useResponsiveListSpacing();
  
  const formattedResults = React.useMemo(() => {
    return formatSearchResultsWithLists(searchResults, spacingConfig);
  }, [searchResults, spacingConfig]);

  if (searchResults.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600 mb-4">
          No volunteers found matching "{searchTerm}"
        </p>
        <p className="text-sm text-gray-500">
          Try checking the spelling or use a different search term
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="text-xs text-gray-500 px-3 py-2 font-medium border-b border-gray-100">
        Found {searchResults.length} volunteer{searchResults.length !== 1 ? 's' : ''}
        {formattedResults.some(r => r.hasLists) && (
          <span className="ml-2 text-blue-600">• Contains structured information</span>
        )}
      </div>
      
      {formattedResults.map((result, index) => (
        <SearchResultItem
          key={index}
          result={result}
          originalData={searchResults[index]}
          onSelect={() => onResultSelect(searchResults[index])}
        />
      ))}
    </div>
  );
}

interface SearchResultItemProps {
  result: FormattedSearchResult;
  originalData: any;
  onSelect: () => void;
}

function SearchResultItem({ result, originalData, onSelect }: SearchResultItemProps) {
  const volunteer = originalData;
  const primaryRole = volunteer.roles?.[0];

  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-4 hover:bg-teal-50 rounded-lg transition-all group border border-transparent hover:border-teal-200"
    >
      {/* Volunteer Header */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">
            {volunteer.firstName?.[0]}{volunteer.lastName?.[0]}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 group-hover:text-teal-700 truncate">
            {volunteer.firstName} {volunteer.lastName}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              volunteer.gender === 'male' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-pink-100 text-pink-800'
            }`}>
              {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
            </span>
            {primaryRole && (
              <span className="text-xs text-blue-600">
                {primaryRole.type?.replace('_', ' ')} • {primaryRole.day}
              </span>
            )}
          </div>
        </div>
        <div className="text-gray-400 group-hover:text-teal-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Formatted Content with Lists */}
      {result.hasLists && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-700">
            <div className="mb-2 font-medium text-gray-900">Assignment Details:</div>
            <div 
              className="formatted-list-content"
              dangerouslySetInnerHTML={{ __html: result.formattedContent }}
            />
          </div>
          
          {/* Metadata */}
          <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
            <span>{result.metadata.totalItems} items</span>
            {result.metadata.maxNestingLevel > 0 && (
              <span>{result.metadata.maxNestingLevel} levels deep</span>
            )}
            <span>{result.metadata.listTypes.join(', ')} content</span>
          </div>
        </div>
      )}

      {/* Role Summary for Non-List Content */}
      {!result.hasLists && volunteer.roles && volunteer.roles.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="space-y-2">
            {volunteer.roles.slice(0, 2).map((role: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 capitalize font-medium truncate">
                  {role.type?.replace('_', ' ')}
                  {role.timeLabel && ` (${role.timeLabel})`}
                </span>
                {role.day && (
                  <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ml-2 ${
                    role.day === 'Friday' ? 'bg-blue-100 text-blue-700' :
                    role.day === 'Saturday' ? 'bg-green-100 text-green-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {role.day}
                  </span>
                )}
              </div>
            ))}
            {volunteer.roles.length > 2 && (
              <div className="text-xs text-gray-500 font-medium">
                +{volunteer.roles.length - 2} more assignment{volunteer.roles.length - 2 !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      )}
    </button>
  );
}

export default SearchResultsFormatter;