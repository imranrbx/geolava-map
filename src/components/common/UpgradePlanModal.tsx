import { AppConfig } from '@/AppConfig';
import { useAddCreditMutation } from '@/hooks/users';
import { UserProfile } from '@/types/entityTypes';
import useSettingsStore from '@/zustand/useSettingsStore';
import * as Dialog from '@radix-ui/react-dialog';
import { Rubik, Urbanist } from 'next/font/google';
import Image from 'next/image';

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
});

const urban = Urbanist({
  subsets: ['latin'],
  display: 'swap',
});

interface Props {
  isProfileInfoButton?: boolean;
  profile: UserProfile | undefined;
}

const UpgradePlanModal = ({ profile, isProfileInfoButton = false }: Props) => {
  const { setIsPopModalVisible, setIsProfileModalVisible, setIsTopProfileModalVisible } =
    useSettingsStore(state => ({
      setIsPopModalVisible: state.setIsPopModalVisible,
      setIsProfileModalVisible: state.setIsProfileModalVisible,
      setIsTopProfileModalVisible: state.setIsTopProfileModalVisible,
    }));
  const addCreditMutation = useAddCreditMutation();

  const handleOpenChange = (open: boolean) => {
    setIsPopModalVisible(open);
    if (!open) {
      setIsProfileModalVisible(false);
      setIsTopProfileModalVisible(false);
    }
  };

  const handleProButton = async () => {
    const { data } = await addCreditMutation.trigger({
      price_id: AppConfig.stripe.proPlanPriceId,
      quantity: 1,
    });
    window.open(data.url, '_self');
  };

  const handleUnlimitedButton = async () => {
    const { data } = await addCreditMutation.trigger({
      price_id: AppConfig.stripe.unlimitedPlanPriceId,
      quantity: 1,
    });
    window.open(data.url, '_self');
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        {isProfileInfoButton ? (
          <button
            type="button"
            className={`${profile?.subscriptions === 'unlimited' ? 'downgradePlanButton' : 'upgradePlanButton'} flex h-[32px] justify-center items-center gap-2 py-2 px-3`}
          >
            <span className={`${rubik.className} text-white font-geo-small`}>
              {profile?.subscriptions === 'unlimited' ? 'Downgrade' : 'Upgrade'}
            </span>
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full flex content-center justify-center py-2 px-3 border border-solid border-[#36B5EE]"
          >
            <span className={`text-black text-center ${rubik.className} text-xs pr-2`}>
              Upgrade plan
            </span>
            <Image
              height={16}
              width={16}
              src="/chat/arrow-right.svg"
              alt="right"
              className="shrink-0"
            />
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="backgroundPopup data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed flex flex-col items-start top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[875px] translate-x-[-50%] translate-y-[-50%] bg-[#3F3956] pt-8 pb-6 px-6 gap-4 rounded-3xl">
          <Dialog.Title className={`${rubik.className} font-geo-large text-white`}>
            Upgrade your plan
          </Dialog.Title>
          <div className="flex items-start gap-4 self-stretch">
            <div className="flex flex-col items-start flex-1 max-h-[519px] upgradePlanBorder">
              <div className="flex px-6 pt-6 flex-col items-start gap-4 self-stretch">
                <div className="flex items-center gap-4 self-stretch">
                  <Image
                    height={24}
                    width={24}
                    src="/chat/geolavaIcon.svg"
                    alt="geolavaIcon"
                    className="shrink-0"
                  />
                  <span className={`${rubik.className} text-white flex font-geo-large-header`}>
                    Pro
                  </span>
                </div>
                <span className={`${urban.className} text-white font-geo-description`}>
                  Advanced model & tooling access
                </span>
                <div className="font-geo-extra-large upgradePlanPrice">
                  $25<span className="text-lg align-middle">/month</span>
                </div>
                <hr className="h-2 upgradePlanHorizontalLine" />
                <div className="flex flex-col gap-6 self-stretch">
                  <span className={`${rubik.className} text-white flex font-geo-large-header`}>
                    Features
                  </span>
                  <div className="gap-4">
                    <div className="flex gap-4 mb-4">
                      <Image
                        height={16}
                        width={16}
                        src="/chat/check.svg"
                        alt="CheckIcon"
                        className="shrink-0"
                      />
                      <span
                        className={`${urban.className} font-geo-regular upgradePlanFeatureList`}
                      >
                        Pay as you go per query *
                      </span>
                    </div>
                    <div className="flex gap-4 mb-4">
                      <Image
                        height={16}
                        width={16}
                        src="/chat/check.svg"
                        alt="CheckIcon"
                        className="shrink-0"
                      />
                      <span
                        className={`${urban.className} font-geo-regular upgradePlanFeatureList`}
                      >
                        Access to advanced models
                      </span>
                    </div>
                    <div className="flex gap-4 mb-4">
                      <Image
                        height={16}
                        width={16}
                        src="/chat/check.svg"
                        alt="CheckIcon"
                        className="shrink-0"
                      />
                      <span
                        className={`${urban.className} font-geo-regular upgradePlanFeatureList`}
                      >
                        Upload & analyze data
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 my-8 items-center">
                    <Dialog.Close asChild>
                      <button
                        type="submit"
                        className="upgradePlanButton h-[48px] items-center justify-center px-[15px] font-medium text-white w-full flex "
                        onClick={handleProButton}
                      >
                        {profile?.subscriptions === 'pro' ? 'Current Plan' : 'Choose Pro'}
                        <Image
                          height={16}
                          width={16}
                          src="/chat/arrow-right.svg"
                          alt="RightArrowIcon"
                          className="shrink-0 ml-1"
                        />
                      </button>
                    </Dialog.Close>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start flex-1 max-h-[519px] upgradePlanBorder">
              <div className="flex px-6 pt-6 flex-col items-start gap-4 self-stretch">
                <div className="flex items-center gap-4 self-stretch">
                  <Image
                    height={24}
                    width={24}
                    src="/chat/geolavaIcon.svg"
                    alt="geolavaIcon"
                    className="shrink-0"
                  />
                  <span className={`${rubik.className} text-white font-geo-large-header`}>
                    Unlimited
                  </span>
                </div>
                <span className={`${urban.className} text-white font-geo-description`}>
                  Unlimited queries
                </span>
                <div className="font-geo-extra-large upgradePlanPrice">
                  $490<span className="text-lg align-middle">/month</span>
                </div>
                <hr className="h-2 upgradePlanHorizontalLine" />
                <div className="flex flex-col gap-6 self-stretch">
                  <span className={`${rubik.className} text-white flex font-geo-large-header`}>
                    Features
                  </span>
                  <div className="gap-4">
                    <div className="flex gap-4 mb-4">
                      <Image
                        height={16}
                        width={16}
                        src="/chat/check.svg"
                        alt="CheckIcon"
                        className="shrink-0"
                      />
                      <span
                        className={`${urban.className} font-geo-regular upgradePlanFeatureList`}
                      >
                        Everything <span className="font-color-geo">Pro</span>
                      </span>
                    </div>
                    <div className="flex gap-4 mb-4">
                      <Image
                        height={16}
                        width={16}
                        src="/chat/check.svg"
                        alt="CheckIcon"
                        className="shrink-0"
                      />
                      <span
                        className={`${urban.className} font-geo-regular upgradePlanFeatureList`}
                      >
                        Larger file uploads
                      </span>
                    </div>
                    <div className="flex gap-4 mb-4">
                      <Image
                        height={16}
                        width={16}
                        src="/chat/check.svg"
                        alt="CheckIcon"
                        className="shrink-0"
                      />
                      <span
                        className={`${urban.className} font-geo-regular upgradePlanFeatureList`}
                      >
                        Admin controls, central billing
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 my-8 items-center">
                    <Dialog.Close asChild>
                      <button
                        type="submit"
                        className="upgradePlanButton h-[48px] items-center justify-center px-[15px] font-medium text-white w-full flex"
                        onClick={handleUnlimitedButton}
                      >
                        {profile?.subscriptions === 'unlimited'
                          ? 'Current Plan'
                          : 'Choose Unlimited'}
                        <Image
                          height={16}
                          width={16}
                          src="/chat/arrow-right.svg"
                          alt="RightArrowIcon"
                          className="shrink-0 ml-1"
                        />
                      </button>
                    </Dialog.Close>
                  </div>
                </div>
              </div>
            </div>
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

export default UpgradePlanModal;
