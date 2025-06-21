
import { useState } from "react";
import { RegisterHeader } from "./RegisterHeader";
import { RegisterFields } from "./RegisterFields";
import { RegisterActions } from "./RegisterActions";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
}

interface RegisterFormProps {
  onSubmit: (formData: RegisterFormData) => void;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: ""
  });

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <RegisterHeader />

      <form onSubmit={handleSubmit} className="space-y-6">
        <RegisterFields 
          formData={formData}
          onChange={handleInputChange}
        />
        
        <RegisterActions />
      </form>
    </div>
  );
}
