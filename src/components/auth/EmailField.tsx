
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function EmailField({ value, onChange, error }: EmailFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">E-mail</label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          type="email"
          placeholder="seuemail@email.com"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pl-10 h-12 ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
