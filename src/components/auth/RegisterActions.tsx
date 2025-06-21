
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function RegisterActions() {
  return (
    <>
      <Button 
        type="submit"
        className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base"
      >
        Criar conta
      </Button>

      <div className="text-center text-sm text-gray-600">
        Já tem uma conta?{" "}
        <Link to="/login" className="text-teal-600 hover:underline">
          Faça login aqui.
        </Link>
      </div>
    </>
  );
}
