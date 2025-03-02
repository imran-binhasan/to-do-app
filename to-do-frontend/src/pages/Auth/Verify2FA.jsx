import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

const Verify2FA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otpauthUrl = location.state.otpauthUrl;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
console.log(otpauthUrl,location)
  const onSubmit = async (data) => {
    try {
      await axios.post(
        "https://to-do-backend-liard.vercel.app/api/auth/verify-2fa",
        { email, token: data.token },
        { withCredentials: true } // ✅ Ensures cookies are sent
      );
      

      toast.success("2FA verified successfully! Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data.message || "Invalid 2FA code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="p-8 rounded shadow">
      {otpauthUrl && (
          <div className="mt-4 text-center mx-auto border p-4 space-y-4">
            <h5>Scan this QR code with your Google Authenticator app:</h5>
            <QRCodeSVG className="text-center mx-auto" value={otpauthUrl} size={128} />
          </div>
        )}
        <h4 className="text-2xl font-medium text-center mb-4">Verify 2FA</h4>
        <p className="text-center text-gray-600 mb-2">
          Enter the 6-digit code from your Google Authenticator app.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
          <div>
            <label htmlFor="token">Enter 2FA Code:</label>
            <Input
              className="w-full"
              id="token"
              type="text"
              placeholder="6-digit code"
              {...register("token", { required: "2FA code is required" })}
            />
            {errors.token && <p className="error">{errors.token.message}</p>}
          </div>

          <Button type="submit">Verify 2FA</Button>
        </form>
      </div>
    </div>
  );
};

export default Verify2FA;
