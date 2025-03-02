import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";


const VerifyMail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("https://to-do-backend-liard.vercel.app/api/auth/verify-mail-code", {
        email,
        mailCode: data.code,
      });
  

      console.log(response.data.otpauthUrl); // Log directly instead of otpauthUrl (which updates later)
      
      toast.success("Email verified successfully! Proceeding to 2FA setup.");
      navigate("/verify-2fa", { state: { email, otpauthUrl: response.data.otpauthUrl } });
    } catch (error) {
      toast.error(error.response?.data.message || "Invalid verification code");
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="p-8 rounded shadow">
        <h4 className="text-2xl font-medium text-center mb-4">Verify Email</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
          <div>
            <label htmlFor="code">Enter Code:</label>
            <Input
              className="w-full"
              id="code"
              type="text"
              placeholder="6-digit code"
              {...register("code", { required: "Verification code is required" })}
            />
            {errors.code && <p className="error">{errors.code.message}</p>}
          </div>

          <Button type="submit">Verify Email</Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyMail;
