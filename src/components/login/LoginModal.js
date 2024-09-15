/* eslint-disable react/prop-types */
import { useState } from "react";

import { Dialog } from '@headlessui/react';
import LoginModalContainer from './LoginModalContainer';
import LoginModalUserPhone from './LoginModalUserPhone';
import ConfirmPhoneOTP from './ConfirmPhoneOTP';

export default function LoginModal({ isOpen, onClose }) {

  const [step, setStep] = useState(1);
  const handleClose = () => {
    setStep(1); 
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black opacity-60" aria-hidden="true"></div>
      <div className="flex items-center justify-center min-h-screen px-4">
      <Dialog.Panel className="bg-white rounded-lg relative w-full max-w-md px-4 h-auto">
          
          <div className="flex justify-end pe-9 mt-4">
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={handleClose}
            >
              <svg
                className="w-9 h-9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

        {/* body section */}
        {step == 1 && <LoginModalContainer setStep={setStep} />}
        {step == 2 && <LoginModalUserPhone setStep={setStep} />}
        {step == 3 && <ConfirmPhoneOTP setStep={setStep}/>}

        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
