/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';

type PlanModalProps = {
  open: boolean;
  mode: 'save' | 'load' | 'create' | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (keyword: string, password: string) => void;
  lastUpdated?: string | null;
};

const PlanModal: React.FC<PlanModalProps> = ({
  open,
  mode,
  loading,
  error,
  onClose,
  onSubmit,
  lastUpdated,
}) => {
  const [keyword, setKeyword] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (open) {
      setKeyword('');
      setPassword('');
    }
  }, [open]);

  if (!open) return null;

  // Modal de confirmación para crear nuevo plan
  if (mode === 'create') {
    return (
      <div
        role="presentation"
        style={{
          position: 'fixed',
          zIndex: 9999,
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          background: '#0008',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
      >
        <div
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          style={{
            background: '#fff',
            borderRadius: 10,
            padding: 32,
            minWidth: 320,
            boxShadow: '0 2px 16px #7030a055',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
        >
          <h2
            style={{
              color: '#7030a0',
              marginBottom: 16,
              fontWeight: 'bold',
              fontSize: 28,
              letterSpacing: 1,
            }}
          >
            Crear nuevo plan
          </h2>
          <div style={{ marginBottom: 18, color: '#7030a0', fontSize: 16 }}>
            ¿Seguro que quieres crear un nuevo plan en blanco? <br />
            Se eliminarán todos los textos y colores actuales.
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button
              type="button"
              disabled={loading}
              style={{
                background: '#7030a0',
                color: '#fff',
                border: '1.5px solid #e0a0ea',
                borderRadius: 8,
                padding: '0.5em 1.5em',
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onClick={() => onSubmit('', '')}
            >
              Sí, crear en blanco
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                background: '#eee',
                color: '#7030a0',
                border: '1.5px solid #e0a0ea',
                borderRadius: 8,
                padding: '0.5em 1.5em',
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed',
        zIndex: 9999,
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: '#0008',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        style={{
          background: '#fff',
          borderRadius: 10,
          padding: 32,
          minWidth: 320,
          boxShadow: '0 2px 16px #7030a055',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
      >
        <h2
          style={{
            color: '#7030a0',
            marginBottom: 16,
            fontWeight: 'bold',
            fontSize: 28,
            letterSpacing: 1,
          }}
        >
          {mode === 'save' ? 'Guardar plan' : 'Cargar plan'}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(keyword, password);
          }}
        >
          <label
            htmlFor="plan-keyword"
            style={{
              display: 'block',
              marginBottom: 12,
              color: '#e0a0ea',
              fontWeight: 500,
            }}
          >
            Nombre del plan (keyword):
            <input
              id="plan-keyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 8,
                marginTop: 4,
                borderRadius: 6,
                border: '1.5px solid #e0a0ea',
                fontSize: 15,
                background: '#000',
                color: '#fff',
              }}
            />
          </label>
          <label
            htmlFor="plan-password"
            style={{
              display: 'block',
              marginBottom: 12,
              color: '#e0a0ea',
              fontWeight: 500,
            }}
          >
            Contraseña:
            <input
              id="plan-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 8,
                marginTop: 4,
                borderRadius: 6,
                border: '1.5px solid #e0a0ea',
                fontSize: 15,
                background: '#000',
                color: '#fff',
              }}
            />
          </label>
          {lastUpdated && mode === 'load' && (
            <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>
              Última actualización: {new Date(lastUpdated).toLocaleString()}
            </div>
          )}
          {error && (
            <div style={{ color: '#e57373', marginBottom: 8, fontWeight: 500 }}>{error}</div>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#7030a0',
                color: '#fff',
                border: '1.5px solid #e0a0ea',
                borderRadius: 8,
                padding: '0.5em 1.5em',
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {mode === 'save' ? 'Guardar' : 'Cargar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                background: '#eee',
                color: '#7030a0',
                border: '1.5px solid #e0a0ea',
                borderRadius: 8,
                padding: '0.5em 1.5em',
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

PlanModal.defaultProps = {
  lastUpdated: null,
};

export default PlanModal;
