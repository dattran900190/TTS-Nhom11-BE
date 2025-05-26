import crypto from "crypto";

export function generateOtp(length = 6) {
  const digits = '0123456789';
  const maxValidByte = 256 - (256 % digits.length);
  let otp = '';

  while (otp.length < length) {
    const byte = crypto.randomBytes(1)[0];
    if (byte < maxValidByte) {
      otp += digits[byte % digits.length];
    }
  }

  return otp;
}
