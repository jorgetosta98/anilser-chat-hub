
import { FormModal } from "@/components/modals/FormModal";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { PasswordInputFields } from "./PasswordInputFields";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordResetModal({
  isOpen,
  onClose
}: PasswordResetModalProps) {
  const { formData, setFormData, isLoading, handleSubmit, resetForm } = usePasswordReset();

  const onSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Redefinir Senha"
      onSubmit={onSubmit}
      submitText="Alterar Senha"
      isLoading={isLoading}
      maxWidth="max-w-md"
    >
      <PasswordInputFields formData={formData} setFormData={setFormData} />
    </FormModal>
  );
}
