
import { CardContent } from '@/components/ui/card';
import { AuthSignupHeader } from './AuthSignupHeader';
import { AuthSignupFields } from './AuthSignupFields';
import { AuthSignupButton } from './AuthSignupButton';
import { useAuthSignupForm } from '@/hooks/useAuthSignupForm';

interface AuthSignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function AuthSignupForm({ isLoading, setIsLoading }: AuthSignupFormProps) {
  const {
    signupForm,
    showPassword,
    showConfirmPassword,
    updateFormField,
    toggleShowPassword,
    toggleShowConfirmPassword,
    handleSignUp,
  } = useAuthSignupForm();

  return (
    <>
      <AuthSignupHeader />
      <CardContent>
        <form onSubmit={(e) => handleSignUp(e, setIsLoading)} className="space-y-4">
          <AuthSignupFields
            formData={signupForm}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onFormChange={updateFormField}
            onTogglePassword={toggleShowPassword}
            onToggleConfirmPassword={toggleShowConfirmPassword}
          />
          
          <AuthSignupButton
            isLoading={isLoading}
            onClick={(e) => handleSignUp(e, setIsLoading)}
          />
        </form>
      </CardContent>
    </>
  );
}
