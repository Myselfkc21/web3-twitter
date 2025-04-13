import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ProfileHeader from '../../components/Profile/ProfileHeader'
import ProfileTweets from '../../components/Profile/ProfileTweets'
import Sidebar from '../../components/Sidebar'
import Widgets from '../../components/Widgets'
import { useTwitterContext } from '../../context/TwitterContext'
import { client } from '../../utils/sanity'

const style = {
  wrapper: `flex justify-center min-h-screen w-full select-none bg-[#15202b] text-white`,
  content: `max-w-[1400px] w-full flex justify-between px-4`,
  mainContent: `flex-[2] border-r border-l border-[#38444d] overflow-y-scroll`,
  loading: `flex items-center justify-center h-screen text-xl`
}

interface UserData {
  name: string
  profileImage: string
  coverImage: string
  walletAddress: string
  tweets: Array<any>
  isProfileImageNft: Boolean | undefined
}

const UserProfile = () => {
  const router = useRouter()
  const { id } = router.query
  const { appStatus } = useTwitterContext()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    if (typeof id !== 'string') return
    
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const query = `
          *[_type == "users" && _id == "${id}"]{
            "tweets": tweets[]->{timestamp, tweet, image}|order(timestamp desc),
            name,
            profileImage,
            isProfileImageNft,
            coverImage,
            walletAddress
          }
        `
        const response = await client.fetch(query)
        
        if (response && response.length > 0) {
          setUserData({
            name: response[0].name,
            profileImage: response[0].profileImage,
            walletAddress: response[0].walletAddress || id,
            coverImage: response[0].coverImage,
            tweets: response[0].tweets || [],
            isProfileImageNft: response[0].isProfileImageNft,
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  if (loading) {
    return (
      <div className={style.wrapper}>
        <div className={style.loading}>Loading profile...</div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className={style.wrapper}>
        <div className={style.loading}>User not found</div>
      </div>
    )
  }

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <Sidebar initialSelectedIcon={'Profile'} />
        <div className={style.mainContent}>
          <ProfileHeader userData={userData} isProfilePage={true} />
          <ProfileTweets userData={userData} />
        </div>
        <Widgets />
      </div>
    </div>
  )
}

export default UserProfile 