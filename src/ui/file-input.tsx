"use client";

import { UploadSimple } from "@phosphor-icons/react/ssr";
import { useId, useRef, useState, type DragEvent } from "react";

export type FileInputType = "dropzone" | "button" | "inline";

export interface FileInputProps {
  type?: FileInputType;
  /** Accessible name and the dropzone title. */
  title?: string;
  /** Rules shown to the user, such as the allowed types and size. */
  description?: string;
  buttonLabel?: string;
  /** Inline only. Shown when no file is chosen. */
  placeholder?: string;
  /** Native accept attribute. */
  accept?: string;
  multiple?: boolean;
  /** 0 to 100 while a file uploads. The upload itself belongs to the app. */
  progress?: number;
  /** Error message. It replaces the description. */
  error?: string;
  disabled?: boolean;
  /** Force the dragging look, for documentation. Real dragging sets it by itself. */
  dragging?: boolean;
  onFiles?: (files: File[]) => void;
  className?: string;
}

/** Choosing a file works from the button and from the keyboard. Dropping is an extra for pointer users. */
export function FileInput({
  type = "dropzone",
  title = "Drag files here",
  description,
  buttonLabel = "Choose file",
  placeholder = "No file selected",
  accept,
  multiple,
  progress,
  error,
  disabled,
  dragging,
  onFiles,
  className = "",
}: FileInputProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [names, setNames] = useState<string[]>([]);
  const uploading = progress !== undefined;
  const note = error ?? description;
  const drag = dragging || over;

  function take(files: FileList | null) {
    const list = files ? [...files] : [];
    setNames(list.map((f) => f.name));
    onFiles?.(list);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setOver(false);
    if (!disabled) take(e.dataTransfer.files);
  }

  const pick = () => input.current?.click();
  const button = (
    <button
      type="button"
      disabled={disabled}
      onClick={pick}
      aria-describedby={note ? `${id}-note` : undefined}
      className={`inline-flex items-center gap-2 rounded-md border bg-role-bg-surface px-4 min-h-11 text-sm text-role-text-link hover:bg-role-bg-hover disabled:cursor-not-allowed disabled:border-role-border-disabled disabled:text-role-text-disabled disabled:hover:bg-transparent ${
        error ? "border-role-border-danger" : "border-role-bg-brand"
      }`}
    >
      {type === "button" && <UploadSimple size={16} aria-hidden="true" />}
      {buttonLabel}
    </button>
  );

  const bar = uploading && (
    <div className="flex w-full flex-col gap-1">
      <div role="progressbar" aria-label="Upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="h-1 w-full overflow-hidden rounded-full bg-role-bg-subtle">
        <div className="h-full rounded-full bg-role-bg-brand" style={{ width: `${progress}%` }} />
      </div>
      <span className="text-xs text-role-text-secondary">Uploading… {progress}%</span>
    </div>
  );

  const noteEl = note && (
    <p id={`${id}-note`} className={`text-xs leading-[18px] ${error ? "text-role-text-danger" : "text-role-text-secondary"}`}>
      {note}
    </p>
  );

  const hidden = <input ref={input} id={id} type="file" accept={accept} multiple={multiple} disabled={disabled} onChange={(e) => take(e.target.files)} className="sr-only" tabIndex={-1} aria-hidden="true" />;

  if (type === "dropzone") {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center gap-1.5 rounded-lg border-[1.5px] border-dashed p-6 text-center ${
          error ? "border-role-border-danger" : drag ? "border-role-bg-brand bg-role-bg-tone-info" : "border-role-border-input hover:bg-role-bg-hover"
        } ${disabled ? "opacity-60" : ""} ${className}`}
      >
        {hidden}
        <span aria-hidden="true" className={`flex size-10 items-center justify-center rounded-full ${error ? "bg-role-bg-tone-danger text-role-text-tone-danger" : "bg-role-bg-tone-info text-role-text-tone-info"}`}>
          <UploadSimple size={20} />
        </span>
        <p className="text-sm font-medium text-role-text-primary">{title}</p>
        {noteEl}
        {button}
        {bar}
        {names.length > 0 && <p className="text-xs text-role-text-secondary">{names.join(", ")}</p>}
      </div>
    );
  }

  if (type === "button") {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {hidden}
        <div className="flex items-center gap-3">
          {button}
          {noteEl}
        </div>
        {bar}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {hidden}
      <div className={`flex items-center gap-2 rounded-md border bg-role-bg-surface p-1 ${error ? "border-role-border-danger" : "border-role-border-input"} ${disabled ? "bg-role-bg-subtle" : ""}`}>
        {button}
        <span className="truncate text-sm text-role-text-secondary">{names.length ? names.join(", ") : placeholder}</span>
      </div>
      {bar}
      {error && noteEl}
    </div>
  );
}
