import { AppConfig } from '@/AppConfig';
import { useAddCreditMutation } from '@/hooks/users';
import { UserProfile } from '@/types/entityTypes';
import useSettingsStore from '@/zustand/useSettingsStore';
import * as Dialog from '@radix-ui/react-dialog';
import { Rubik, Urbanist } from 'next/font/google';
import Image from 'next/image';
import { useState } from 'react';

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
});

const urban = Urbanist({
  subsets: ['latin'],
  display: 'swap',
});

const AddCreditModal = ({ profile }: { profile: UserProfile | undefined }) => {
  const prefilledAmount = [5, 10, 20, 50, 100, 200, 500, 1000];
  const [creditValue, setCreditValue] = useState(5);
  const [isShowMinCreditError, setIsShowMinCreditError] = useState(false);
  const { setIsPopModalVisible } = useSettingsStore(state => ({
    setIsPopModalVisible: state.setIsPopModalVisible,
  }));
  const addCreditMutation = useAddCreditMutation();

  const handleCreditButtonChange = (amount: number) => {
    setCreditValue(amount);
    setIsShowMinCreditError(false);
  };
  const handleMinCreditChange = (e: any) => {
    setCreditValue(e.target.value);
    if (e.target.value < 5) {
      setIsShowMinCreditError(true);
    } else {
      setIsShowMinCreditError(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsPopModalVisible(open);
    if (!open) {
      setCreditValue(5);
    }
  };

  const handleAddCreditButton = async () => {
    const { data } = await addCreditMutation.trigger({
      price_id: AppConfig.stripe.addCreditPriceId,
      quantity: creditValue,
    });
    window.open(data.url, '_self');
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="bg-white	rounded-full flex content-center justify-center w-full py-2 px-3"
        >
          <span className={`text-black text-center ${rubik.className} text-xs`}>Add Credits</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="backgroundPopup data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[380px] translate-x-[-50%] translate-y-[-50%] bg-[#3F3956] py-6 px-4 gap-4">
          <Dialog.Title className={`${rubik.className} font-geo-large text-white`}>
            Credit top up
          </Dialog.Title>
          <Dialog.Description
            className={`font-geo-small-subtitle text-[#ADABB0] ${urban.className}`}
          >
            Balance: ${profile?.credits ? profile.credits / 100 : 0.0}
          </Dialog.Description>
          <div className="pt-4">
            <div className="px-4 py-2 flex-column items-start gap-2 self-stretch rounded-lg bg-[#51496E]">
              <span className={`text-white ${urban.className} font-geo-regular`}>
                How many credits would you like to buy?
              </span>
              <div className="pt-2">
                <input
                  className={`bg-[#51496E] text-white font-geo-extra-large w-full border-none outline-none ${rubik.className}`}
                  placeholder="5"
                  onChange={handleMinCreditChange}
                  value={creditValue}
                  type="number"
                />
                {isShowMinCreditError && (
                  <span className={`text-[#EE7A7A] font-geo-small ${urban.className} `}>
                    {' '}
                    The minimum amount is $5{' '}
                  </span>
                )}
              </div>
            </div>
            <div
              className={`pt-4 flex self-stretch gap-1 flex-wrap items-center content-center ${urban.className}`}
            >
              {prefilledAmount.map((amount, index) => (
                <button
                  key={index}
                  className={`${
                    amount === creditValue ? 'amountButtonSelected' : 'amountButtonNotSelected'
                  }`}
                  type="button"
                  onClick={() => handleCreditButtonChange(amount)}
                >
                  $ {amount}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Dialog.Close asChild>
              <button
                onClick={handleAddCreditButton}
                type="submit"
                className="bg-[#7553FF] h-[48px] items-center justify-center rounded-[4px] px-[15px] font-medium text-white w-full rounded-full"
              >
                Continue
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className="absolute top-6 right-4" aria-label="Close" type="button">
              <Image
                src="/chat/close.svg"
                alt="Close"
                width={24}
                height={24}
                className="shrink-0"
              />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddCreditModal;
