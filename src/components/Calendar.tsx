/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import HeaderMenu from './HeaderMenu';
import CalendarTable from './CalendarTable';
import PlanModal from './PlanModal';
import api from '../services/api/calendarPlan';
import { phaseStyles, daysInMonth, monthNames } from '../constants/phaseStyles';
import usePaintCellHandler from './calendarHandlers/handlePaintCell';
import useMarkFreeDayHandler from './calendarHandlers/handleMarkFreeDay';
import useCreatePlanHandler from './calendarHandlers/handleCreatePlan';
import useConfirmCreatePlanHandler from './calendarHandlers/handleConfirmCreatePlan';
import useDownloadPlanHandler from './calendarHandlers/handleDownloadPlan';
import useSavePlanHandler from './calendarHandlers/handleSavePlan';
import useLoadPlanHandler from './calendarHandlers/handleLoadPlan';
import { FixedRadialMenu } from './index';

// --- Main Calendar ---
type PaintMap = {
  [key: string]: string;
};

type Scope = {
  id: string;
  phases: string[]; // Cada phase es un nombre (puede estar vacío)
};

const Calendar: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('#ffb300');
  const [paintMode, setPaintMode] = useState(false);
  const [freeDayMode, setFreeDayMode] = useState(false);
  const [paintMap, setPaintMap] = useState<PaintMap>({});
  const [freeDays, setFreeDays] = useState<Set<number>>(new Set());
  const [cellTexts, setCellTexts] = useState<{ [key: string]: string }>({});
  const [editTextsMode, setEditTextsMode] = useState(false);
  const [modalOpen, setModalOpen] = useState<null | 'save' | 'load' | 'create'>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [tableKey, setTableKey] = useState(0);
  const [scopes, setScopes] = useState<Scope[]>([]); // <-- Quitar Scope inicial

  // Handlers desacoplados
  const handlePaintCell = usePaintCellHandler(selectedColor, freeDays, setPaintMap);
  const handleMarkFreeDay = useMarkFreeDayHandler(setFreeDays, setPaintMap);
  const handleCreatePlan = useCreatePlanHandler(setModalOpen);
  const handleConfirmCreatePlan = useConfirmCreatePlanHandler(
    setPaintMap,
    setFreeDays,
    setCellTexts,
    setLastUpdated,
    setModalOpen,
    setTableKey,
    phaseStyles,
    phaseStyles, // Pass phaseStyles as newAppPhaseStyles or replace with the correct variable if available
  );
  const handleDownloadPlan = useDownloadPlanHandler(
    daysInMonth,
    phaseStyles,
    phaseStyles, // Pass phaseStyles as newAppPhaseStyles or replace with the correct variable if available
    monthNames,
    saveAs,
    ExcelJS,
  );
  const handleSavePlan = useSavePlanHandler(
    setModalLoading,
    setModalError,
    setLastUpdated,
    setModalOpen,
    api,
    paintMap,
    freeDays,
    cellTexts,
  );
  const handleLoadPlan = useLoadPlanHandler(
    setModalLoading,
    setModalError,
    setPaintMap,
    setFreeDays,
    setCellTexts,
    setLastUpdated,
    setModalOpen,
    setTableKey,
    api,
  );

  // Agregar Scope
  const handleAddScope = () => {
    const id = prompt('ID único para el Scope:');
    if (!id || scopes.some((s) => s.id === id)) {
      alert('ID inválido o repetido');
      return;
    }
    const nStr = prompt('¿Cuántas filas/phases quieres agregar?');
    const n = Number(nStr);
    if (!n || n < 1) {
      alert('Cantidad inválida');
      return;
    }
    setScopes([...scopes, { id, phases: Array(n).fill('') }]);
  };

  // Editar Scope
  const handleEditScope = () => {
    const id = prompt('ID del Scope a editar:');
    const idx = scopes.findIndex((s) => s.id === id);
    if (idx === -1) {
      alert('Scope no encontrado');
      return;
    }
    const scope = scopes[idx];
    const action = prompt('Escribe "agregar" para añadir filas, "eliminar" para quitar filas:');
    if (action === 'agregar') {
      const nStr = prompt('¿Cuántas filas/phases quieres agregar?');
      const n = Number(nStr);
      if (!n || n < 1) {
        alert('Cantidad inválida');
        return;
      }
      const newPhases = [...scope.phases, ...Array(n).fill('')];
      const newScopes = scopes.slice();
      newScopes[idx] = { ...scope, phases: newPhases };
      setScopes(newScopes);
    } else if (action === 'eliminar') {
      const nStr = prompt('¿Cuántas filas/phases quieres eliminar?');
      const n = Number(nStr);
      if (!n || n < 1 || n > scope.phases.length) {
        alert('Cantidad inválida');
        return;
      }
      const newPhases = scope.phases.slice(0, scope.phases.length - n);
      let newScopes = scopes.slice();
      if (newPhases.length === 0) {
        // Eliminar Scope completo
        newScopes = newScopes.filter((_, i) => i !== idx);
      } else {
        newScopes[idx] = { ...scope, phases: newPhases };
      }
      setScopes(newScopes);
    } else {
      alert('Acción inválida');
    }
  };

  // Eliminar Scope
  const handleDeleteScope = () => {
    const id = prompt('ID del Scope a eliminar:');
    const idx = scopes.findIndex((s) => s.id === id);
    if (idx === -1) {
      alert('Scope no encontrado');
      return;
    }
    if (!window.confirm(`¿Seguro que quieres eliminar el Scope "${id}"?`)) return;
    setScopes(scopes.filter((_, i) => i !== idx));
  };

  // Color Phase (ejemplo: mostrar alerta)
  const handleColorPhase = () => {
    alert('Función para cambiar color de las Phases (implementa según tu lógica)');
  };

  return (
    <>
      <HeaderMenu
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        paintMode={paintMode}
        setPaintMode={setPaintMode}
        freeDayMode={freeDayMode}
        setFreeDayMode={setFreeDayMode}
        onCreatePlan={handleCreatePlan}
        editTextsMode={editTextsMode}
        setEditTextsMode={setEditTextsMode}
        onSavePlan={() => setModalOpen('save')}
        onLoadPlan={() => setModalOpen('load')}
        onAddScope={handleAddScope}
        onEditScope={handleEditScope}
      />
      <div className="calendar-scroll-x">
        <CalendarTable
          key={tableKey}
          paintMap={paintMap}
          paintMode={paintMode}
          freeDayMode={freeDayMode}
          freeDays={freeDays}
          onPaintCell={handlePaintCell}
          onMarkFreeDay={handleMarkFreeDay}
          cellTexts={cellTexts}
          setCellTexts={setCellTexts}
          editTextsMode={editTextsMode}
          scopes={scopes}
        />
      </div>
      <PlanModal
        open={!!modalOpen}
        mode={modalOpen}
        loading={modalLoading}
        error={modalError}
        onClose={() => setModalOpen(null)}
        onSubmit={(() => {
          if (modalOpen === 'save') return handleSavePlan;
          if (modalOpen === 'load') return handleLoadPlan;
          return handleConfirmCreatePlan;
        })()}
        lastUpdated={lastUpdated}
      />
      <FixedRadialMenu
        onAddScope={handleAddScope}
        onEditScope={handleEditScope}
        onDeleteScope={handleDeleteScope}
        onColorPhase={handleColorPhase}
      />
      {lastUpdated && (
        <div style={{ textAlign: 'right', color: '#7030a0', fontSize: 13, margin: 8 }}>
          Última actualización: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}
    </>
  );
};

export default Calendar;
