import React, { useState } from 'react';
import { Room } from '../../types/room';
import { Dancer } from '../../types/dancer';
import { Search, Settings, Mail, Download, Users, Sliders, AlertTriangle } from 'lucide-react';

interface ToolsSidebarProps {
  rooms: Room[];
  dancers: Dancer[];
  visibleRooms: number;
  onRoomConfigChange: (visibleRooms: number) => void;
  onEmailSchedule: () => void;
  onExportSchedule: () => void;
  conflicts?: Array<{dancer: string, routines: string[], time: string}>;
}

export const ToolsSidebar: React.FC<ToolsSidebarProps> = ({
  rooms,
  dancers,
  visibleRooms,
  onRoomConfigChange,
  onEmailSchedule,
  onExportSchedule,
  conflicts = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDancer, setSelectedDancer] = useState<string>('');

  const filteredDancers = dancers.filter(dancer =>
    dancer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Tools</h2>
        </div>
      </div>

      {/* Room Configuration */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Room Configuration</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Visible Rooms ({visibleRooms}/8)
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={visibleRooms}
              onChange={(e) => onRoomConfigChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>8</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-600">Active Rooms:</div>
            {rooms.slice(0, visibleRooms).map(room => (
              <div
                key={room.id}
                className={`flex items-center gap-2 text-xs p-2 rounded ${
                  room.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  room.isActive ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span>{room.name}</span>
                {room.capacity && (
                  <span className="ml-auto text-gray-500">({room.capacity})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dancer Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Dancer Search</span>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search dancers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {searchTerm && (
            <div className="max-h-32 overflow-y-auto space-y-1">
              {filteredDancers.map(dancer => (
                <div
                  key={dancer.id}
                  className={`p-2 text-xs rounded cursor-pointer transition-colors ${
                    selectedDancer === dancer.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDancer(dancer.id)}
                >
                  <div className="font-medium">{dancer.name}</div>
                  {dancer.level && (
                    <div className="text-gray-500 capitalize">{dancer.level}</div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {selectedDancer && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-xs text-blue-800">
                <div className="font-medium">Selected Dancer</div>
                <div className="mt-1">
                  {dancers.find(d => d.id === selectedDancer)?.name} is scheduled in 3 routines this week
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export & Email */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Download className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Export & Share</span>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={onEmailSchedule}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email Schedules
          </button>
          
          <button
            onClick={onExportSchedule}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Quick Stats</span>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Dancers:</span>
            <span className="font-medium">{dancers.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Active Rooms:</span>
            <span className="font-medium">{rooms.filter(r => r.isActive).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">This Week:</span>
            <span className="font-medium">12 routines</span>
          </div>
        </div>
      </div>

      {/* Conflicts Display */}
      {conflicts.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">⚠️ Conflicts</span>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {conflicts.map((conflict, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-xs font-bold text-red-900 mb-1">
                  {conflict.dancer}
                </div>
                <div className="text-xs text-red-700 mb-1">
                  Double-booked at {conflict.time}
                </div>
                <div className="text-xs text-red-600">
                  {conflict.routines.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
