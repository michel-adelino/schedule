import React, { useState } from 'react';
import { Routine, Dancer, Teacher, Genre } from '../../types/routine';
import { X, Save, Trash2, Users, Clock, User, Tag } from 'lucide-react';

interface RoutineDetailsModalProps {
  routine: Routine | null;
  dancers: Dancer[];
  teachers: Teacher[];
  genres: Genre[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (routine: Routine) => void;
  onDelete: (routineId: string) => void;
}

export const RoutineDetailsModal: React.FC<RoutineDetailsModalProps> = ({
  routine,
  dancers,
  teachers,
  genres,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [editedRoutine, setEditedRoutine] = useState<Routine | null>(null);

  React.useEffect(() => {
    if (routine) {
      setEditedRoutine({ ...routine });
    }
  }, [routine]);

  if (!isOpen || !editedRoutine) return null;

  const handleSave = () => {
    onSave(editedRoutine);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this routine?')) {
      onDelete(editedRoutine.id);
      onClose();
    }
  };

  const toggleDancer = (dancerId: string) => {
    setEditedRoutine(prev => {
      if (!prev) return prev;
      
      const isSelected = prev.dancers.some(d => d.id === dancerId);
      const dancer = dancers.find(d => d.id === dancerId);
      
      if (!dancer) return prev;
      
      return {
        ...prev,
        dancers: isSelected 
          ? prev.dancers.filter(d => d.id !== dancerId)
          : [...prev.dancers, dancer]
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Routine Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Song Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Song Title
              </label>
              <input
                type="text"
                value={editedRoutine.songTitle}
                onChange={(e) => setEditedRoutine(prev => 
                  prev ? { ...prev, songTitle: e.target.value } : prev
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Teacher and Genre */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Teacher
                </label>
                <select
                  value={editedRoutine.teacher.id}
                  onChange={(e) => {
                    const teacher = teachers.find(t => t.id === e.target.value);
                    if (teacher) {
                      setEditedRoutine(prev => 
                        prev ? { ...prev, teacher } : prev
                      );
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Genre
                </label>
                <select
                  value={editedRoutine.genre.id}
                  onChange={(e) => {
                    const genre = genres.find(g => g.id === e.target.value);
                    if (genre) {
                      setEditedRoutine(prev => 
                        prev ? { ...prev, genre, color: genre.color } : prev
                      );
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Duration (minutes)
              </label>
              <input
                type="number"
                value={editedRoutine.duration}
                onChange={(e) => setEditedRoutine(prev => 
                  prev ? { ...prev, duration: parseInt(e.target.value) || 0 } : prev
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="15"
                max="240"
                step="15"
              />
            </div>

            {/* Dancers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Users className="w-4 h-4 inline mr-1" />
                Dancers ({editedRoutine.dancers.length} selected)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {dancers.map(dancer => {
                  const isSelected = editedRoutine.dancers.some(d => d.id === dancer.id);
                  return (
                    <label
                      key={dancer.id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleDancer(dancer.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{dancer.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={editedRoutine.notes || ''}
                onChange={(e) => setEditedRoutine(prev => 
                  prev ? { ...prev, notes: e.target.value } : prev
                )}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any notes about this routine..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
