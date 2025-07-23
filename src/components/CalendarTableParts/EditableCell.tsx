/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
import React, { useState, useRef, useEffect } from 'react';

type EditableCellProps = {
  row: number;
  col: number;
  value?: string;
  className?: string;
  setCellTexts: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  colSpan?: number;
  rowSpan?: number;
  style?: React.CSSProperties;
  editTextsMode: boolean;
  children?: React.ReactNode;
};

const EditableCell: React.FC<EditableCellProps> = ({
  row,
  col,
  value,
  className = 'style11 null',
  setCellTexts,
  colSpan,
  rowSpan,
  style = {},
  editTextsMode,
  children,
  ...rest
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(
    value ?? (typeof children === 'string' ? children : ''),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setTempValue(value ?? (typeof children === 'string' ? children : ''));
  }, [value, children]);

  const handleDoubleClick = () => {
    if (editTextsMode) setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    setCellTexts((prev) => ({
      ...prev,
      [`${row}|${col}`]: tempValue as string,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Si es Scope (col=0) y Shift+Enter, agrega salto de línea
    if (col === 0 && e.key === 'Enter' && e.shiftKey) {
      setTempValue((prev) => `${prev}\n`);
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter') {
      setEditing(false);
      setCellTexts((prev) => ({
        ...prev,
        [`${row}|${col}`]: tempValue as string,
      }));
    } else if (e.key === 'Escape') {
      setEditing(false);
      setTempValue(value ?? (typeof children === 'string' ? children : ''));
    }
  };

  return (
    <td
      className={className}
      colSpan={colSpan}
      rowSpan={rowSpan}
      style={style}
      onDoubleClick={handleDoubleClick}
      {...rest}
    >
      {(() => {
        if (editing) {
          if (col === 0) {
            return (
              <textarea
                ref={inputRef as unknown as React.RefObject<HTMLTextAreaElement>}
                value={tempValue as string}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={{
                  width: '100%',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  border: '1px solid #7030a0',
                  borderRadius: 4,
                  padding: '2px 4px',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  minHeight: 32,
                  whiteSpace: 'pre-line',
                }}
                rows={Math.max(2, (tempValue as string).split('\n').length)}
              />
            );
          }
          return (
            <input
              ref={inputRef}
              value={tempValue as string}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              style={{
                width: '100%',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                border: '1px solid #7030a0',
                borderRadius: 4,
                padding: '2px 4px',
                boxSizing: 'border-box',
              }}
            />
          );
        }
        // Mostrar saltos de línea como <br/> solo en Scope
        if (col === 0) {
          return (tempValue as string)
            .split('\n')
            .map((line, i) => (i === 0 ? line : [<br key={i} />, line]));
        }
        return tempValue;
      })()}
    </td>
  );
};

export default EditableCell;
