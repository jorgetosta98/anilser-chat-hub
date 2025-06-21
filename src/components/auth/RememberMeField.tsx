
import { Checkbox } from "@/components/ui/checkbox";

interface RememberMeFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function RememberMeField({ checked, onChange }: RememberMeFieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="remember"
        checked={checked}
        onCheckedChange={onChange}
      />
      <label 
        htmlFor="remember" 
        className="text-sm text-gray-700 cursor-pointer"
      >
        Lembrar de mim
      </label>
    </div>
  );
}
