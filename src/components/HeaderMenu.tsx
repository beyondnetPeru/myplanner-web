import React from 'react';

type HeaderMenuProps = {
  selectedColor: string;
  setSelectedColor: (c: string) => void;
  paintMode: boolean;
  setPaintMode: (b: boolean) => void;
  freeDayMode: boolean;
  setFreeDayMode: (b: boolean) => void;
  onCreatePlan: () => void;
  onSavePlan: () => void;
  onLoadPlan: () => void;
  editTextsMode: boolean;
  setEditTextsMode: (b: boolean) => void;
};

// Unified button style for all buttons
const buttonStyle: React.CSSProperties = {
  background: '#7030a0',
  color: '#fff',
  border: '1.5px solid #e0a0ea',
  borderRadius: 8,
  padding: '0.5em 1.5em',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 15,
  boxShadow: '0 1px 4px rgba(112,48,160,0.07)',
  transition: 'background 0.18s, color 0.18s, box-shadow 0.18s, border 0.18s',
  outline: 'none',
  margin: 0,
};

const buttonActiveStyle: React.CSSProperties = {
  background: '#e0a0ea',
  color: '#7030a0',
  border: '2px solid #7030a0',
};

const buttonDisabledStyle: React.CSSProperties = {
  background: '#eee',
  color: '#aaa',
  border: '1.5px solid #ddd',
  cursor: 'not-allowed',
};

const getButtonHoverStyle = (disabled = false) =>
  !disabled
    ? {
        background: '#e0a0ea',
        color: '#7030a0',
        border: '2px solid #7030a0',
      }
    : {};

const paletteColors = [
  '#ffb300', // amarillo
  '#e57373', // rojo
  '#64b5f6', // azul
  '#81c784', // verde
  '#ba68c8', // violeta
  '#f06292', // rosa
  '#ffd54f', // amarillo claro
  '#a1887f', // marrón
  '#90a4ae', // gris
  '#000000', // negro
];

const HeaderMenu: React.FC<HeaderMenuProps> = ({
  selectedColor,
  setSelectedColor,
  paintMode,
  setPaintMode,
  freeDayMode,
  setFreeDayMode,
  onCreatePlan,
  onSavePlan,
  onLoadPlan,
  editTextsMode,
  setEditTextsMode,
}) => {
  // Helper for hover effect using React state
  const [hoveredBtn, setHoveredBtn] = React.useState<string | null>(null);

  const makeButton = (
    key: string,
    label: string,
    onClick?: () => void,
    disabled = false,
    isActive = false,
  ) => (
    <button
      key={key}
      type="button"
      style={{
        ...buttonStyle,
        ...(isActive ? buttonActiveStyle : {}),
        ...(hoveredBtn === key ? getButtonHoverStyle(disabled) : {}),
        ...(disabled ? buttonDisabledStyle : {}),
      }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHoveredBtn(key)}
      onMouseLeave={() => setHoveredBtn(null)}
    >
      {label}
    </button>
  );

  return (
    <header
      style={{
        background: '#fff',
        color: '#7030a0',
        padding: '0.5rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px 0 rgba(112,48,160,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        minHeight: 64,
        borderBottom: '2px solid #e0a0ea',
      }}
    >
      {/* Logo/Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span
          style={{
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 2,
            color: '#7030a0',
            fontFamily: 'Segoe UI, Calibri, Arial, sans-serif',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #e0a0ea 0%, #7030a0 100%)',
              borderRadius: '50%',
              marginRight: 10,
              verticalAlign: 'middle',
            }}
          />
          Web Calendar
        </span>
      </div>

      {/* Todo el resto en un solo div */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          background: '#f9f6fb',
          borderRadius: 10,
          padding: '0.25em 1.2em',
          boxShadow: '0 1px 4px rgba(112,48,160,0.06)',
        }}
      >
        {/* Botones morados */}
        <div style={{ display: 'flex', gap: 12 }}>
          {makeButton('create', 'Crear nuevo plan', onCreatePlan)}
          {makeButton('upload', 'Cargar plan', onLoadPlan)}
          {makeButton('save', 'Guardar plan', onSavePlan)}
          {makeButton('export', 'Exportar como Excel')}
          {makeButton(
            'editTexts',
            editTextsMode ? 'Editar textos: ON' : 'Editar textos',
            () => setEditTextsMode(!editTextsMode),
            false,
            editTextsMode,
          )}
        </div>
        {/* Paleta de colores y controles */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: '#fff',
            borderRadius: 8,
            padding: '0.18em 0.7em',
            border: '1.5px solid #e0a0ea',
            boxShadow: '0 1px 4px #e0a0ea11',
            marginLeft: 8,
          }}
        >
          <span style={{ fontSize: 14, color: '#7030a0', fontWeight: 500, marginRight: 2 }}>
            Color:
          </span>
          <span style={{ display: 'flex', gap: 3 }}>
            {paletteColors.map((color) => (
              <button
                key={color}
                type="button"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: selectedColor === color ? '2.5px solid #7030a0' : '1.5px solid #e0a0ea',
                  background: color,
                  cursor: freeDayMode ? 'not-allowed' : 'pointer',
                  outline: selectedColor === color ? '2px solid #e0a0ea' : 'none',
                  margin: 0,
                  padding: 0,
                  boxShadow: selectedColor === color ? '0 0 0 2px #e0a0ea44' : 'none',
                  transition: 'border 0.15s, box-shadow 0.15s',
                }}
                onClick={() => !freeDayMode && setSelectedColor(color)}
                disabled={freeDayMode}
                aria-label={`Seleccionar color ${color}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !freeDayMode) setSelectedColor(color);
                }}
              />
            ))}
          </span>
          <input
            id="color-picker"
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            style={{
              border: 'none',
              width: 28,
              height: 28,
              background: 'none',
              cursor: freeDayMode ? 'not-allowed' : 'pointer',
              marginLeft: 4,
              borderRadius: 6,
              boxShadow: '0 0 0 1.5px #e0a0ea',
            }}
            disabled={freeDayMode}
            aria-label="Selector de color personalizado"
          />
        </div>
        <label
          htmlFor="paint-mode-checkbox"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: '#f9f6fb',
            borderRadius: 8,
            padding: '0.25em 0.7em',
            marginLeft: 8,
            height: 44,
          }}
        >
          <input
            id="paint-mode-checkbox"
            type="checkbox"
            checked={paintMode}
            onChange={(e) => setPaintMode(e.target.checked)}
            style={{ accentColor: '#7030a0', width: 18, height: 18 }}
            disabled={freeDayMode}
          />
          <span
            style={{
              fontSize: 14,
              opacity: freeDayMode ? 0.5 : 1,
              color: '#7030a0',
              fontWeight: 500,
            }}
          >
            Modo pintar días
          </span>
        </label>
        {makeButton(
          'freeDay',
          freeDayMode ? 'Selecciona días libres' : 'Marcar días libres',
          () => setFreeDayMode(!freeDayMode),
          false,
          freeDayMode,
        )}
      </div>
    </header>
  );
};

export default HeaderMenu;
