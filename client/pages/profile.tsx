import { useEffect } from 'react'
import ProfileHeader from '../components/Profile/ProfileHeader'
import ProfileTweets from '../components/Profile/ProfileTweets'
import Sidebar from '../components/Sidebar'
import Widgets from '../components/Widgets'
import { useTwitterContext } from '../context/TwitterContext'
import { useRouter } from 'next/router'

const style = {
  wrapper: `flex justify-center min-h-screen w-full select-none bg-[#15202b] text-white`,
  content: `max-w-[1400px] w-full flex justify-between px-4`,
  mainContent: `flex-[2] border-r border-l border-[#38444d] overflow-y-scroll`
}

const Profile = () => {
  const { currentAccount, appStatus } = useTwitterContext()
  const router = useRouter()

  useEffect(() => {
    if (!currentAccount && appStatus !== 'loading') {
      router.push('/')
    }
  }, [currentAccount, appStatus, router])

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <Sidebar initialSelectedIcon={'Profile'} />
        <div className={style.mainContent}>
          <ProfileHeader />
          <ProfileTweets />
        </div>
        <Widgets />
      </div>
    </div>
  )
}

export default Profile