'use client';

import { useState, useEffect, useRef } from 'react';
import { EyeOff, Eye, Pencil, Settings, GripVertical } from 'lucide-react';
import type { AnnotationMode, AnnotationTheme } from '../lib/types';

interface AnnotationControllerProps {
  mode: AnnotationMode;
  setMode: (mode: AnnotationMode) => void;
  user: string;
  setUser: (user: string) => void;
  annotationCount: number;
  zIndex?: number;
  theme?: AnnotationTheme;
}

const STORAGE_KEY_POSITION = '@annotation-system/controller-position';

function getInitialPosition() {
  if (typeof window === 'undefined') return { x: 600, y: 500 };
  const stored = localStorage.getItem(STORAGE_KEY_POSITION);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { x: window.innerWidth - 200, y: window.innerHeight - 100 };
    }
  }
  return { x: window.innerWidth - 200, y: window.innerHeight - 100 };
}

export function AnnotationController({
  mode,
  setMode,
  user,
  setUser,
  annotationCount,
  zIndex = 500,
  theme,
}: AnnotationControllerProps) {
  const [editingUser, setEditingUser] = useState(false);
  const [tempUser, setTempUser] = useState(user);
  const [position, setPosition] = useState(getInitialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });

  const primaryColor = theme?.primary ?? '#ef4444';
  const secondaryColor = theme?.secondary ?? '#3b82f6';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_POSITION, JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    const handleResize = () => {
      if (!isDragging) {
        setPosition((prev: { x: number; y: number }) => ({
          x: Math.min(prev.x, window.innerWidth - 180),
          y: Math.min(prev.y, window.innerHeight - 160),
        }));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDragging]);

  const modes: { value: AnnotationMode; label: string }[] = [
    { value: 'off', label: 'Off' },
    { value: 'view', label: 'View' },
    { value: 'edit', label: 'Edit' },
  ];

  const handleUserSave = () => {
    if (tempUser.trim()) {
      setUser(tempUser.trim());
    }
    setEditingUser(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;

    setIsDragging(true);
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.startPosX = position.x;
    dragRef.current.startPosY = position.y;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      const maxX = window.innerWidth - 180;
      const maxY = window.innerHeight - 160;

      setPosition({
        x: Math.max(0, Math.min(maxX, dragRef.current.startPosX + deltaX)),
        y: Math.max(0, Math.min(maxY, dragRef.current.startPosY + deltaY)),
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className={`fixed bg-white rounded-lg shadow-sm border border-gray-100 p-3 select-none transition-shadow ${
        isDragging ? 'shadow-2xl cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        left: position.x,
        top: position.y,
        zIndex: zIndex + 400,
        backgroundColor: theme?.panelBg ?? '#ffffff',
        color: theme?.panelText ?? '#374151',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center gap-2 mb-3">
        <GripVertical className="w-4 h-4 text-gray-400" />
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor:
              mode === 'off' ? '#9ca3af' : mode === 'view' ? secondaryColor : primaryColor,
          }}
        />
        <span className="text-sm font-medium">Annotations</span>
        {annotationCount > 0 && (
          <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">
            {annotationCount}
          </span>
        )}
      </div>

      <div className="flex gap-1 mb-3">
        {modes.map((m) => {
          const isActive = mode === m.value;
          const activeColor =
            m.value === 'edit' ? primaryColor : m.value === 'view' ? secondaryColor : '#6b7280';

          return (
            <button
              key={m.value}
              onClick={(e) => {
                e.stopPropagation();
                setMode(m.value);
              }}
              className="mode-button flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1"
              style={{
                backgroundColor: isActive ? activeColor : '#f3f4f6',
                color: isActive ? '#ffffff' : '#4b5563',
              }}
            >
              {m.value === 'off' && <EyeOff className="w-4 h-4" />}
              {m.value === 'view' && <Eye className="w-4 h-4" />}
              {m.value === 'edit' && <Pencil className="w-4 h-4" />}
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-gray-500">
          <Settings className="w-3 h-3" />
          <span>User:</span>
        </div>
        {editingUser ? (
          <div className="flex gap-1">
            <input
              type="text"
              value={tempUser}
              onChange={(e) => setTempUser(e.target.value)}
              className="text-xs px-2 py-0.5 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-16"
              onKeyDown={(e) => e.key === 'Enter' && handleUserSave()}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUserSave();
              }}
              className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingUser(true);
            }}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {user}
          </button>
        )}
      </div>

      <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
        {mode === 'edit' && <p>Click to create annotation</p>}
        {mode === 'view' && <p>Click annotations to view</p>}
        {mode === 'off' && <p>Annotations hidden</p>}
      </div>
    </div>
  );
}
