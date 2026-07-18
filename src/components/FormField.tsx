import type { ChangeEvent, ReactNode } from "react";

interface SharedFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  helper?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

interface TextFieldProps extends SharedFieldProps {
  kind?: "input" | "textarea";
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  inputMode?: "text" | "numeric";
}

interface SelectFieldProps extends SharedFieldProps {
  kind: "select";
  children: ReactNode;
}

type FormFieldProps = TextFieldProps | SelectFieldProps;

export function FormField(props: FormFieldProps) {
  const {
    id,
    name,
    label,
    value,
    onChange,
    helper,
    required = false,
    error,
    className = "",
  } = props;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const describedBy = [helper ? helperId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`form-field ${error ? "form-field--error" : ""} ${className}`}>
      <div className="form-field__label-row">
        <label htmlFor={id}>{label}</label>
        {required && <span className="required-pill">Essential</span>}
      </div>
      {props.kind === "select" ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          required={required}
        >
          {props.children}
        </select>
      ) : props.kind === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          rows={props.rows ?? 5}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          required={required}
        />
      ) : (
        <input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          inputMode={props.inputMode}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          required={required}
        />
      )}
      <div className="form-field__meta">
        <span id={error ? errorId : helperId} className={error ? "form-field__error" : "form-field__helper"} role={error ? "alert" : undefined}>
          {error ?? helper}
        </span>
        {props.kind !== "select" && props.maxLength && (
          <span className="form-field__count" aria-label={`${value.length} of ${props.maxLength} characters used`}>
            {value.length}/{props.maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
