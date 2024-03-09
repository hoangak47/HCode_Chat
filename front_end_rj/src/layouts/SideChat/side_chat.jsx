import React from 'react';
import { useSelector } from 'react-redux';
import Contacts from '~/components/contacts';
import Group from '~/components/group';
import Message from '~/components/message';
import Profile from '~/components/profile';
import Setting from '~/components/setting';

function Side_chat({ socketRef }) {
    const tab = useSelector((state) => state.tab.tab);

    const switchScreen = () => {
        switch (tab) {
            case 'Profile':
                return <Profile />;
            case 'Message':
                return <Message />;
            case 'Contacts':
                return <Contacts socketRef={socketRef} />;
            case 'Group':
                return <Group socketRef={socketRef} />;
            case 'Setting':
                return <Setting />;
            default:
                return <Message />;
        }
    };

    return <div className="flex lg:w-96 w-full h-full lg:py-4 lg:px-3 flex-col bg-fourth-color">{switchScreen()}</div>;
}

export default Side_chat;
