import Image from 'next/image';
import { Urbanist, Rubik } from 'next/font/google';

import { useUserAvatar } from '@/hooks/users';
import { UserProfile } from '@/types/entityTypes';
import useSettingsStore from '@/zustand/useSettingsStore';
import { use, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/authContext';
import UpgradePlanModal from './UpgradePlanModal';

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
});

const urban = Urbanist({
  subsets: ['latin'],
  display: 'swap',
});

function ProfileInfoModal({ profile }: { profile: UserProfile | undefined }) {
  const { url } = useUserAvatar(profile?.id || '');
  const { handleLogout } = useContext(AuthContext);
  const setIsProfileModalVisible = useSettingsStore(state => state.setIsProfileModalVisible);
  const setIsTopProfileModalVisible = useSettingsStore(state => state.setIsTopProfileModalVisible);
  const isPopModalVisible = useSettingsStore(state => state.isPopModalVisible);

  const handleProfileModal = () => {
    setIsProfileModalVisible(false);
    setIsTopProfileModalVisible(false);
  };

  return (
    <div className={`profileInfo ${isPopModalVisible ? 'opacity-0' : ''}`}>
      <div className="flex justify-between items-start self-stretch">
        {url && (
          <Image
            height={48}
            width={48}
            alt="profile-pic"
            src={url}
            priority
            className="rounded-full profile-pic"
          />
        )}
        <Image
          height={16}
          width={16}
          src="/chat/close.svg"
          alt="Close"
          className="absolute top-4 right-4"
          onClick={handleProfileModal}
        />
      </div>
      <div className="text-white flex flex-col items-start gap-1 self-stretch">
        <span className={`${rubik.className} font-geo-large`}>
          {profile?.first_name} {profile?.last_name}
        </span>
        <span className={`${urban.className} font-geo-small-subtitle`}>{profile?.email}</span>
      </div>
      <div className="flex p-2 flex-col items-start gap-2 self-stretch profileInfo-upgrade">
        <div className="flex flex-col items-start gap-1 self-stretch">
          <span className={`text-white ${urban.className} font-geo-small-subtitle`}>
            Current Plan
          </span>
          <div className="flex gap-1">
            <Image
              height={11.825}
              width={9}
              src="/chat/geolavaIconWhite.svg"
              alt="geo-lava-icon"
              className="shrink-0"
            />
            <span className={`${urban.className} font-geo-description capitalize text-[#EFEBFF]`}>
              {profile?.subscriptions}
            </span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <UpgradePlanModal profile={profile} isProfileInfoButton />
            {profile?.subscriptions !== 'pro' && profile?.subscriptions !== 'unlimited' ? (
              <span className={`${urban.className} text-white font-geo-small-subtitle`}>
                Upgrade to have access to more functionalities
              </span>
            ) : (
              <span className={`${urban.className} text-[#EE7A7A] font-geo-small-subtitle`}>
                Cancel Plan
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="text-white">
        <button onClick={handleLogout} type="submit">
          <span className={`${rubik.className} text-xs`}>Log out</span>
        </button>
      </div>
    </div>
  );
}

export default ProfileInfoModal;
