import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';

type FixedRadialMenuProps = {
  onAddScope: () => void;
  onEditScope: () => void;
  onDeleteScope: () => void;
  onColorPhase: () => void;
};

const btns = [
  {
    key: 'add',
    icon: FaIcons.FaPlus,
    label: 'Agregar Scope',
    action: 'onAddScope',
    x: -1,
    y: -1,
  },
  {
    key: 'edit',
    icon: FaIcons.FaEdit,
    label: 'Editar Scope',
    action: 'onEditScope',
    x: 1,
    y: -1,
  },
  {
    key: 'trash',
    icon: FaIcons.FaTrash,
    label: 'Eliminar Scope',
    action: 'onDeleteScope',
    x: -1,
    y: 1,
  },
  {
    key: 'color',
    icon: FaIcons.FaPalette,
    label: 'Color Phase',
    action: 'onColorPhase',
    x: 1,
    y: 1,
  },
];

const purple = '#7030a0';
const purpleHover = '#4b1e6e';

const FixedRadialMenu: React.FC<FixedRadialMenuProps> = ({
  onAddScope,
  onEditScope,
  onDeleteScope,
  onColorPhase,
}) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const actions: Record<string, () => void> = {
    onAddScope,
    onEditScope,
    onDeleteScope,
    onColorPhase,
  };

  // Tamaño y posición base
  const baseSize = 64;
  const menuSize = 210;
  const center = menuSize / 2;
  const offset = open ? 70 : 0; // distancia desde el centro

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 9999,
        width: menuSize,
        height: menuSize,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: menuSize,
          height: menuSize,
          pointerEvents: 'auto',
        }}
      >
        {/* Botones radiales */}
        {btns.map((btn, i) => {
          const Icon = btn.icon as React.FC<{ size?: number }>;
          const isHovered = hovered === btn.key;
          return (
            <button
              key={btn.key}
              title={btn.label}
              type="button"
              onClick={() => {
                if (open) {
                  actions[btn.action]();
                  setOpen(false);
                }
              }}
              onMouseEnter={() => setHovered(btn.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'absolute',
                left: center - baseSize / 2,
                top: center - baseSize / 2,
                width: baseSize,
                height: baseSize,
                background: isHovered ? purpleHover : purple,
                borderRadius: open ? 12 : '50%',
                border: 'none',
                boxShadow: open ? '0 2px 8px #7030a055' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition:
                  'transform 0.5s, border-radius 0.5s, box-shadow 0.5s, opacity 0.3s, background 0.18s',
                transitionDelay: `${0.05 * i}s`,
                cursor: open ? 'pointer' : 'default',
                opacity: open ? 1 : 0,
                color: '#fff',
                fontSize: 20,
                pointerEvents: open ? 'auto' : 'none',
                zIndex: open ? 1 : 0,
                transform: open ? `translate(${btn.x * offset}px, ${btn.y * offset}px)` : 'none',
              }}
            >
              <span
                style={{
                  opacity: open ? 1 : 0,
                  transform: (() => {
                    if (!open) return 'scale(0.5)';
                    return isHovered ? 'scale(1.18)' : 'scale(1)';
                  })(),
                  transition: 'opacity 0.3s, transform 0.18s',
                  pointerEvents: open ? 'auto' : 'none',
                  display: 'flex',
                }}
              >
                <Icon size={isHovered ? 36 : 30} />
              </span>
            </button>
          );
        })}
        {/* Botón central */}
        <button
          type="button"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
          style={{
            position: 'absolute',
            left: center - baseSize / 2,
            top: center - baseSize / 2,
            width: baseSize,
            height: baseSize,
            borderRadius: open ? 12 : '50%',
            background: purple,
            color: '#fff',
            border: 'none',
            boxShadow: '0 2px 12px #7030a055',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            cursor: 'pointer',
            transition: 'background 0.18s, border-radius 0.5s, left 0.5s',
            zIndex: 2,
          }}
        >
          <span
            style={{
              opacity: 1,
              transform: open ? 'scale(1.18)' : 'scale(1)',
              transition: 'opacity 0.3s, transform 0.18s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {open
              ? (() => {
                  const TimesIcon = FaIcons.FaTimes as React.FC<{ size?: number }>;
                  return TimesIcon ? <TimesIcon size={36} /> : null;
                })()
              : (() => {
                  const AppleIcon = FaIcons.FaApple as React.FC<{ size?: number }>;
                  return AppleIcon ? <AppleIcon size={36} /> : null;
                })()}
          </span>
        </button>
      </div>
    </div>
  );
};

export default FixedRadialMenu;
