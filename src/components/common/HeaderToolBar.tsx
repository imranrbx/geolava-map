import Image from 'next/image';
import { useUserAvatar } from '@/hooks/users';
import { UserProfile } from '@/types/entityTypes';
import useSettingsStore from '@/zustand/useSettingsStore';
import MapLineButton from './MapLineButton';
import MapPinButton from './MapPinButton';
import MapPolygonButton from './MapPolygonButton';
import MapSelectButton from './MapSelectButton';
import ShareButton from './Sharebutton';
import MapCommentButton from './MapCommentButton';
import MapPictureButton from './MapPictureButton';
import MapUploadButton from './MapUploadButton';
import Tooltip from './Tooltip';

const HeaderToolBar = ({ profile }: { profile: UserProfile | undefined }) => {
  const { url } = useUserAvatar(profile?.id || '');
  const isLocked = profile?.subscriptions !== 'pro' && profile?.subscriptions !== 'unlimited';
  const {
    isTopProfileModalVisible,
    setIsTopProfileModalVisible,
    setIsProfileModalVisible,
    isPopModalVisible,
  } = useSettingsStore(state => ({
    isTopProfileModalVisible: state.isTopProfileModalVisible,
    setIsTopProfileModalVisible: state.setIsTopProfileModalVisible,
    setIsProfileModalVisible: state.setIsProfileModalVisible,
    isPopModalVisible: state.isPopModalVisible,
  }));

  const handleProfileModal = () => {
    setIsProfileModalVisible(false);
    setIsTopProfileModalVisible(!isTopProfileModalVisible);
  };

  return (
    <div className="flex px-4	pt-4 pb-2 justify-end items-center">
      <div
        className={`flex items-center px-2 py-1 gap-2 rounded-3xl bg-[#51496E] ${isPopModalVisible ? 'z-0' : 'z-50'}`}
      >
        <div className={`flex items-center p-1 gap-1 ${isLocked ? 'opacity-50' : ''}`}>
          <Tooltip text="Add pin">
            <MapPinButton disabled={isLocked} />
          </Tooltip>
          <Tooltip text="Add polygon">
            <MapPolygonButton disabled={isLocked} />
          </Tooltip>
          <Tooltip text="Add line">
            <MapLineButton disabled={isLocked} />
          </Tooltip>
          <Tooltip text="Select area">
            <MapSelectButton disabled={isLocked} />
          </Tooltip>
          <Tooltip text="Upload files">
            <MapUploadButton disabled={isLocked} />
          </Tooltip>
          <Tooltip text="Add image">
            <MapPictureButton disabled={isLocked} />
          </Tooltip>
          <Tooltip text="Comment">
            <MapCommentButton disabled={isLocked} />
          </Tooltip>
          <ShareButton disabled={isLocked} />
        </div>
        <div className="flex gap-1 items-center">
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
          {isTopProfileModalVisible ? (
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
      {isLocked && (
        <>
          <Image
            src="/chat/lock.svg"
            width={32}
            height={32}
            alt="lock"
            className={`absolute top-[8px] right-[160px] p-1 gap-1 items-center ${isPopModalVisible ? 'z-0' : 'z-50'}`}
          />

          <Image
            src="/chat/lock.svg"
            width={32}
            height={32}
            alt="lock"
            className={`absolute top-[8px] right-[48px] p-1 gap-1 items-center ${isPopModalVisible ? 'z-0' : 'z-50'}`}
          />
        </>
      )}
    </div>
  );
};

export default HeaderToolBar;
