// components/ReferralDialog.js
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ReferralDialog = ({ isOpen, onClose, onSubmit }) => {
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");

  const ebayReferralRegex = /^[a-zA-Z0-9-]+$/;
//   const amazonReferralRegex = /^[a-zA-Z0-9-_]+$/;

  const validateReferralCode = (code) => {
    return ebayReferralRegex.test(code)
  };

  const handleReferralChange = (e) => {
    setReferralCode(e.target.value);
  };

  const handleSubmit = () => {
    if (referralCode && !validateReferralCode(referralCode)) {
      setError("Invalid referral code format.");
      return;
    }
    onSubmit(referralCode);
    onClose();
  };

  const handleSkip = () => {
    onSubmit(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Referral Code</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Input
            value={referralCode}
            onChange={handleReferralChange}
            placeholder="Enter referral code (optional)"
            className="w-full"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralDialog;
