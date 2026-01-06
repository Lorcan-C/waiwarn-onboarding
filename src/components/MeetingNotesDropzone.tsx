import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type DropzoneState = 'idle' | 'dragOver' | 'processing' | 'success' | 'error';

interface MeetingNotesDropzoneProps {
  meetingId: string;
  meetingTitle: string;
  existingNotes?: string;
  onNotesReceived: (content: string) => void;
  onExtractTasks: () => void;
  isProcessing: boolean;
  extractedCount?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['.txt', '.md', 'text/plain', 'text/markdown'];

const MeetingNotesDropzone = ({
  meetingId,
  meetingTitle,
  existingNotes,
  onNotesReceived,
  onExtractTasks,
  isProcessing,
  extractedCount = 0,
}: MeetingNotesDropzoneProps) => {
  const [state, setState] = useState<DropzoneState>(existingNotes ? 'success' : 'idle');
  const [notesContent, setNotesContent] = useState(existingNotes || '');
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTextarea, setShowTextarea] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState('dragOver');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(notesContent ? 'success' : 'idle');
  }, [notesContent]);

  const processFile = useCallback(async (file: File) => {
    setError(null);

    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 5MB.');
      setState('error');
      return;
    }

    const isAccepted = ACCEPTED_TYPES.some(type => 
      file.type.includes(type.replace('.', '')) || file.name.endsWith(type)
    );

    if (!isAccepted) {
      setError('Please upload a .txt or .md file.');
      setState('error');
      return;
    }

    setState('processing');
    try {
      const content = await file.text();
      setNotesContent(content);
      setFileName(file.name);
      onNotesReceived(content);
      setState('success');
    } catch {
      setError('Failed to read file. Please try again.');
      setState('error');
    }
  }, [onNotesReceived]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleTextareaSubmit = () => {
    if (notesContent.trim()) {
      onNotesReceived(notesContent);
      setState('success');
      setShowTextarea(false);
    }
  };

  const handleClear = () => {
    setNotesContent('');
    setFileName(null);
    setState('idle');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStateStyles = () => {
    switch (state) {
      case 'dragOver':
        return 'border-blue-500 bg-blue-50';
      case 'processing':
        return 'border-gray-300 bg-gray-50';
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50';
    }
  };

  if (showTextarea) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Paste Meeting Notes</label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTextarea(false)}
            className="text-gray-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <Textarea
          value={notesContent}
          onChange={(e) => setNotesContent(e.target.value)}
          placeholder="Paste your meeting notes here..."
          className="min-h-[200px] text-sm"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowTextarea(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleTextareaSubmit} disabled={!notesContent.trim()}>
            Save Notes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Meeting Notes</label>
        {state === 'success' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-gray-500 h-7 px-2"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => state !== 'processing' && fileInputRef.current?.click()}
        className={`relative rounded-lg border-2 border-dashed p-6 transition-all duration-200 cursor-pointer ${getStateStyles()}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          {state === 'idle' && (
            <>
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Drop meeting notes here or click to upload
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports .txt, .md files (max 5MB)
              </p>
              <Button
                variant="link"
                size="sm"
                className="mt-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTextarea(true);
                }}
              >
                Or paste notes directly
              </Button>
            </>
          )}

          {state === 'dragOver' && (
            <>
              <Upload className="w-8 h-8 text-blue-500 mb-2 animate-bounce" />
              <p className="text-sm font-medium text-blue-700">Drop to upload</p>
            </>
          )}

          {state === 'processing' && (
            <>
              <Loader2 className="w-8 h-8 text-gray-500 mb-2 animate-spin" />
              <p className="text-sm font-medium text-gray-700">Reading file...</p>
            </>
          )}

          {state === 'success' && (
            <>
              <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-sm font-medium text-green-700">Notes uploaded</p>
              {fileName && (
                <div className="flex items-center gap-1.5 mt-1 text-xs text-green-600">
                  <FileText className="w-3 h-3" />
                  {fileName}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2 max-w-xs truncate">
                {notesContent.slice(0, 100)}...
              </p>
            </>
          )}

          {state === 'error' && (
            <>
              <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
              <p className="text-sm font-medium text-red-700">{error}</p>
              <Button
                variant="link"
                size="sm"
                className="mt-1 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                Try again
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Extract Tasks Button */}
      {state === 'success' && notesContent && (
        <div className="flex justify-end">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onExtractTasks();
            }}
            disabled={isProcessing}
            className="gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Extracting tasks...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Extract Tasks
              </>
            )}
          </Button>
        </div>
      )}

      {/* Show extracted count */}
      {extractedCount > 0 && !isProcessing && (
        <p className="text-xs text-green-600 text-right">
          ✓ {extractedCount} task{extractedCount !== 1 ? 's' : ''} extracted
        </p>
      )}
    </div>
  );
};

export default MeetingNotesDropzone;
