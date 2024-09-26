'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './home-card'
import { useRouter } from 'next/navigation'
import MeetingModal from './meeting-modal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from '@/hooks/use-toast'

const MeetingTypeList = () => {

    const router = useRouter();

    const { toast } = useToast();

    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: "",
        link: ''
    });
    const [callDetails, setCallDetails] = useState<Call>()

    const { user } = useUser();
    const client = useStreamVideoClient();

    const createMeeting = async () => {
        if (!client || !user) return;
        try {
            if (!values.dateTime) {
                toast({ title: "Please select date and time",  })
                return;
            }
            const id = crypto.randomUUID();
            const call = client.call('default', id);
            if (!call) throw new Error('Failed to create call');
            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'Instant Meeting';
            await call.getOrCreate({ 
                data: { 
                    starts_at: startsAt,
                    custom: { description: description }
                } 
            })
            setCallDetails(call);
            if (!values.description) router.push(`/meeting/${call.id}`)
            toast({ title: "Meeting has been created",  })
        } catch (err) {
            console.log(err);
            toast({ title: "Failed to create meeting" })
        }

    }

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>

        <HomeCard 
            img='/icons/add-meeting.svg' 
            title='New Meeting' 
            description='Start an instant meeting'
            handleClick={() => { setMeetingState('isInstantMeeting') }}
            className='bg-orange-1'
        />
        <HomeCard 
            img='/icons/schedule.svg' 
            title='Schedule Meeting' 
            description='Plan your meeting'
            handleClick={() => { setMeetingState('isScheduleMeeting') }}
            className='bg-blue-1'
        />
        <HomeCard 
            img='/icons/recordings.svg' 
            title='View Recordings' 
            description='Check out your recordings'
            handleClick={() => { router.push('/recordings') }}
            className='bg-purple-1'
        />
        <HomeCard 
            img='/icons/join-meeting.svg' 
            title='Join Meeting' 
            description='Join Via Invitation Link'
            handleClick={() => { setMeetingState('isJoiningMeeting') }}
            className='bg-yellow-1'
        />

        <MeetingModal
            isOpen={meetingState === 'isInstantMeeting'}
            onClose={() => { setMeetingState(undefined) }}
            title='Star an Instant Meeting'
            className='text-center'
            buttonText='Start Meeting'
            handleClick={createMeeting}
        />

    </section>
  )
}

export default MeetingTypeList