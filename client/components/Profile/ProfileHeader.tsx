import { useEffect, useState } from 'react'
import { BsArrowLeftShort } from 'react-icons/bs'
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import { useTwitterContext } from '../../context/TwitterContext'

Modal.setAppElement('#__next')

const style = {
  wrapper: `border-[#38444d] border-b`,
  header: `py-1 px-3 mt-2 flex items-center`,
  primary: `bg-transparent outline-none font-bold`,
  secondary: `text-[#8899a6] text-xs`,
  backButton: `text-3xl cursor-pointer mr-2 rounded-full hover:bg-[#313b44] p-1`,
  coverPhotoContainer: `flex items-center justify-center h-[15vh] overflow-hidden`,
  coverPhoto: `object-cover h-full w-full`,
  profileImageContainer: `w-full h-[6rem] rounded-full mt-[-3rem] mb-2 flex justify-start items-center px-3 flex justify-between`,
  profileImage: `object-cover rounded-full h-full`,
  profileImageNft: `object-cover h-full`,
  profileImageMint: `bg-white text-black px-3 py-1 rounded-full hover:bg-[#8899a6] cursor-pointer`,
  details: `px-3`,
  nav: `flex justify-around mt-4 mb-2 text-xs font-semibold text-[#8899a6]`,
  activeNav: `text-white`,
  editButton: `bg-[#1d9bf0] text-white px-3 py-1 rounded-full hover:bg-[#1a8cd8] cursor-pointer ml-auto text-sm font-bold`,
  modalWrapper: `h-[80vh] w-[35vw] text-white bg-[#15202b] rounded-3xl px-4 py-4`,
  modalHeader: `flex justify-between items-center border-b border-[#38444d] pb-3`,
  modalTitle: `text-xl font-bold`,
  closeButton: `text-[#8899a6] hover:text-white cursor-pointer`,
  formField: `flex flex-col mt-4`,
  input: `bg-transparent border border-[#38444d] rounded-md p-2 mt-1 outline-none`,
  saveButton: `bg-[#1d9bf0] text-white px-3 py-2 rounded-full hover:bg-[#1a8cd8] cursor-pointer mt-5 font-bold`
}

interface Tweets {
  tweet: string
  timestamp: string
}

interface UserData {
  name: string
  profileImage: string
  coverImage: string
  walletAddress: string
  tweets: Array<Tweets>
  isProfileImageNft: Boolean | undefined
}

interface ProfileHeaderProps {
  userData?: UserData
  isProfilePage?: boolean
}

const ProfileHeader = ({ userData, isProfilePage = false }: ProfileHeaderProps) => {
  const { currentUser, currentAccount, updateUserProfile } = useTwitterContext()
  const router = useRouter()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    profileImage: '',
    coverImage: ''
  })
  const [profileData, setProfileData] = useState<UserData>({
    name: '',
    profileImage: '',
    coverImage: '',
    walletAddress: '',
    tweets: [],
    isProfileImageNft: undefined
  })

  useEffect(() => {
    if (userData) {
      setProfileData(userData)
    } else if (currentUser) {
      setProfileData({
        name: currentUser.name,
        profileImage: currentUser.profileImage,
        walletAddress: currentUser.walletAddress,
        coverImage: currentUser.coverImage,
        tweets: currentUser.tweets,
        isProfileImageNft: currentUser.isProfileImageNft
      })
    }

    setFormData({
      name: profileData.name || '',
      profileImage: profileData.profileImage || '',
      coverImage: profileData.coverImage || ''
    })
  }, [currentUser, userData, profileData.name, profileData.profileImage, profileData.coverImage])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    const success = await updateUserProfile(formData)
    if (success) {
      setEditModalOpen(false)
    }
  }

  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        <div onClick={() => router.push('/')} className={style.backButton}>
          <BsArrowLeftShort />
        </div>
        <div className={style.details}>
          <div className={style.primary}>{profileData.name}</div>
          <div className={style.secondary}>
            {profileData.tweets?.length} Tweets
          </div>
        </div>
      </div>
      <div className={style.coverPhotoContainer}>
        <img
          src={profileData.coverImage || 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop'}
          alt='cover'
          className={style.coverPhoto}
        />
      </div>
      <div className={style.profileImageContainer}>
        <div className={profileData.isProfileImageNft ? 'hex' : style.profileImageContainer}>
          <img
            src={profileData.profileImage}
            alt={profileData.walletAddress}
            className={profileData.isProfileImageNft ? style.profileImageNft : style.profileImage}
          />
        </div>
        {currentAccount === profileData.walletAddress && !isProfilePage && (
          <button 
            className={style.editButton}
            onClick={() => setEditModalOpen(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
      <div className={style.details}>
        <div>
          <div className={style.primary}>{profileData.name}</div>
        </div>
        <div className={style.secondary}>
          {profileData.walletAddress && (
            <>
              @{profileData.walletAddress.slice(0, 8)}...{profileData.walletAddress.slice(37)}
            </>
          )}
        </div>
      </div>
      <div className={style.nav}>
        <div className={style.activeNav}>Tweets</div>
        <div>Tweets & Replies</div>
        <div>Media</div>
        <div>Likes</div>
      </div>

      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)'
          },
          content: {
            border: 'none',
            background: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }
        }}
      >
        <div className={style.modalWrapper}>
          <div className={style.modalHeader}>
            <h2 className={style.modalTitle}>Edit Profile</h2>
            <div 
              className={style.closeButton}
              onClick={() => setEditModalOpen(false)}
            >
              ✕
            </div>
          </div>

          <div>
            <div className={style.formField}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={style.input}
                placeholder="Your name"
              />
            </div>

            <div className={style.formField}>
              <label htmlFor="profileImage">Profile Image URL</label>
              <input
                type="text"
                id="profileImage"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                className={style.input}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className={style.formField}>
              <label htmlFor="coverImage">Cover Image URL</label>
              <input
                type="text"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className={style.input}
                placeholder="https://example.com/cover.jpg"
              />
            </div>

            <button 
              className={style.saveButton}
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProfileHeader