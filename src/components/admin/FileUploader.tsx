'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, RefreshCw } from 'lucide-react';

interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    key: string;
  };
  message?: string;
}

interface FileUploaderProps {
  name: string;
  label?: string;
  accept?: string;
  value?: string;
  onChange?: (url: string, key: string) => void;
  maxSize?: number;
  hint?: string;
}

export function FileUploader({
  name,
  label,
  accept = 'image/*',
  value,
  onChange,
  maxSize = 10 * 1024 * 1024,
  hint,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      setError(`文件大小不能超过 ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/cos/upload', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || '上传失败');
      }

      onChange?.(result.data.url, result.data.key);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [maxSize, onChange]);

  const handleRemove = useCallback(() => {
    onChange?.('', '');
  }, [onChange]);

  const handleClick = useCallback(() => {
    console.log('点击上传');
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-admin-ink mb-2">
          {label}
        </label>
      )}
      
      {value ? (
        <div className="flex flex-col gap-3">
          <div className="relative group">
            <div className="rounded-lg overflow-hidden border border-admin-border shadow-sm hover:shadow-md transition-shadow duration-200">
              <img
                src={value}
                alt="已上传图片"
                className="w-full max-h-64 object-contain bg-gray-50"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-white text-sm">上传中...</span>
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClick}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-admin-accent text-white text-sm rounded-md hover:bg-admin-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={16} className={uploading ? 'animate-spin' : ''} />
              更换图片
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 text-sm rounded-md hover:bg-red-50 transition-colors"
            >
              <X size={16} />
              删除图片
            </button>
          </div>
          
          {/* <p className="text-xs text-admin-muted truncate">{value}</p> */}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed border-admin-border rounded-lg hover:border-admin-accent hover:bg-admin-accent/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="w-12 h-12 border-4 border-admin-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-admin-ink font-medium">上传中...</span>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-admin-accent/10 flex items-center justify-center">
                <Upload size={28} className="text-admin-accent" />
              </div>
              <span className="text-sm text-admin-ink font-medium">点击上传图片</span>
              {hint && <span className="text-xs text-admin-muted">{hint}</span>}
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

interface ImageUploaderProps extends Omit<FileUploaderProps, 'accept'> {
  aspectRatio?: string;
}

export function ImageUploader({ aspectRatio = '1/1', ...props }: ImageUploaderProps) {
  return (
    <FileUploader
      accept="image/jpeg,image/png,image/gif,image/webp"
      {...props}
    />
  );
}