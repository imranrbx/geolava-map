import tw from 'tailwind-styled-components';
import { Urbanist, Rubik } from 'next/font/google';

import useMapStore from '@/zustand/useMapStore';
import Image from 'next/image';
import useChatStore from '@/zustand/useChatStore';
import { UserProfile } from '@/types/entityTypes';
import { useUserAvatar } from '@/hooks/users';
import useSettingsStore from '@/zustand/useSettingsStore';
import AddCreditModal from '../common/AddCreditModal';
import UpgradePlanModal from '../common/UpgradePlanModal';
import ThemeToggle from '../layout/ThemeToggle/theme-toggle';

const StyledSidebar = tw.div`
  h-screen
  items-start
  shrink-0
  gap-96
  bg-primary
  backdrop-blur-[6.945000171661377px]
  w-[189px]
`;

const urban = Urbanist({
  subsets: ['latin'],
  display: 'swap',
});

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
});

function Sidebar({ profile }: { profile: UserProfile | undefined }) {
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded);
  const { url } = useUserAvatar(profile?.id || '');
  const { resetChat } = useChatStore();
  const { isProfileModalVisible, setIsProfileModalVisible, setIsTopProfileModalVisible } =
    useSettingsStore(state => ({
      isProfileModalVisible: state.isProfileModalVisible,
      setIsProfileModalVisible: state.setIsProfileModalVisible,
      setIsTopProfileModalVisible: state.setIsTopProfileModalVisible,
    }));

  const handleNewChat = () => {
    resetChat();
  };

  const handleProfileModal = () => {
    setIsTopProfileModalVisible(false);
    setIsProfileModalVisible(!isProfileModalVisible);
  };

  return isMapGlLoaded ? (
    <StyledSidebar>
      <div className="flex gap-5 p-4 border-white border-b border-solid border-opacity-20 justify-between">
        <a href="https://geolava.com">
          <Image
            height={27}
            width={106}
            className="flex-shrink-0 max-w-[106px] max-h-[27px]"
            src="/chat/geolavalogo.svg"
            alt="AI Logo"
          />
        </a>
        <Image
          height={16}
          width={16}
          src="/chat/arrow-close.svg"
          alt="close"
          className="shrink-0 my-auto w-4 aspect-square"
        />
      </div>
      <div className="flex flex-col px-4 mt-6 w-full font-medium leading-[130%] mb-[603px]">
        <button
          type="button"
          onClick={handleNewChat}
          className={`px-4 py-3 border border-solid backdrop-blur-[25.44419288635254px] bg-white bg-opacity-20 border-white border-opacity-20 rounded-[100px] font-medium not-italic text-sm tracking-wide leading-5 text-gray ${urban.className}`}
        >
          New Chat
        </button>
        <div className="flex gap-2 mt-6">
          <Image
            height={16}
            width={16}
            src="/chat/archive.svg"
            alt="archive"
            className="flex-shrink-0 my-auto w-4 aspect-square"
          />
          <div
            className={`font-medium not-italic text-base tracking-wide leading-5 text-white ${urban.className}`}
          >
            Chat History
          </div>
        </div>
        <div className="bottom-0 inset-x-0 absolute">
          <div className="flex-column gap-2 text-white px-3 py-6">
            <div>
              <Image
                height={16}
                width={12}
                src="/chat/filled-star.svg"
                alt="star-filled"
                className="shrink-0"
              />
            </div>
            <div>
              <span className={`${rubik.className} text-xs`}>Try Geolava Unlimited</span>
            </div>
            <div>
              <span className={`${urban.className} text-xs text-[#EFEBFF]`}>
                Unlock new possibilities
              </span>
            </div>
            <div className="pt-2 flex">
              <UpgradePlanModal profile={profile} />
            </div>
          </div>
          <div className="flex items-center justify-center self-stretch p-3">
            <ThemeToggle />
          </div>
          <div
            className={`flex flex-row font-geo-regular gap-2 text-white ${urban.className} p-3 border-white border-t border-solid border-opacity-20`}
          >
            {url && (
              <Image
                height={32}
                width={32}
                alt="profile-pic"
                src={url}
                priority
                className="w-8 h-8 rounded-full profile-pic"
              />
            )}
            <div className="flex flex-row gap-1 items-center justify-center">
              {profile?.first_name}
              {isProfileModalVisible ? (
                <Image
                  height={16}
                  width={16}
                  alt="chevron-up"
                  src="/chat/chevron-up.svg"
                  onClick={handleProfileModal}
                />
              ) : (
                <Image
                  height={16}
                  width={16}
                  alt="chevron-down"
                  src="/chat/chevron-down.svg"
                  onClick={handleProfileModal}
                />
              )}
            </div>
          </div>
          <div className="flex-column gap-2 px-3 py-4 border-white border-t border-solid border-opacity-20">
            <div className="flex items-center self-stretch gap-1">
              <div className="group">
                <Image height={16} width={16} alt="info" src="/chat/Info-Icon.svg" />
                <div
                  className={`hidden group-hover:block font-geo-small-subtitle text-white ${urban.className} flex absolute bottom-20 py-1 px-4 gap-[10px] items-center justify-center info-block w-[165px]`}
                >
                  Our credit balance will be consumed as you use the API or Web page
                </div>
              </div>
              <span className={`text-white ${urban.className}`}>
                <span className="font-color-geo font-geo-description">
                  ${profile?.credits ? profile.credits / 100 : 0}
                </span>{' '}
                <span className="font-geo-small-subtitle">credits balance</span>
              </span>
            </div>
            <div className="pt-2">
              <AddCreditModal profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </StyledSidebar>
  ) : null;
}

export default Sidebar;
