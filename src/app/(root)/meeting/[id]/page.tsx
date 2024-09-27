'use client'

import Loader from '@/components/loader';
import MeetingRoom from '@/components/meeting-room';
import MeetingSetup from '@/components/meeting-setup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'

const Page = ({ params }: { params: { id: string } }) => {

  const { user, isLoaded } = useUser();

  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(false);

  const { call, isCallLoading } = useGetCallById(params.id);

  if (!isLoaded || isCallLoading) return <Loader />

  return (
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>

          {!isSetupComplete && <MeetingSetup setIsSetupComplete={setIsSetupComplete} />}
          {isSetupComplete && <MeetingRoom />}

        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Page