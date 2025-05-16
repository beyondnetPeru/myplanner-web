import React from 'react';

type HeaderMenuProps = {
  selectedColor: string;
  setSelectedColor: (c: string) => void;
  paintMode: boolean;
  setPaintMode: (b: boolean) => void;
  freeDayMode: boolean;
  setFreeDayMode: (b: boolean) => void;
  onCreatePlan: () => void;
  onDownloadPlan: () => void;
};

const HeaderMenu: React.FC<HeaderMenuProps> = ({
  selectedColor,
  setSelectedColor,
  paintMode,
  setPaintMode,
  freeDayMode,
  setFreeDayMode,
  onCreatePlan,
  onDownloadPlan,
}) => (
  <header
    style={{
      background: '#7030a0',
      color: 'white',
      padding: '0.5rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      minHeight: 56,
    }}
  >
    <span style={{ fontWeight: 'bold', fontSize: 22, letterSpacing: 2 }}>Web Calendar</span>
    <button
      type="button"
      style={{
        background: '#fff',
        color: '#7030a0',
        border: 'none',
        borderRadius: 4,
        padding: '0.5em 1em',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
      onClick={onCreatePlan}
    >
      Crear nuevo plan
    </button>
    <button
      type="button"
      style={{
        background: '#fff',
        color: '#7030a0',
        border: 'none',
        borderRadius: 4,
        padding: '0.5em 1em',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
      onClick={onDownloadPlan}
    >
      Descargar plan
    </button>
    <label htmlFor="color-picker" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 14 }}>Color:</span>
      <input
        id="color-picker"
        type="color"
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        style={{ border: 'none', width: 28, height: 28, background: 'none' }}
        disabled={freeDayMode}
      />
    </label>
    <label htmlFor="paint-mode-checkbox" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <input
        id="paint-mode-checkbox"
        type="checkbox"
        checked={paintMode}
        onChange={(e) => setPaintMode(e.target.checked)}
        style={{ accentColor: '#7030a0' }}
        disabled={freeDayMode}
      />
      <span style={{ fontSize: 14, opacity: freeDayMode ? 0.5 : 1 }}>Modo pintar días</span>
    </label>
    <button
      style={{
        background: freeDayMode ? '#bbb' : '#fff',
        color: freeDayMode ? '#444' : '#7030a0',
        border: 'none',
        borderRadius: 4,
        padding: '0.5em 1em',
        cursor: 'pointer',
        fontWeight: 'bold',
        outline: freeDayMode ? '2px solid #7030a0' : undefined,
      }}
      onClick={() => setFreeDayMode(!freeDayMode)}
      title="Marcar días libres"
      type="button"
    >
      {freeDayMode ? 'Selecciona días libres' : 'Marcar días libres'}
    </button>
  </header>
);

export default HeaderMenu;
